// src/app/admin/products/page.tsx
import { ProductsTable } from '@/components/admin/ProductsTable'
import { getAllProducts } from '@/lib/data/catalog'

export default function AdminProductsPage() {
  const products = getAllProducts()
  return (
    <div>
      <p className="section-label">Catalog</p>
      <h1 className="font-display text-5xl tracking-[0.04em] text-dbb-cream mb-12">PRODUCTS</h1>
      <ProductsTable products={products} />
    </div>
  )
}
