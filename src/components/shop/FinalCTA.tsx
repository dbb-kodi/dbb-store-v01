// src/components/shop/FinalCTA.tsx
import Link from 'next/link'
import Image from 'next/image'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-dbb-black py-32">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://placehold.co/1920x600/111111/ffffff?text=DBB"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="section-label justify-center flex">Limited Drops</p>
        <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.92] tracking-[0.02em] text-dbb-cream mb-8">
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
