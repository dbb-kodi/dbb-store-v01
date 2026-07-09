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
      maxQty: selectedVariant.stock_qty,
    })

    setAdded(true)
    toast.success(`${product.name} added to bag`)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      aria-live="polite"
      className={`btn-primary w-full justify-center gap-3 relative overflow-hidden ${
        added ? 'bg-dbb-credit text-dbb-cream hover:bg-dbb-credit' : ''
      }`}
      style={{
        transition:
          'transform 160ms var(--ease-out), background-color 260ms var(--ease-out), color 260ms var(--ease-out)',
      }}
    >
      {/* Both labels stay mounted and crossfade in place. A blur bridges the
          two states so the eye reads one label transforming, rather than two
          separate labels swapping — and it hides the fact that they're
          different widths. Swapping the DOM node instead would jump the
          button's content box mid-transition. */}
      <span
        aria-hidden={added}
        className="flex items-center gap-3"
        style={{
          transition: 'opacity 200ms var(--ease-out), filter 200ms var(--ease-out)',
          opacity: added ? 0 : 1,
          filter: added ? 'blur(4px)' : 'blur(0)',
        }}
      >
        <ShoppingBag size={16} />
        ADD TO BAG — ${product.price.toFixed(2)}
      </span>

      <span
        aria-hidden={!added}
        className="absolute inset-0 flex items-center justify-center gap-3"
        style={{
          transition: 'opacity 200ms var(--ease-out), filter 200ms var(--ease-out)',
          opacity: added ? 1 : 0,
          filter: added ? 'blur(0)' : 'blur(4px)',
        }}
      >
        <Check size={16} />
        ADDED TO BAG
      </span>
    </button>
  )
}
