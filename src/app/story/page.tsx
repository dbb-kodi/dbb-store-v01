// src/app/story/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Our Story — DBB',
  description: 'The origin of Done Being Broke. A mindset built from struggle and ambition.',
}

export default function StoryPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-end overflow-hidden bg-dbb-black">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x800/111111/ffffff?text=Our+Story"
            alt="Our Story"
            fill
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dbb-black to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
          <p className="section-label">Who We Are</p>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.92] tracking-[0.02em] text-dbb-cream">
            THE STORY
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="space-y-8 font-body text-base text-dbb-ash leading-relaxed">
          <p className="font-display text-3xl text-dbb-cream">
            &ldquo;Done Being Broke started with a decision — not a dollar.&rdquo;
          </p>
          <p>
            DBB was born from a simple but radical idea: that ambition is a lifestyle, not a moment. We were tired of seeing people settle — settle for less than they&apos;re capable of, less than they deserve, less than they&apos;re built for.
          </p>
          <p>
            So we built a brand for the ones who decided enough was enough. The ones grinding before the sun comes up. The ones who see every setback as a setup. DBB is for the movers, the builders, the ones who choose growth every single day.
          </p>
          <p>
            Every piece we release carries that energy. Heavyweight construction. Clean lines. No noise — just purpose.
          </p>
          <p className="font-display text-2xl text-dbb-cream">
            More than clothing. It&apos;s a mindset.
          </p>
        </div>

        <div className="mt-16">
          <Link href="/shop" className="btn-primary">SHOP THE COLLECTION</Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
