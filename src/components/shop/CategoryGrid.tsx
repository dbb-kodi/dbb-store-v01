// src/components/shop/CategoryGrid.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/data/catalog'

/**
 * Four tiles of category photography became four identical empty black
 * rectangles once the infringing images were pulled — a card grid with nothing
 * in the cards. Rather than fill them with placeholder art, this is now what a
 * category index actually is in the brand's own vocabulary: a chart of
 * accounts. One ruled row per category, the name set large, a dotted leader
 * carrying the eye to the action.
 *
 * It needs no photography, so it doesn't degrade while the shoot is pending,
 * and it doesn't become dead weight once the photos land either.
 */
export function CategoryGrid() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="font-display text-display-md text-dbb-cream mb-12">
        SHOP BY CATEGORY
      </h2>

      <ul>
        {CATEGORIES.map((cat) => (
          <li key={cat.key}>
            <Link
              href={`/shop?category=${cat.key}`}
              className="group flex items-baseline gap-4 py-6 border-b border-dbb-border transition-colors hover:border-dbb-ledger"
            >
              <span className="font-display text-3xl sm:text-5xl tracking-[0.06em] text-dbb-cream shrink-0 transition-colors group-hover:text-dbb-ash">
                {cat.label.toUpperCase()}
              </span>

              <span
                aria-hidden="true"
                className="flex-1 border-b border-dotted border-dbb-border translate-y-[-6px]"
              />

              <span className="flex items-center gap-2 font-body text-[11px] tracking-[0.25em] uppercase text-dbb-muted shrink-0 transition-colors group-hover:text-dbb-cream">
                View
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
