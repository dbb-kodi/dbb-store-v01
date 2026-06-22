// src/components/layout/Footer.tsx
'use client'

import Link from 'next/link'

interface FooterProps {
  instagramUrl?: string
  tiktokUrl?: string
  contactEmail?: string
}

export function Footer({ instagramUrl, tiktokUrl, contactEmail }: FooterProps) {
  return (
    <footer className="bg-dbb-charcoal border-t border-dbb-smoke py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <span className="font-display text-3xl text-dbb-acid tracking-widest">DBB</span>
          <span className="font-body text-[9px] tracking-[0.3em] text-dbb-ash uppercase">Done Being Broke</span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6">
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-widest text-dbb-ash hover:text-dbb-acid transition-colors uppercase"
            >
              Instagram
            </a>
          )}
          {tiktokUrl && (
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-widest text-dbb-ash hover:text-dbb-acid transition-colors uppercase"
            >
              TikTok
            </a>
          )}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="font-body text-xs tracking-widest text-dbb-ash hover:text-dbb-acid transition-colors uppercase"
            >
              Contact
            </a>
          )}
          <Link href="/admin" className="font-body text-xs tracking-widest text-dbb-smoke hover:text-dbb-ash transition-colors uppercase">
            Admin
          </Link>
        </nav>

        {/* Copyright */}
        <p className="font-body text-xs text-dbb-smoke tracking-widest">
          © {new Date().getFullYear()} Done Being Broke
        </p>
      </div>
    </footer>
  )
}
