'use client'
// src/components/shop/HeroSection.tsx

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  videoUrl?: string
  headline?: string
  subtext?: string
  ctaLabel?: string
}

export function HeroSection({
  videoUrl,
  headline = 'DONE BEING BROKE',
  subtext = 'Stop waiting. Start building.',
  ctaLabel = 'SHOP THE DROP',
}: HeroSectionProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const timer = setTimeout(() => el.classList.add('visible'), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Video or fallback gradient */}
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-dbb-charcoal via-dbb-black to-dbb-black" />
      )}

      {/* Diagonal split overlay — dark on left, lighter on right */}
      <div className="hero-split absolute inset-0" />

      {/* Diagonal accent line */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 45%, rgba(200,255,0,0.04) 45%, rgba(200,255,0,0.04) 46%, transparent 46%)',
        }}
      />

      {/* Content — left-aligned */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-8 md:px-16 max-w-7xl mx-auto w-full">
        <div ref={textRef} className="reveal">
          {/* Eyebrow */}
          <p className="section-label mb-6">Est. DBB Collection</p>

          {/* Main headline */}
          <h1 className="font-display text-display-xl text-dbb-cream leading-none mb-6 max-w-2xl">
            {headline}
          </h1>

          {/* Sub */}
          <p className="font-body text-base md:text-lg text-dbb-ash mb-10 max-w-sm tracking-wide">
            {subtext}
          </p>

          {/* CTA */}
          <Link href="/shop" className="btn-primary inline-flex">
            {ctaLabel}
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2 opacity-40">
          <span className="font-body text-[10px] tracking-[0.3em] text-dbb-cream rotate-90 mb-4">SCROLL</span>
          <div className="w-px h-12 bg-dbb-cream animate-pulse" />
        </div>
      </div>
    </section>
  )
}
