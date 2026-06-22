'use client'
// src/app/checkout/page.tsx
import { useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { Footer } from '@/components/layout/Footer'

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.message ?? 'Checkout is currently unavailable.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-16">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <p className="section-label">Review</p>
        <h1 className="font-display text-5xl tracking-[0.04em] text-dbb-cream mb-12">CHECKOUT</h1>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-4xl text-dbb-border tracking-[0.2em]">BAG EMPTY</p>
            <p className="font-body text-sm text-dbb-muted mt-4">Add something to your bag first.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-dbb-border border-y border-dbb-border mb-10">
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between py-5">
                  <div>
                    <p className="font-body text-sm text-dbb-cream">{item.productName}</p>
                    <p className="font-body text-xs text-dbb-muted mt-0.5">{item.size} × {item.quantity}</p>
                  </div>
                  <p className="font-display text-xl text-dbb-cream">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-10">
              <span className="font-body text-sm text-dbb-ash uppercase tracking-[0.2em]">Subtotal</span>
              <span className="font-display text-3xl text-dbb-cream">${subtotal().toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? 'REDIRECTING...' : 'PROCEED TO PAYMENT'}
            </button>

            <p className="font-body text-xs text-dbb-muted text-center mt-6">
              Secure checkout via Stripe. Shipping calculated at next step.
            </p>
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}
