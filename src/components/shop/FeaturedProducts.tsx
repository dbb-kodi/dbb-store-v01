// src/components/shop/FeaturedProducts.tsx
import Link from 'next/link'
import type { ProductWithVariants } from '@/types/database'
import { AddToCartButton } from './AddToCartButton'

export function FeaturedProducts({ products }: { products: ProductWithVariants[] }) {
  return (
    <section className="bg-dbb-charcoal py-24">
      <div className="max-w-7xl mx-auto px-6">
        <p className="section-label text-center">Just Dropped</p>
        <h2 className="font-display text-display-lg text-center text-dbb-cream mb-16">
          FEATURED COLLECTION
        </h2>

        {products.length === 0 ? (
          <p className="text-center font-body text-dbb-ash text-sm">Products coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group product-card">
                {/* Image */}
                <Link href={`/shop/${product.slug}`}>
                  <div className="aspect-[3/4] overflow-hidden bg-dbb-black">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-6xl text-dbb-smoke">DBB</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="font-body text-sm font-medium text-dbb-cream hover:text-dbb-acid transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-display text-xl text-dbb-acid">${product.price.toFixed(2)}</span>
                    {product.compare_price && (
                      <span className="font-body text-sm text-dbb-smoke line-through">
                        ${product.compare_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Quick add — picks first in-stock variant */}
                  <AddToCartButton product={product} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/shop" className="btn-outline">
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  )
}
