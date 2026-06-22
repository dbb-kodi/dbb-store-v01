// src/app/api/stripe/webhook/route.ts
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ received: true })
  }

  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 })

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      // TODO: fulfil order — requires Supabase backend
      console.log('Order fulfilled:', event.data.object)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 })
  }
}
