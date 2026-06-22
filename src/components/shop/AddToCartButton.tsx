'use client'
// src/components/shop/AddToCartButton.tsx

import { useState } from 'react'
import { useCart } from '@/lib/store/cart'
import type { ProductWithVariants } from '@/types/database'
import toast from 'react-hot-toast'

export function AddToCartButton({ product }: { product: ProductWithVariants }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const firstInStock = product.variants?.find(v => v.stock_qty > 0)

  const handleAdd = () => {
    if (!firstInStock) return
    addItem({
      variantId: firstInStock.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      imageUrl: product.image_url,
      size: firstInStock.size,
      color: firstInStock.color,
      price: product.price,
      quantity: 1,
    })
    setAdded(true)
    toast.success(`${product.name} added to bag`)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!firstInStock) {
    return (
      <button disabled className="w-full mt-3 py-2 text-xs tracking-widest font-body text-dbb-smoke border border-dbb-smoke cursor-not-allowed uppercase">
        SOLD OUT
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full mt-3 py-2 text-xs tracking-widest font-body uppercase transition-all duration-200 ${
        added
          ? 'bg-dbb-acid text-dbb-black'
          : 'border border-dbb-cream text-dbb-cream hover:bg-dbb-cream hover:text-dbb-black'
      }`}
    >
      {added ? '✓ ADDED' : 'ADD TO BAG'}
    </button>
  )
}
