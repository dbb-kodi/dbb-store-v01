// src/app/api/stripe/checkout/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { PRODUCTS } from '@/lib/data/catalog'

interface RequestItem {
  variantId: string
  quantity: number
}

// What the server decided an item costs. Nothing here comes from the request body.
interface ResolvedItem {
  variantId: string
  productId: string
  productName: string
  imageUrl: string | null
  unitPrice: number
  quantity: number
}

class CheckoutError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

function parseItems(raw: unknown): RequestItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new CheckoutError('Your bag is empty.', 400)
  }
  return raw.map((item) => {
    const variantId = (item as RequestItem)?.variantId
    const quantity = (item as RequestItem)?.quantity
    if (typeof variantId !== 'string' || !variantId) {
      throw new CheckoutError('Invalid item in bag.', 400)
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new CheckoutError('Invalid quantity.', 400)
    }
    return { variantId, quantity }
  })
}

// Resolve price and stock from the catalog fallback. Mirrors the Supabase-first /
// mock-fallback shape of src/lib/data/queries.ts, so checkout behaves the same way
// the storefront reads do when the backend isn't configured.
function resolveFromMock(items: RequestItem[]): ResolvedItem[] {
  return items.map(({ variantId, quantity }) => {
    const product = PRODUCTS.find((p) => p.variants.some((v) => v.id === variantId))
    const variant = product?.variants.find((v) => v.id === variantId)
    if (!product || !variant || !product.active) {
      throw new CheckoutError('That item is no longer available.', 400)
    }
    if (quantity > variant.stock_qty) {
      throw new CheckoutError(`Only ${variant.stock_qty} left of ${product.name} (${variant.size}).`, 409)
    }
    return {
      variantId,
      productId: product.id,
      productName: product.name,
      imageUrl: product.image_url,
      unitPrice: product.price,
      quantity,
    }
  })
}

// The authoritative path: price, stock and active-status all come from the database,
// keyed only by variant id. A client that posts price: 0.50 for a $120 hoodie gets
// charged $120, because the posted price is never read.
async function resolveItems(items: RequestItem[]): Promise<ResolvedItem[]> {
  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) return resolveFromMock(items)

  const { data, error } = await supabaseAdmin
    .from('variants')
    .select('id, size, stock_qty, product:products(id, name, price, image_url, active)')
    .in('id', items.map((i) => i.variantId))

  // Unconfigured or unseeded backend — same fallback the read layer uses.
  if (error || !data || data.length === 0) return resolveFromMock(items)

  return items.map(({ variantId, quantity }) => {
    const row = data.find((v: any) => v.id === variantId)
    const product = row?.product as any
    if (!row || !product || !product.active) {
      throw new CheckoutError('That item is no longer available.', 400)
    }
    if (quantity > row.stock_qty) {
      throw new CheckoutError(`Only ${row.stock_qty} left of ${product.name} (${row.size}).`, 409)
    }
    return {
      variantId,
      productId: product.id,
      productName: product.name,
      imageUrl: product.image_url ?? null,
      unitPrice: Number(product.price),
      quantity,
    }
  })
}

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json(
      { message: 'Stripe is not configured yet. Payments are coming soon.' },
      { status: 503 }
    )
  }

  try {
    const { items: rawItems, guestEmail } = await request.json()
    const resolved = await resolveItems(parseItems(rawItems))
    const subtotal = resolved.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    let orderId: string | null = null
    const supabase = createClient()
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

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

      // Fail closed. If the order row can't be written we must not create a Stripe
      // session: the charge would succeed with no order to reconcile it against,
      // and the webhook has no order_id to look up.
      if (orderError || !order) {
        console.error('Order insert error:', orderError)
        return NextResponse.json({ message: 'Checkout failed. Please try again.' }, { status: 500 })
      }
      orderId = order.id

      // order_items has no guest insert policy (see 0003_orders_cart_newsletter.sql):
      // an unconditional guest-insert policy would let any anonymous client
      // append arbitrary rows to any order whose id it learns. The
      // service-role client is still required for this insert only.
      const supabaseAdmin = createAdminClient()
      if (!supabaseAdmin) {
        console.error('Supabase admin client not configured; cannot persist order items.')
        return NextResponse.json({ message: 'Checkout failed. Please try again.' }, { status: 500 })
      }

      const { error: itemsError } = await supabaseAdmin.from('order_items').insert(
        resolved.map((item) => ({
          order_id: order.id,
          variant_id: item.variantId,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
        }))
      )

      if (itemsError) {
        console.error('Order items insert error:', itemsError)
        return NextResponse.json({ message: 'Checkout failed. Please try again.' }, { status: 500 })
      }
    } else {
      console.error('Supabase not configured; skipping order persistence.')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: resolved.map((item) => ({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.unitPrice * 100),
          product_data: {
            name: item.productName,
            ...(item.imageUrl && !item.imageUrl.startsWith('data:') ? { images: [item.imageUrl] } : {}),
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
    if (err instanceof CheckoutError) {
      return NextResponse.json({ message: err.message }, { status: err.status })
    }
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ message: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
