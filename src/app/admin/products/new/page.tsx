// src/app/admin/products/new/page.tsx
import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <p className="section-label">Catalog</p>
      <h1 className="font-display text-5xl tracking-[0.04em] text-dbb-cream mb-12">NEW PRODUCT</h1>
      <ProductForm />
    </div>
  )
}
