// src/app/shop/[slug]/page.tsx — Product Detail Page
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Footer } from '@/components/layout/Footer'
import { ProductDetail } from '@/components/shop/ProductDetail'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProductBySlug, getRelatedProducts, getAllProducts } from '@/lib/data/catalog'

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) return {}
  return { title: `${product.name} — DBB`, description: product.description }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const related = getRelatedProducts(product.slug, product.category)

  return (
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-dbb-surface">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Details */}
        <ProductDetail product={product} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-dbb-border">
          <h2 className="font-display text-3xl tracking-[0.1em] text-dbb-cream mb-10">
            YOU MIGHT ALSO LIKE
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
