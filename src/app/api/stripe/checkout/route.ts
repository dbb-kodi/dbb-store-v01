// src/app/api/stripe/checkout/route.ts
// Creates a Stripe Checkout Session from cart items

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import type { CartItem } from '@/types/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const { items }: { items: CartItem[] } = await req.json()

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Verify stock and prices server-side (never trust client prices)
  const variantIds = items.map(i => i.variantId)
  const { data: variants } = await supabase
    .from('variants')
    .select('id, stock_qty, product_id, products(name, price, image_url)')
    .in('id', variantIds)

  if (!variants) {
    return NextResponse.json({ error: 'Could not verify products' }, { status: 400 })
  }

  // Build Stripe line items using server prices
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  for (const item of items) {
    const variant = variants.find(v => v.id === item.variantId)
    if (!variant) return NextResponse.json({ error: `Product not found: ${item.variantId}` }, { status: 400 })
    if (variant.stock_qty < item.quantity) {
      return NextResponse.json({ error: `Insufficient stock for ${item.productName}` }, { status: 400 })
    }

    const product = variant.products as any
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${product.name} — ${item.size}${item.color ? ` / ${item.color}` : ''}`,
          images: product.image_url ? [product.image_url] : [],
          metadata: { variantId: item.variantId, productId: item.productId },
        },
        unit_amount: Math.round(product.price * 100), // server price in cents
      },
      quantity: item.quantity,
    })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    customer_email: user?.email,
    metadata: {
      userId: user?.id ?? '',
      cartItems: JSON.stringify(items.map(i => ({ variantId: i.variantId, quantity: i.quantity }))),
    },
    shipping_address_collection: { allowed_countries: ['US', 'CA'] },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${siteUrl}/checkout/cancelled`,
    payment_method_types: ['card'],
  })

  return NextResponse.json({ url: session.url })
}
