// src/components/shop/MessageSection.tsx

export function MessageSection() {
  return (
    <section className="py-32 px-6 bg-dbb-surface">
      <div className="max-w-4xl mx-auto text-center">
        <p className="section-label justify-center flex">The Philosophy</p>
        <blockquote className="font-display text-[clamp(2rem,7vw,6rem)] leading-[0.95] tracking-[0.02em] text-dbb-cream">
          &ldquo;DONE BEING BROKE IS NOT ABOUT MONEY. IT&apos;S ABOUT DECIDING YOU&apos;LL NEVER SETTLE AGAIN.&rdquo;
        </blockquote>
        <p className="font-body text-sm text-dbb-muted mt-8 tracking-[0.2em] uppercase">
          — The DBB Mindset
        </p>
      </div>
    </section>
  )
}
