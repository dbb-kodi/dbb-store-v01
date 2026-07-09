// src/lib/store/cart.ts
// Zustand cart store with localStorage persistence

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
  hydrateFromServer: (items: CartItem[]) => void
  subtotal: () => number
  count: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId)
          if (existing) {
            const cap = Math.min(existing.maxQty, item.maxQty)
            return {
              isOpen: true,
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, maxQty: cap, quantity: Math.min(i.quantity + item.quantity, cap) }
                  : i
              ),
            }
          }
          return {
            isOpen: true,
            items: [...state.items, { ...item, quantity: Math.min(item.quantity, item.maxQty) }],
          }
        }),

      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) =>
                  i.variantId === variantId ? { ...i, quantity: Math.min(quantity, i.maxQty) } : i
                ),
        })),

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Merges server-saved items into local state by variant id (set, not
      // sum): re-running on refresh/re-login or a React strict-mode double
      // effect must not double quantities. Local quantity wins per variant
      // since it may reflect edits made since the last server save.
      hydrateFromServer: (items) => {
        set((state) => {
          const merged = [...state.items]
          for (const item of items) {
            const existingIndex = merged.findIndex((i) => i.variantId === item.variantId)
            if (existingIndex === -1) {
              merged.push(item)
            }
          }
          return { items: merged }
        })
      },

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'dbb-cart' }
  )
)
