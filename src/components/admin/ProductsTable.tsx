'use client'
// src/components/admin/ProductsTable.tsx

import { useState } from 'react'
import type { Product } from '@/types'

export function ProductsTable({ products: initial }: { products: Product[] }) {
  const [products, setProducts] = useState(initial)

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    )
  }

  return (
    <div className="border border-dbb-border overflow-x-auto">
      <table className="w-full font-body text-sm">
        <thead>
          <tr className="border-b border-dbb-border">
            {['Name', 'Category', 'Price', 'Variants', 'Featured'].map((h) => (
              <th key={h} className="text-left px-5 py-4 text-xs tracking-[0.2em] uppercase text-dbb-muted font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dbb-border">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-dbb-surface transition-colors">
              <td className="px-5 py-4 text-dbb-cream">{p.name}</td>
              <td className="px-5 py-4 text-dbb-muted capitalize">{p.category}</td>
              <td className="px-5 py-4 text-dbb-cream font-display text-base">${p.price.toFixed(2)}</td>
              <td className="px-5 py-4 text-dbb-muted">{p.variants.length}</td>
              <td className="px-5 py-4">
                <button
                  onClick={() => toggleFeatured(p.id)}
                  className={`px-3 py-1 text-xs tracking-[0.15em] uppercase border transition-all ${
                    p.featured
                      ? 'border-dbb-cream text-dbb-cream'
                      : 'border-dbb-border text-dbb-muted hover:border-dbb-cream'
                  }`}
                >
                  {p.featured ? 'Yes' : 'No'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
