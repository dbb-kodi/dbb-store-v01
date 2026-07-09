// src/components/shop/FinalCTA.tsx
import Link from 'next/link'

/**
 * The background here used to be Unsplash photo-1719620293684 — a hoodie
 * carrying a third party's graphic, and one of the exact images migration 0005
 * deleted from community_posts for that reason. It was still shipping full-bleed
 * on the homepage. Removed.
 *
 * Nothing replaces it. Ruled ledger paper was tried here and pulled back out:
 * on the unposted product card the rules mean something (it is a ledger line);
 * as a section background they are just stripes. The device is stronger for
 * living in exactly one place.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-dbb-black py-32">
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-display-lg text-dbb-cream mb-8">
          BUILT FOR<br />THE DRIVEN
        </h2>
        <p className="font-body text-base text-dbb-ash mb-10 max-w-md mx-auto leading-relaxed">
          Every piece is designed with purpose. Wear it like you mean it.
        </p>
        <Link href="/shop" className="btn-primary">
          SHOP THE COLLECTION
        </Link>
      </div>
    </section>
  )
}
