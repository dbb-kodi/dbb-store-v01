'use client'
// src/components/shop/ShopGrid.tsx

import { useSearchParams } from 'next/navigation'
import { ProductCard } from './ProductCard'
import type { Category, Product } from '@/types'

export function ShopGrid({ products: all }: { products: Product[] }) {
  const params = useSearchParams()
  const category = params.get('category') as Category | null

  const products = all.filter((p) => (category ? p.category === category : true))

  if (products.length === 0) {
    return (
      <div className="py-32 text-center">
        <p className="font-display text-4xl text-dbb-ash tracking-[0.2em]">NO PRODUCTS</p>
        <p className="font-body text-sm text-dbb-muted mt-4">Check back soon for new drops.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
