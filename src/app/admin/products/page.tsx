// src/app/admin/products/page.tsx
import Link from 'next/link'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { getProducts } from './actions'

export default async function AdminProductsPage() {
  const products = await getProducts()
  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="section-label">Catalog</p>
          <h1 className="font-display text-5xl tracking-[0.04em] text-dbb-cream">PRODUCTS</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="px-5 py-3 text-xs tracking-[0.15em] uppercase bg-dbb-cream text-dbb-black hover:opacity-90 transition-all"
        >
          New Product
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  )
}
