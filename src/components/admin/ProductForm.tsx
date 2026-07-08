'use client'
// src/components/admin/ProductForm.tsx

import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { createProduct, updateProduct } from '@/app/admin/products/actions'
import { ImageUploader } from './ImageUploader'
import type { Product, Category, Variant } from '@/types'

const CATEGORY_OPTIONS: Category[] = ['hoodies', 'tees', 'headwear', 'accessories']

type VariantRow = Pick<Variant, 'size' | 'color' | 'stock_qty' | 'sku'>

export function ProductForm({ product }: { product?: Product }) {
  const isEdit = Boolean(product)
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '')
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.map((v) => ({ size: v.size, color: v.color, stock_qty: v.stock_qty, sku: v.sku })) ?? []
  )
  const [isPending, startTransition] = useTransition()

  const addVariant = () => setVariants((prev) => [...prev, { size: '', color: null, stock_qty: 0, sku: '' }])
  const removeVariant = (index: number) => setVariants((prev) => prev.filter((_, i) => i !== index))
  const updateVariant = (index: number, field: keyof VariantRow, value: string | number) =>
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))

  const handleSubmit = (formData: FormData) => {
    formData.set('image_url', imageUrl)
    formData.set('variantsJson', JSON.stringify(variants))
    startTransition(async () => {
      const result = isEdit ? await updateProduct(product!.id, formData) : await createProduct(formData)
      if (result?.error) toast.error(result.error)
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8 max-w-2xl">
      <ImageUploader value={imageUrl} onChange={setImageUrl} />

      <div>
        <label className="block text-xs tracking-[0.15em] uppercase text-dbb-muted mb-2">Name</label>
        <input
          name="name"
          defaultValue={product?.name}
          required
          className="w-full bg-transparent border border-dbb-border px-4 py-3 text-dbb-cream"
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.15em] uppercase text-dbb-muted mb-2">Slug</label>
        <input
          name="slug"
          defaultValue={product?.slug}
          required
          className="w-full bg-transparent border border-dbb-border px-4 py-3 text-dbb-cream"
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.15em] uppercase text-dbb-muted mb-2">Description</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          rows={4}
          className="w-full bg-transparent border border-dbb-border px-4 py-3 text-dbb-cream"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-dbb-muted mb-2">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price}
            required
            className="w-full bg-transparent border border-dbb-border px-4 py-3 text-dbb-cream"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-dbb-muted mb-2">Category</label>
          <select
            name="category"
            defaultValue={product?.category ?? CATEGORY_OPTIONS[0]}
            className="w-full bg-dbb-black border border-dbb-border px-4 py-3 text-dbb-cream"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-dbb-muted">
          <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm text-dbb-muted">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} />
          Featured
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs tracking-[0.15em] uppercase text-dbb-muted">Variants</label>
          <button type="button" onClick={addVariant} className="text-xs text-dbb-muted hover:text-dbb-cream">
            + Add Variant
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 items-center">
              <input
                placeholder="Size"
                value={v.size}
                onChange={(e) => updateVariant(i, 'size', e.target.value)}
                className="bg-transparent border border-dbb-border px-2 py-2 text-sm text-dbb-cream"
              />
              <input
                placeholder="Color"
                value={v.color ?? ''}
                onChange={(e) => updateVariant(i, 'color', e.target.value)}
                className="bg-transparent border border-dbb-border px-2 py-2 text-sm text-dbb-cream"
              />
              <input
                type="number"
                placeholder="Stock"
                value={v.stock_qty}
                onChange={(e) => updateVariant(i, 'stock_qty', Number(e.target.value))}
                className="bg-transparent border border-dbb-border px-2 py-2 text-sm text-dbb-cream"
              />
              <input
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                className="bg-transparent border border-dbb-border px-2 py-2 text-sm text-dbb-cream"
              />
              <button type="button" onClick={() => removeVariant(i)} className="text-xs text-dbb-muted hover:text-red-400">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-3 text-xs tracking-[0.15em] uppercase bg-dbb-cream text-dbb-black hover:opacity-90 transition-all disabled:opacity-50"
      >
        {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
      </button>
    </form>
  )
}
