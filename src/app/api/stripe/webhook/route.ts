// src/app/api/stripe/webhook/route.ts
// Handles Stripe events: creates order in DB, sends confirmation email, decrements stock

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    await handleOrderComplete(session)
  }

  return NextResponse.json({ received: true })
}

async function handleOrderComplete(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient()

  // Prevent duplicate processing
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single()
  if (existing) return

  const cartItems: Array<{ variantId: string; quantity: number }> =
    JSON.parse(session.metadata?.cartItems ?? '[]')

  if (cartItems.length === 0) return

  // Fetch variants + products for pricing
  const { data: variants } = await supabase
    .from('variants')
    .select('id, product_id, products(price, name)')
    .in('id', cartItems.map(i => i.variantId))

  const total    = (session.amount_total ?? 0) / 100
  const subtotal = total // simplified — shipping handled by Stripe

  // Create order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      user_id:               session.metadata?.userId || null,
      guest_email:           session.customer_email,
      stripe_payment_intent: session.payment_intent as string,
      stripe_session_id:     session.id,
      status:                'paid',
      subtotal,
      shipping_cost:         0,
      total,
      shipping_address:      session.shipping_details as any,
    })
    .select()
    .single()

  if (orderErr || !order) { console.error('Order creation failed:', orderErr); return }

  // Create order items + decrement stock
  for (const item of cartItems) {
    const variant = variants?.find(v => v.id === item.variantId)
    if (!variant) continue
    const product = variant.products as any

    await supabase.from('order_items').insert({
      order_id:   order.id,
      variant_id: item.variantId,
      product_id: variant.product_id,
      quantity:   item.quantity,
      unit_price: product.price,
    })

    // Decrement stock
    await supabase.rpc('decrement_stock', { variant_id: item.variantId, qty: item.quantity })
  }

  // Send confirmation email
  const recipientEmail = session.customer_email
  if (recipientEmail) {
    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL!,
      to:      recipientEmail,
      subject: `Your DBB order is confirmed 🔥`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0A0A0A; color: #F0EDE8; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #C8FF00; margin-bottom: 8px;">DBB</h1>
          <p style="font-size: 11px; letter-spacing: 4px; color: #8A8A8A; text-transform: uppercase;">Done Being Broke</p>

          <hr style="border: none; border-top: 1px solid #2A2A2A; margin: 24px 0;" />

          <h2 style="font-size: 24px; letter-spacing: 4px; color: #F0EDE8;">ORDER CONFIRMED</h2>
          <p style="color: #8A8A8A; font-size: 13px;">Order #${order.id.slice(0, 8).toUpperCase()}</p>

          <p style="color: #F0EDE8; margin-top: 24px; line-height: 1.7;">
            Your order is confirmed and being prepared. We'll send a shipping notification when it's on the way.
          </p>

          <div style="margin-top: 32px; background: #2A2A2A; padding: 24px;">
            <p style="font-size: 12px; letter-spacing: 3px; color: #8A8A8A; text-transform: uppercase; margin-bottom: 16px;">Order Total</p>
            <p style="font-size: 28px; color: #C8FF00; font-weight: bold;">$${total.toFixed(2)}</p>
          </div>

          <p style="margin-top: 40px; color: #4A4A4A; font-size: 12px;">
            Questions? Reply to this email or contact us at ${process.env.RESEND_FROM_EMAIL}
          </p>

          <p style="margin-top: 24px; font-size: 11px; letter-spacing: 4px; color: #2A2A2A; text-transform: uppercase;">
            © Done Being Broke
          </p>
        </div>
      `,
    })
  }
}
