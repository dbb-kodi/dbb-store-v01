// src/components/shop/HeroSection.tsx
import Link from 'next/link'
import Image from 'next/image'
// Hero background — person in black hoodie (Unsplash, free to use)
const HERO_IMG = 'https://images.unsplash.com/photo-1546863929-b9c543a2aec7?auto=format&fit=crop&w=1920&h=1080&q=80'

export function HeroSection({
  headline = 'MORE THAN CLOTHING.',
  subtext = "It's a mindset. Built for the driven, the ambitious, the relentless.",
}: {
  headline?: string
  subtext?: string
}) {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-dbb-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="DBB Hero"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dbb-black via-dbb-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 w-full">
        <p className="section-label ledger-rule inline-block">Done Being Broke</p>
        <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.92] tracking-[0.02em] text-dbb-cream mb-8">
          {headline.split(' ').length > 2 ? (
            <>
              {headline.split(' ').slice(0, 2).join(' ')}
              <br />
              {headline.split(' ').slice(2).join(' ')}
            </>
          ) : (
            headline
          )}
        </h1>
        <p className="font-body text-base text-dbb-ash max-w-sm mb-10 leading-relaxed">{subtext}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/shop" className="btn-primary">SHOP NOW</Link>
          <Link href="/story" className="btn-outline">OUR STORY</Link>
        </div>
      </div>
    </section>
  )
}
