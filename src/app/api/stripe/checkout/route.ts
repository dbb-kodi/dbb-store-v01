// src/app/api/stripe/checkout/route.ts
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json(
      { message: 'Stripe is not configured yet. Payments are coming soon.' },
      { status: 503 }
    )
  }

  try {
    const { items } = await request.json()
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

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
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ message: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
