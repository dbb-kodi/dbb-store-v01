'use client'
// src/app/checkout/page.tsx
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/client'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [loading, setLoading] = useState(false)
  // null = still checking session; false = guest; true = logged in
  const [isGuest, setIsGuest] = useState<boolean | null>(null)
  const [guestEmail, setGuestEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setIsGuest(true)
      return
    }
    supabase.auth.getUser().then(({ data }: { data: { user: unknown } }) => {
      setIsGuest(!data.user)
    })
  }, [])

  const emailValid = EMAIL_RE.test(guestEmail)
  const canSubmit = isGuest === false || emailValid

  const handleCheckout = async () => {
    if (items.length === 0) return
    if (isGuest && !emailValid) {
      setEmailTouched(true)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, guestEmail: isGuest ? guestEmail : undefined }),
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

            {isGuest && (
              <div className="mb-8">
                <label htmlFor="guest-email" className="font-body text-xs tracking-[0.2em] uppercase text-dbb-ash mb-3 block">
                  Email — for your receipt and order updates
                </label>
                <input
                  id="guest-email"
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="you@example.com"
                  className="w-full bg-dbb-black border border-dbb-border text-dbb-cream font-body
                             text-sm px-4 py-3 focus:outline-none focus:border-dbb-cream
                             transition-colors placeholder:text-dbb-muted"
                />
                {emailTouched && !emailValid && (
                  <p className="font-body text-xs text-dbb-ledger mt-2">Enter a valid email to continue.</p>
                )}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || !canSubmit}
              className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
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
