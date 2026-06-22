// src/components/shop/CategoryGrid.tsx
import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/data/catalog'

export function CategoryGrid() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <p className="section-label text-center">Collections</p>
      <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[0.04em] text-center text-dbb-cream mb-16">
        SHOP BY CATEGORY
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.key}
            href={`/shop?category=${cat.key}`}
            className="group relative aspect-[3/4] overflow-hidden bg-dbb-surface"
          >
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-90"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dbb-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="font-display text-2xl tracking-[0.1em] text-dbb-cream">{cat.label.toUpperCase()}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
