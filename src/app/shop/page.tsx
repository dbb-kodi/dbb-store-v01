// src/app/shop/page.tsx
import { Suspense } from 'react'
import { Footer } from '@/components/layout/Footer'
import { CategoryFilter } from '@/components/shop/CategoryFilter'
import { ShopGrid } from '@/components/shop/ShopGrid'

export const metadata = {
  title: 'Shop — DBB',
  description: 'Browse the full DBB collection. Hoodies, tees, headwear & accessories.',
}

export default function ShopPage() {
  return (
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="section-label">The Collection</p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[0.04em] text-dbb-cream mb-8">
          SHOP ALL
        </h1>
        <Suspense fallback={null}>
          <CategoryFilter />
          <ShopGrid />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
