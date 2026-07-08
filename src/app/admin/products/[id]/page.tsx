// src/app/admin/products/[id]/page.tsx
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'
import { getProduct } from '../actions'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  if (!product) notFound()
  return (
    <div>
      <p className="section-label">Catalog</p>
      <h1 className="font-display text-5xl tracking-[0.04em] text-dbb-cream mb-12">EDIT PRODUCT</h1>
      <ProductForm product={product} />
    </div>
  )
}
