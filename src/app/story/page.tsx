// src/app/story/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'
import { fetchSiteContent } from '@/lib/data/queries'
// Story hero — black hoodie on rack (Unsplash, free to use)
const STORY_IMG = 'https://images.unsplash.com/photo-1612978322313-be209301e185?auto=format&fit=crop&w=1920&h=800&q=80'

export const metadata = {
  title: 'Our Story — DBB',
  description: 'The origin of Done Being Broke. A mindset built from struggle and ambition.',
}

export default async function StoryPage() {
  const content = await fetchSiteContent()
  const paragraphs = content.story_body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-end overflow-hidden bg-dbb-black">
        <div className="absolute inset-0">
          <Image
            src={STORY_IMG}
            alt="Our Story"
            fill
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dbb-black to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
          <p className="section-label">Who We Are</p>
          <h1 className="font-display text-display-lg text-dbb-cream">
            {content.story_headline}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="space-y-8 font-body text-base text-dbb-ash leading-relaxed">
          <p className="font-display text-3xl text-dbb-cream">
            &ldquo;Done Being Broke started with a decision — not a dollar.&rdquo;
          </p>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
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
