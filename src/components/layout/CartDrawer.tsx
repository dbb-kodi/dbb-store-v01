'use client'
// src/components/layout/CartDrawer.tsx

import { X, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useRouter } from 'next/navigation'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart()
  const router = useRouter()

  const handleCheckout = async () => {
    closeCart()
    router.push('/checkout')
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-dbb-charcoal z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dbb-smoke">
          <h2 className="font-display text-2xl tracking-widest text-dbb-cream">
            YOUR BAG ({items.length})
          </h2>
          <button onClick={closeCart} className="text-dbb-ash hover:text-dbb-cream transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="font-display text-4xl text-dbb-smoke tracking-widest mb-3">EMPTY</p>
              <p className="font-body text-sm text-dbb-ash">Your bag is empty. Start building.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4 py-4 border-b border-dbb-smoke last:border-none">
                  {/* Image placeholder */}
                  <div className="w-20 h-24 bg-dbb-black flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-xs text-dbb-smoke">DBB</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-dbb-cream truncate">{item.productName}</p>
                    <p className="font-body text-xs text-dbb-ash mt-0.5">
                      {item.size}{item.color ? ` · ${item.color}` : ''}
                    </p>
                    <p className="font-display text-lg text-dbb-acid mt-1">${item.price.toFixed(2)}</p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-6 h-6 border border-dbb-smoke text-dbb-cream hover:border-dbb-acid hover:text-dbb-acid text-sm flex items-center justify-center transition-colors"
                      >−</button>
                      <span className="font-body text-sm text-dbb-cream w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-6 h-6 border border-dbb-smoke text-dbb-cream hover:border-dbb-acid hover:text-dbb-acid text-sm flex items-center justify-center transition-colors"
                      >+</button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-dbb-smoke hover:text-red-400 transition-colors self-start mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-dbb-smoke">
            <div className="flex justify-between mb-4">
              <span className="font-body text-sm text-dbb-ash uppercase tracking-widest">Subtotal</span>
              <span className="font-display text-2xl text-dbb-cream">${subtotal().toFixed(2)}</span>
            </div>
            <p className="font-body text-xs text-dbb-ash mb-4">Shipping calculated at checkout</p>
            <button onClick={handleCheckout} className="btn-primary w-full justify-center">
              CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  )
}
