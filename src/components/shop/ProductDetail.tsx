'use client'
// src/components/shop/ProductDetail.tsx

import { useState } from 'react'
import { SizeSelector } from './SizeSelector'
import { AddToCartButton } from './AddToCartButton'
import type { Product, Variant } from '@/types'

export function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const selectedVariant: Variant | null =
    product.variants.find((v) => v.size === selectedSize) ?? null

  return (
    <div className="flex flex-col justify-center py-4">
      <p className="section-label capitalize">{product.category}</p>

      <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[0.02em] text-dbb-cream mb-4">
        {product.name.toUpperCase()}
      </h1>

      <p className="font-display text-3xl text-dbb-cream mb-8">
        ${product.price.toFixed(2)}
      </p>

      <p className="font-body text-sm text-dbb-ash leading-relaxed mb-10">
        {product.description}
      </p>

      <div className="mb-8">
        <SizeSelector
          variants={product.variants}
          selected={selectedSize}
          onChange={setSelectedSize}
        />
      </div>

      <AddToCartButton product={product} selectedVariant={selectedVariant} />

      <div className="mt-10 pt-10 border-t border-dbb-border">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-dbb-ash mb-4">Details</p>
        <ul className="flex flex-col gap-2">
          {['Premium heavyweight construction', 'Dropped shoulder fit', 'Embroidered DBB mark', 'Pre-shrunk fabric'].map((d) => (
            <li key={d} className="font-body text-sm text-dbb-muted flex gap-3">
              <span className="text-dbb-border">—</span> {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
