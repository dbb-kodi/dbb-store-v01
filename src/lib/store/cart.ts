// src/lib/store/cart.ts
// Global cart state using Zustand
// Persists to localStorage so cart survives page refresh

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types/database'

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Derived
  itemCount: () => number
  subtotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const existing = get().items.find(i => i.variantId === newItem.variantId)
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.variantId === newItem.variantId
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            )
          }))
        } else {
          set(state => ({ items: [...state.items, newItem] }))
        }
        set({ isOpen: true })
      },

      removeItem: (variantId) =>
        set(state => ({ items: state.items.filter(i => i.variantId !== variantId) })),

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.variantId === variantId ? { ...i, quantity } : i
          )
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'dbb-cart',
      // Only persist the items array, not the open/close state
      partialize: (state) => ({ items: state.items }),
    }
  )
)
