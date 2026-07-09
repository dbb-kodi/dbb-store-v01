// src/app/shop/page.tsx
import { Suspense } from 'react'
import { Footer } from '@/components/layout/Footer'
import { CategoryFilter } from '@/components/shop/CategoryFilter'
import { ShopGrid } from '@/components/shop/ShopGrid'
import { fetchProducts } from '@/lib/data/queries'

export const metadata = {
  title: 'Shop — DBB',
  description: 'Browse the full DBB collection. Hoodies, tees, headwear & accessories.',
}

export default async function ShopPage() {
  const products = await fetchProducts()
  return (
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="section-label">The Collection</p>
        <h1 className="font-display text-display-md text-dbb-cream mb-8">
          SHOP ALL
        </h1>
        <Suspense fallback={null}>
          <CategoryFilter />
          <ShopGrid products={products} />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
