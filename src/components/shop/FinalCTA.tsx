// src/components/shop/FinalCTA.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface FinalCTAProps {
  headline?: string
  subtext?: string
  buttonLabel?: string
}

export function FinalCTA({
  headline = 'DONE BEING BROKE.',
  subtext = 'Stop waiting. Start building.',
  buttonLabel = 'SHOP NOW',
}: FinalCTAProps) {
  return (
    <section className="py-40 px-6 bg-dbb-black text-center relative overflow-hidden">
      {/* Acid horizontal rule */}
      <div className="w-full h-px bg-dbb-acid/20 mb-0" />

      <div className="max-w-4xl mx-auto py-32">
        <h2 className="font-display text-display-xl text-dbb-cream mb-6 leading-none">
          {headline}
        </h2>
        <p className="font-body text-lg text-dbb-ash mb-12 tracking-widest">{subtext}</p>
        <Link href="/shop" className="btn-primary text-2xl">
          {buttonLabel}
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  )
}
