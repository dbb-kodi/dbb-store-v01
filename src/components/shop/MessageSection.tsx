// src/components/shop/MessageSection.tsx
import Link from 'next/link'

export function MessageSection({ quote }: { quote?: string }) {
  return (
    <section className="py-32 px-6 bg-dbb-black relative overflow-hidden">
      {/* Large background text for depth */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span className="font-display text-[20vw] text-dbb-charcoal/30 leading-none tracking-tight whitespace-nowrap">
          DBB
        </span>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="section-label mb-8">The DBB Message</p>

        <blockquote className="font-display text-display-lg text-dbb-cream leading-tight mb-12">
          &ldquo;{quote || 'Everybody wants more. Few people are willing to become more.'}&rdquo;
        </blockquote>

        <div className="w-16 h-0.5 bg-dbb-acid mx-auto mb-12" />

        <Link href="/story" className="btn-ghost">
          Read Our Story →
        </Link>
      </div>
    </section>
  )
}
