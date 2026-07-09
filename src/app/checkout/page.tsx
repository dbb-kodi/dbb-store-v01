'use client'
// src/app/checkout/page.tsx
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/client'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CheckoutPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()
  const [loading, setLoading] = useState(false)
  // null = still checking session; false = guest; true = logged in
  const [isGuest, setIsGuest] = useState<boolean | null>(null)
  const [guestEmail, setGuestEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

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
    setCheckoutError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, guestEmail: isGuest ? guestEmail : undefined }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return // don't clear loading — we're navigating away
      }
      setCheckoutError(data.message ?? 'Checkout is currently unavailable.')
    } catch {
      // fetch throws on network failure; without this the rejection is unhandled
      // and the button silently stays stuck in its loading state.
      setCheckoutError('Could not reach the server. Check your connection and try again.')
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
            <p className="font-display text-4xl text-dbb-ash tracking-[0.2em]">BAG EMPTY</p>
            <p className="font-body text-sm text-dbb-muted mt-4 mb-8">Nothing to check out yet.</p>
            <Link href="/shop" className="btn-outline">SHOP ALL</Link>
          </div>
        ) : (
          <>
            {/* Lines are editable here. Sending someone back to the drawer to
                fix a quantity at the last step is how carts get abandoned. */}
            <div className="divide-y divide-dbb-border border-y border-dbb-border mb-10">
              {items.map((item) => (
                <div key={item.variantId} className="flex items-start justify-between gap-4 py-5">
                  <div className="min-w-0">
                    <p className="font-body text-sm text-dbb-cream truncate">{item.productName}</p>
                    <p className="font-body text-xs text-dbb-muted mt-0.5">{item.size}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.productName}, size ${item.size}`}
                        className="tap-target w-6 h-6 border border-dbb-border text-dbb-cream hover:border-dbb-cream text-sm flex items-center justify-center transition-colors"
                      >
                        −
                      </button>
                      <span className="font-body text-sm text-dbb-cream w-4 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQty}
                        aria-label={`Increase quantity of ${item.productName}, size ${item.size}`}
                        className="tap-target w-6 h-6 border border-dbb-border text-dbb-cream hover:border-dbb-cream text-sm flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-dbb-border"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="font-body text-xs text-dbb-muted hover:text-dbb-cream underline transition-colors ml-2"
                      >
                        Remove
                      </button>
                    </div>

                    {item.quantity >= item.maxQty && (
                      <p className="font-body text-xs text-dbb-ledger-text mt-2">Max available in stock</p>
                    )}
                  </div>

                  <p className="font-display text-xl text-dbb-cream tabular-nums shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-10">
              <span className="font-body text-sm text-dbb-ash uppercase tracking-[0.2em]">Subtotal</span>
              <span className="font-display text-3xl text-dbb-cream tabular-nums">${subtotal().toFixed(2)}</span>
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
                             text-sm px-4 py-3 focus:border-dbb-cream
                             transition-colors placeholder:text-dbb-muted"
                />
                {emailTouched && !emailValid && (
                  <p className="font-body text-xs text-dbb-ledger-text mt-2">Enter a valid email to continue.</p>
                )}
              </div>
            )}

            {checkoutError && (
              <div
                role="alert"
                className="mb-6 border border-dbb-ledger bg-dbb-ledger/10 px-4 py-3"
              >
                <p className="font-body text-sm text-dbb-ledger-text">{checkoutError}</p>
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
