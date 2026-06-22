'use client'
// src/components/admin/ProductsTable.tsx
// Inline price editing + toggle active + stock view

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProductWithVariants } from '@/types/database'
import toast from 'react-hot-toast'
import { Edit2, Eye, EyeOff, Trash2 } from 'lucide-react'
import Link from 'next/link'

export function ProductsTable({ products: initial }: { products: ProductWithVariants[] }) {
  const [products, setProducts] = useState(initial)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [priceVal, setPriceVal] = useState('')
  const supabase = createClient()

  const updatePrice = async (id: string) => {
    const price = parseFloat(priceVal)
    if (isNaN(price) || price < 0) {
      toast.error('Enter a valid price')
      return
    }
    const { error } = await supabase.from('products').update({ price }).eq('id', id)
    if (error) { toast.error('Failed to update price'); return }
    setProducts(p => p.map(x => x.id === id ? { ...x, price } : x))
    setEditingPrice(null)
    toast.success('Price updated')
  }

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('products').update({ active: !current }).eq('id', id)
    if (error) { toast.error('Failed to update'); return }
    setProducts(p => p.map(x => x.id === id ? { ...x, active: !current } : x))
    toast.success(current ? 'Product hidden' : 'Product visible')
  }

  const totalStock = (p: ProductWithVariants) =>
    p.variants?.reduce((sum, v) => sum + v.stock_qty, 0) ?? 0

  return (
    <div className="bg-dbb-charcoal border border-dbb-smoke overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-dbb-smoke bg-dbb-black/50">
        {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
          <div
            key={h}
            className={`font-body text-[10px] tracking-widest uppercase text-dbb-ash ${
              h === 'Product' ? 'col-span-4' :
              h === 'Price'   ? 'col-span-2' :
              h === 'Actions' ? 'col-span-2' : 'col-span-1'
            }`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      {products.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="font-body text-sm text-dbb-ash">No products yet. Add your first one.</p>
        </div>
      ) : (
        products.map((p) => (
          <div
            key={p.id}
            className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-dbb-smoke/50 items-center hover:bg-dbb-black/30 transition-colors ${
              !p.active ? 'opacity-50' : ''
            }`}
          >
            {/* Name + image */}
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-dbb-black flex-shrink-0 overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-xs text-dbb-smoke">D</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-body text-sm text-dbb-cream font-medium">{p.name}</p>
                <p className="font-body text-xs text-dbb-ash">{p.slug}</p>
              </div>
            </div>

            {/* Category */}
            <div className="col-span-1">
              <span className="font-body text-xs text-dbb-ash capitalize">{p.category}</span>
            </div>

            {/* Price — inline editable */}
            <div className="col-span-2">
              {editingPrice === p.id ? (
                <div className="flex items-center gap-1">
                  <span className="text-dbb-ash text-sm">$</span>
                  <input
                    autoFocus
                    type="number"
                    step="0.01"
                    value={priceVal}
                    onChange={e => setPriceVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') updatePrice(p.id); if (e.key === 'Escape') setEditingPrice(null) }}
                    className="admin-input w-20 py-1 text-sm"
                  />
                  <button onClick={() => updatePrice(p.id)} className="text-dbb-acid text-xs hover:underline">Save</button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingPrice(p.id); setPriceVal(p.price.toString()) }}
                  className="flex items-center gap-1 group"
                >
                  <span className="font-display text-lg text-dbb-acid">${p.price.toFixed(2)}</span>
                  <Edit2 size={12} className="text-dbb-smoke group-hover:text-dbb-acid transition-colors" />
                </button>
              )}
            </div>

            {/* Stock */}
            <div className="col-span-1">
              <span className={`font-body text-sm ${totalStock(p) === 0 ? 'text-red-400' : totalStock(p) < 5 ? 'text-yellow-400' : 'text-dbb-cream'}`}>
                {totalStock(p)}
              </span>
            </div>

            {/* Status */}
            <div className="col-span-1">
              <span className={`font-body text-[10px] tracking-widest uppercase px-2 py-0.5 ${
                p.active ? 'bg-dbb-acid/10 text-dbb-acid' : 'bg-dbb-smoke/20 text-dbb-smoke'
              }`}>
                {p.active ? 'Live' : 'Hidden'}
              </span>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center gap-3">
              <Link href={`/admin/products/${p.id}`} className="text-dbb-ash hover:text-dbb-cream transition-colors">
                <Edit2 size={15} />
              </Link>
              <button
                onClick={() => toggleActive(p.id, p.active)}
                className={`transition-colors ${p.active ? 'text-dbb-ash hover:text-yellow-400' : 'text-dbb-smoke hover:text-dbb-acid'}`}
                title={p.active ? 'Hide product' : 'Show product'}
              >
                {p.active ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
