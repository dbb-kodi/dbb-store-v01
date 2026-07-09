// src/app/story/page.tsx
import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'
import { fetchSiteContent } from '@/lib/data/queries'

// The hero here was Unsplash photo-1612978322313 — captioned "black hoodie on
// rack", actually a hoodie carrying an embroidered "UNDERGROUND SNAX" shield.
// Migration 0005 removed that image from the database for exactly this reason;
// it was still hardcoded on the brand's own story page. Removed. The section
// now carries the ledger rules rather than someone else's garment.

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
      <section
        className="relative h-[60vh] flex items-end overflow-hidden bg-dbb-black"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, #0E0E0E 27px, #0E0E0E 28px)',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
          <p className="section-label ledger-rule inline-block">Who We Are</p>
          <h1 className="font-display text-display-lg text-dbb-cream mt-6">
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
