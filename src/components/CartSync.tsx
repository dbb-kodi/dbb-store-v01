'use client'
// src/components/CartSync.tsx

import { useEffect, useRef } from 'react'
import { useCart } from '@/lib/store/cart'
import { getSavedCart, saveCart } from '@/app/account/cart-actions'

export default function CartSync() {
  const items = useCart((state) => state.items)
  const hydrateFromServer = useCart((state) => state.hydrateFromServer)

  const hydratedRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipNextSaveRef = useRef(true)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true

    getSavedCart()
      .then((savedItems) => {
        if (savedItems && savedItems.length > 0) {
          hydrateFromServer(savedItems)
        }
      })
      .catch(() => {})
  }, [hydrateFromServer])

  useEffect(() => {
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      saveCart(items).catch(() => {})
    }, 1000)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [items])

  return null
}
