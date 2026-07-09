// src/components/shop/UnpostedEntry.tsx

import type { Product } from '@/types'

/**
 * The placeholder a product wears while its photography doesn't exist yet.
 *
 * A skeleton shimmer would say "our CDN is slow." That isn't what's true here.
 * In bookkeeping, a transaction that exists but hasn't been recorded is
 * *unposted* — and that is exactly the state of these products: name, price,
 * SKU and stock all recorded, the asset itself not yet entered. So the card is
 * a ledger line with one empty field, on ruled paper, rather than a grey void
 * pretending to load.
 *
 * Six of eight cards render this. It has to survive repetition, so everything
 * is quiet: rules at 4% lightness, no motion, no shimmer, one red mark.
 */

/**
 * mindset-hoodie -> DBB-MINDSET-HOODIE, but dbb-tee -> DBB-TEE, not DBB-DBB-TEE.
 * Several slugs already carry the brand; prefixing blindly stutters.
 *
 * Exported because the PDP renders the same line reference and had its own
 * copy of the naive version.
 */
export function reference(slug: string) {
  return `DBB-${slug.replace(/^dbb-/, '').toUpperCase()}`
}

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-body text-[10px] tracking-[0.2em] uppercase text-dbb-muted shrink-0">
        {label}
      </span>
      {/* The dotted leader: how a ruled ledger carries the eye from a label to
          a figure across an uneven gap. It's the reason this reads as a book
          and not as a spec table. */}
      <span
        aria-hidden="true"
        className="flex-1 border-b border-dotted border-dbb-border/60 translate-y-[-3px]"
      />
      <span
        className={`font-body text-[11px] tabular-nums shrink-0 ${
          muted ? 'text-dbb-muted' : 'text-dbb-ash'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export function UnpostedEntry({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between bg-dbb-surface"
      style={{
        // Feint rules. Ledger paper, not a grid: horizontal only, and at a
        // pitch that matches the row rhythm below rather than an arbitrary 8px.
        backgroundImage:
          'repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, #141414 27px, #141414 28px)',
      }}
    >
      <div className={large ? 'p-8' : 'p-4'}>
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-dbb-muted">
          {reference(product.slug)}
        </p>
      </div>

      <div className={`text-center ${large ? 'px-8' : 'px-4'}`}>
        {/* dbb-muted, not dbb-border: this is the card's one statement and it
            has to be legible. Border-grey on surface-grey is decoration. */}
        <p
          className={`font-display tracking-[0.2em] text-dbb-muted ${
            large ? 'text-5xl' : 'text-2xl'
          }`}
        >
          UNPOSTED
        </p>
      </div>

      <div className={`flex flex-col gap-2 ${large ? 'p-8' : 'p-4'}`}>
        <Row label="Debit" value={`$${product.price.toFixed(2)}`} />
        {/* The one field with nothing in it. Stated plainly — an empty state
            explains what's missing, it doesn't apologize for it. */}
        <Row label="Image" value="Awaiting photography" muted />

        {/* The ledger rule, thin over thick, closing the entry. Same device as
            every price on the site. */}
        <div className="pt-1">
          <div className="border-b border-dbb-ledger" />
          <div className="border-b-2 border-dbb-ledger mt-[2px]" />
        </div>
      </div>
    </div>
  )
}

/** A product whose image is the generated placeholder data-URI, not a photograph. */
export function isUnposted(product: Product) {
  return !product.image_url || product.image_url.startsWith('data:')
}
