// src/app/api/stripe/webhook/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ received: true })
  }

  let event: import('stripe').default.Event
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 })

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as import('stripe').default.Checkout.Session
      const orderId = session.metadata?.order_id
      const sessionId = session.id
      const paymentIntent = session.payment_intent

      if (orderId) {
        // Stripe retries webhooks and also fires this event for async payment
        // methods before funds settle, so only transition orders that are
        // still pending and whose payment has actually settled. The WHERE
        // clause (not a blind update) makes this idempotent and prevents
        // regressing an already refunded/cancelled order back to paid.
        if (session.payment_status === 'paid') {
          const supabaseAdmin = createAdminClient()
          if (supabaseAdmin) {
            const { error: updateError } = await supabaseAdmin
              .from('orders')
              .update({
                status: 'paid',
                stripe_session_id: sessionId,
                stripe_payment_intent:
                  typeof paymentIntent === 'string' ? paymentIntent : paymentIntent?.id ?? null,
              })
              .eq('id', orderId)
              .eq('status', 'pending')

            if (updateError) {
              console.error('Order update error:', updateError)
            }
          } else {
            console.error('Supabase admin client not configured; cannot mark order paid.')
          }
        }
      } else {
        console.error('checkout.session.completed missing order_id metadata.')
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as import('stripe').default.Checkout.Session
      const orderId = session.metadata?.order_id

      if (orderId) {
        const supabaseAdmin = createAdminClient()
        if (supabaseAdmin) {
          // Mark abandoned pending orders as cancelled so they don't linger
          // as apparent unpaid orders in admin/order lists.
          const { error: expireError } = await supabaseAdmin
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', orderId)
            .eq('status', 'pending')

          if (expireError) {
            console.error('Order expire error:', expireError)
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    // Signature is already verified at this point, so an unexpected error here
    // (e.g. a Supabase client exception) should not trigger Stripe retries.
    console.error('Webhook handling error:', err)
    return NextResponse.json({ received: true })
  }
}
