'use client'
// src/components/shop/ProductDetail.tsx

import { useState } from 'react'
import { SizeSelector } from './SizeSelector'
import { AddToCartButton } from './AddToCartButton'
import { SizeGuideModal } from './SizeGuideModal'
import type { Product, Variant, Category } from '@/types'

// The products table has no per-item details column, so this was previously a
// single hardcoded list applied to every product regardless of category — the
// canvas tote claimed "dropped shoulder fit". Derive something true instead.
const CATEGORY_DETAILS: Record<Category, string[]> = {
  hoodies: ['450gsm heavyweight fleece', 'Boxy fit, dropped shoulders', 'Embroidered DBB mark', 'Pre-shrunk'],
  tees: ['Heavyweight cotton construction', 'Relaxed, structured drape', 'Screen-printed graphic', 'Pre-shrunk'],
  headwear: ['Structured 6-panel build', 'Raised embroidery', 'Adjustable strap', 'One size fits most'],
  accessories: ['Heavy canvas construction', 'Reinforced stitching', 'Interior pocket', 'Spot clean only'],
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

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
          onSizeGuideClick={() => setSizeGuideOpen(true)}
        />
      </div>

      <AddToCartButton product={product} selectedVariant={selectedVariant} />

      <p className="font-body text-xs text-dbb-muted mt-4">
        Free US shipping over $75. Returns accepted within 30 days, unworn with tags.
      </p>

      <div className="mt-10 pt-10 border-t border-dbb-border">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-dbb-ash mb-4">Details</p>
        <ul className="flex flex-col gap-2">
          {CATEGORY_DETAILS[product.category].map((d) => (
            <li key={d} className="font-body text-sm text-dbb-muted flex gap-3">
              <span className="text-dbb-border">—</span> {d}
            </li>
          ))}
        </ul>
      </div>

      <SizeGuideModal category={product.category} open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  )
}
