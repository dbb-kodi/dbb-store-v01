// src/components/shop/FinalCTA.tsx
import Link from 'next/link'
import Image from 'next/image'
// CTA background — person wearing black hoodie (Unsplash, free to use)
const CTA_IMG = 'https://images.unsplash.com/photo-1719620293684-24c428bce8fb?auto=format&fit=crop&w=1920&h=600&q=80'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-dbb-black py-32">
      <div className="absolute inset-0 opacity-20">
        <Image
          src={CTA_IMG}
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="section-label justify-center flex">Limited Drops</p>
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
