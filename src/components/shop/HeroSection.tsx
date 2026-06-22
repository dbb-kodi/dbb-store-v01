// src/components/shop/HeroSection.tsx
import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-dbb-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://placehold.co/1920x1080/111111/ffffff?text=DBB"
          alt="DBB Hero"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dbb-black via-dbb-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 w-full">
        <p className="section-label">Done Being Broke</p>
        <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.92] tracking-[0.02em] text-dbb-cream mb-8">
          MORE THAN<br />CLOTHING.
        </h1>
        <p className="font-body text-base text-dbb-ash max-w-sm mb-10 leading-relaxed">
          It&apos;s a mindset. Built for the driven, the ambitious, the relentless.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/shop" className="btn-primary">SHOP NOW</Link>
          <Link href="/story" className="btn-outline">OUR STORY</Link>
        </div>
      </div>
    </section>
  )
}
