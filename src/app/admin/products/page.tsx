// src/app/admin/products/page.tsx
// Full product management — add, edit price, toggle visibility, manage stock

import { createClient } from '@/lib/supabase/server'
import { ProductsTable } from '@/components/admin/ProductsTable'

export default async function AdminProductsPage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, variants(*)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-dbb-cream tracking-widest">PRODUCTS</h1>
          <p className="font-body text-sm text-dbb-ash mt-1">{products?.length ?? 0} total products</p>
        </div>
        <a
          href="/admin/products/new"
          className="btn-primary text-base"
        >
          + ADD PRODUCT
        </a>
      </div>

      <ProductsTable products={products ?? []} />
    </div>
  )
}
