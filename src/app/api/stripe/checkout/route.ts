// src/app/api/stripe/checkout/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json(
      { message: 'Stripe is not configured yet. Payments are coming soon.' },
      { status: 503 }
    )
  }

  try {
    const { items, guestEmail } = await request.json()
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    let orderId: string | null = null
    const supabase = createClient()
    if (supabase) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const subtotal = items.reduce(
          (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
          0
        )

        // The "orders_insert_own_or_guest" RLS policy already permits this
        // insert (auth.uid() = user_id, or user_id is null for guests), so
        // use the session client here instead of the service-role client.
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user?.id ?? null,
            guest_email: user ? null : (guestEmail ?? null),
            status: 'pending',
            subtotal,
            shipping_cost: 0,
            total: subtotal,
          })
          .select()
          .single()

        // order_items has no guest insert policy (see 0003_orders_cart_newsletter.sql):
        // an unconditional guest-insert policy would let any anonymous client
        // append arbitrary rows to any order whose id it learns. The
        // service-role client is still required for this insert only.
        const supabaseAdmin = createAdminClient()
        if (!supabaseAdmin) {
          throw new Error('Supabase admin client not configured; cannot persist order items.')
        }

        if (orderError) {
          console.error('Order insert error:', orderError)
        } else if (order) {
          orderId = order.id

          const { error: itemsError } = await supabaseAdmin.from('order_items').insert(
            items.map((item: { variantId: string; productId: string; quantity: number; price: number }) => ({
              order_id: order.id,
              variant_id: item.variantId,
              product_id: item.productId,
              quantity: item.quantity,
              unit_price: item.price,
            }))
          )

          if (itemsError) {
            console.error('Order items insert error:', itemsError)
          }
        }
      } catch (persistErr) {
        console.error('Order persistence error:', persistErr)
      }
    } else {
      console.error('Supabase not configured; skipping order persistence.')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item: { productName: string; price: number; quantity: number; imageUrl: string | null }) => ({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.productName,
            ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
          },
        },
        quantity: item.quantity,
      })),
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      // Expire abandoned checkout sessions after 24h; the webhook's
      // checkout.session.expired handler marks the matching pending order
      // cancelled so unpaid orders don't accumulate in admin/order lists.
      expires_at: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      ...(orderId ? { metadata: { order_id: orderId } } : {}),
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ message: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
