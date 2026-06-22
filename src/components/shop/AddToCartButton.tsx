'use client'
// src/components/shop/AddToCartButton.tsx

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '@/lib/store/cart'
import type { Product, Variant } from '@/types'

interface Props {
  product: Product
  selectedVariant: Variant | null
}

export function AddToCartButton({ product, selectedVariant }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (!selectedVariant) {
      toast.error('Please select a size')
      return
    }
    if (selectedVariant.stock_qty === 0) {
      toast.error('This size is sold out')
      return
    }

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: product.price,
      quantity: 1,
      imageUrl: product.image_url,
    })

    setAdded(true)
    toast.success(`${product.name} added to bag`)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`btn-primary w-full justify-center gap-3 ${added ? 'bg-dbb-border text-dbb-cream' : ''}`}
    >
      {added ? (
        <>
          <Check size={16} />
          ADDED TO BAG
        </>
      ) : (
        <>
          <ShoppingBag size={16} />
          ADD TO BAG — ${product.price.toFixed(2)}
        </>
      )}
    </button>
  )
}
