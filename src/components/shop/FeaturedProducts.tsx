// src/components/shop/FeaturedProducts.tsx
import Link from 'next/link'
import { ProductCard } from './ProductCard'
import { getFeaturedProducts } from '@/lib/data/catalog'

export function FeaturedProducts() {
  const products = getFeaturedProducts()

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="section-label">New Drops</p>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[0.04em] text-dbb-cream">
            FEATURED
          </h2>
        </div>
        <Link href="/shop" className="btn-outline hidden sm:inline-flex">VIEW ALL</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-10 sm:hidden">
        <Link href="/shop" className="btn-outline w-full justify-center">VIEW ALL</Link>
      </div>
    </section>
  )
}
