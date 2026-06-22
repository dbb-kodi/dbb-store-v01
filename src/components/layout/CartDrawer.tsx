'use client'
// src/components/layout/CartDrawer.tsx

import { X, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/cart'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }

  const list = mounted ? items : []

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={closeCart} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-dbb-surface z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-dbb-border">
          <h2 className="font-display text-2xl tracking-[0.2em] text-dbb-cream">
            YOUR BAG ({list.length})
          </h2>
          <button onClick={closeCart} className="text-dbb-ash hover:text-dbb-cream transition-colors" aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="font-display text-4xl text-dbb-border tracking-[0.2em] mb-3">EMPTY</p>
              <p className="font-body text-sm text-dbb-muted">Your bag is empty. Start building.</p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {list.map((item) => (
                <li key={item.variantId} className="flex gap-4 py-5 border-b border-dbb-border last:border-none">
                  <div className="w-20 h-24 bg-dbb-black flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-xs text-dbb-border">DBB</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-dbb-cream truncate">{item.productName}</p>
                    <p className="font-body text-xs text-dbb-muted mt-0.5">
                      {item.size}{item.color ? ` · ${item.color}` : ''}
                    </p>
                    <p className="font-display text-lg text-dbb-cream mt-1">${item.price.toFixed(2)}</p>

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-6 h-6 border border-dbb-border text-dbb-cream hover:border-dbb-cream text-sm flex items-center justify-center transition-colors"
                      >−</button>
                      <span className="font-body text-sm text-dbb-cream w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-6 h-6 border border-dbb-border text-dbb-cream hover:border-dbb-cream text-sm flex items-center justify-center transition-colors"
                      >+</button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-dbb-muted hover:text-dbb-cream transition-colors self-start mt-1"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {list.length > 0 && (
          <div className="px-6 py-6 border-t border-dbb-border">
            <div className="flex justify-between mb-4">
              <span className="font-body text-sm text-dbb-ash uppercase tracking-[0.2em]">Subtotal</span>
              <span className="font-display text-2xl text-dbb-cream">${subtotal().toFixed(2)}</span>
            </div>
            <p className="font-body text-xs text-dbb-muted mb-4">Shipping calculated at checkout</p>
            <button onClick={handleCheckout} className="btn-primary w-full justify-center">CHECKOUT</button>
          </div>
        )}
      </div>
    </>
  )
}
