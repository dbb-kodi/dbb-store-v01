// src/components/shop/CategoryGrid.tsx
import Link from 'next/link'

const CATEGORIES = [
  { slug: 'hoodies',     label: 'HOODIES',     description: 'Built for the grind' },
  { slug: 'pants',       label: 'PANTS',       description: 'Move with purpose' },
  { slug: 'tees',        label: 'TEES',        description: 'Wear the mindset' },
  { slug: 'accessories', label: 'ACCESSORIES', description: 'Details matter' },
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-dbb-smoke">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/shop?category=${cat.slug}`}
          className="group bg-dbb-black flex flex-col items-center justify-center py-12 px-6 text-center hover:bg-dbb-charcoal transition-colors relative overflow-hidden"
        >
          {/* Acid underline on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dbb-acid transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

          <span className="font-display text-4xl md:text-5xl text-dbb-cream group-hover:text-dbb-acid transition-colors tracking-widest">
            {cat.label}
          </span>
          <span className="font-body text-xs text-dbb-ash mt-2 tracking-widest uppercase">
            {cat.description}
          </span>
        </Link>
      ))}
    </div>
  )
}
