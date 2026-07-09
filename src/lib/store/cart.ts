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
    {
      name: 'dbb-cart',
      version: 2,
      migrate: (persisted: any, version) => {
        // v0 -> v1. Carts persisted before maxQty existed hydrate with maxQty
        // undefined on every item. Every cap check downstream does
        // Math.min(n, item.maxQty), which silently becomes NaN the first time
        // quantity is touched — corrupting quantity and therefore subtotal.
        // Treat a missing cap as "unknown, don't clamp" rather than let it
        // become NaN, same fix as cart-actions.ts getSavedCart.
        if (version < 1 && persisted?.items) {
          persisted.items = persisted.items.map((item: CartItem) => ({
            ...item,
            maxQty: item.maxQty ?? Infinity,
          }))
        }

        // v1 -> v2. imageUrl is snapshotted onto the cart item at add-time and
        // persisted, so a cart created before the infringing product images
        // were purged still carries those URLs — and renders them in the
        // drawer, and forwards them to Stripe as line-item images. Blanking the
        // database never reached client storage. Drop the snapshot; the drawer
        // falls back to the DBB monogram tile when imageUrl is null.
        if (version < 2 && persisted?.items) {
          persisted.items = persisted.items.map((item: CartItem) => ({
            ...item,
            imageUrl: item.imageUrl?.startsWith('https://images.unsplash.com/')
              ? null
              : item.imageUrl,
          }))
        }

        return persisted
      },
    }
  )
)
