'use client'
// src/components/admin/ProductsTable.tsx

import Link from 'next/link'
import { useTransition } from 'react'
import toast from 'react-hot-toast'
import { deleteProduct, toggleProductField } from '@/app/admin/products/actions'
import type { Product } from '@/types'

export function ProductsTable({ products }: { products: Product[] }) {
  const [isPending, startTransition] = useTransition()

  const toggleFeatured = (id: string, current: boolean) => {
    startTransition(async () => {
      const result = await toggleProductField(id, 'featured', !current)
      if (result.error) toast.error(result.error)
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm('Delete "' + name + '"? This cannot be undone.')) return
    startTransition(async () => {
      const result = await deleteProduct(id)
      if (result.error) toast.error(result.error)
      else toast.success('Product deleted')
    })
  }

  return (
    <div className="border border-dbb-border overflow-x-auto">
      <table className="w-full font-body text-sm">
        <thead>
          <tr className="border-b border-dbb-border">
            {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => (
              <th key={h} className="text-left px-5 py-4 text-xs tracking-[0.2em] uppercase text-dbb-muted font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dbb-border">
          {products.map((p) => {
            const stock = p.variants.reduce((sum, v) => sum + v.stock_qty, 0)
            const featuredClass = p.featured
              ? 'border-dbb-cream text-dbb-cream'
              : 'border-dbb-border text-dbb-muted hover:border-dbb-cream'
            return (
              <tr key={p.id} className="hover:bg-dbb-surface transition-colors">
                <td className="px-5 py-4">
                  <img src={p.image_url} alt={p.name} className="w-12 h-14 object-cover" />
                </td>
                <td className="px-5 py-4 text-dbb-cream">{p.name}</td>
                <td className="px-5 py-4 text-dbb-muted capitalize">{p.category}</td>
                <td className="px-5 py-4 text-dbb-cream font-display text-base tabular-nums">${p.price.toFixed(2)}</td>
                <td className="px-5 py-4 text-dbb-muted">{stock}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleFeatured(p.id, p.featured)}
                    disabled={isPending}
                    className={'px-3 py-1 text-xs tracking-[0.15em] uppercase border transition-all ' + featuredClass}
                  >
                    {p.featured ? 'Yes' : 'No'}
                  </button>
                </td>
                <td className="px-5 py-4 flex gap-3">
                  <Link href={'/admin/products/' + p.id} className="text-xs text-dbb-muted hover:text-dbb-cream">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={isPending}
                    className="text-xs text-dbb-muted hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
