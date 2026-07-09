'use client'
// src/components/shop/ProductCard.tsx

import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const soldOut =
    product.variants.length > 0 &&
    product.variants.every((v) => v.stock_qty === 0)

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-dbb-surface mb-4">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {soldOut && (
          <div className="absolute inset-0 bg-dbb-black/60 flex items-center justify-center">
            <span className="font-display text-lg tracking-[0.3em] text-dbb-muted">SOLD OUT</span>
          </div>
        )}
      </div>

      <div>
        <p className="font-body text-sm text-dbb-cream group-hover:text-dbb-ash transition-colors truncate">
          {product.name}
        </p>
        <p className="font-display text-xl text-dbb-cream mt-1 ledger-rule inline-block group-hover:[&::after]:border-dbb-credit group-hover:[&::before]:border-dbb-credit">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
