// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Instagram } from 'lucide-react'

const shopLinks = [
  { href: '/shop', label: 'All Products' },
  { href: '/shop?category=hoodies', label: 'Hoodies' },
  { href: '/shop?category=tees', label: 'Tees' },
  { href: '/shop?category=headwear', label: 'Headwear' },
]

const brandLinks = [
  { href: '/story', label: 'Our Story' },
  { href: '/community', label: 'Community' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="bg-dbb-black border-t border-dbb-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <span className="font-display text-4xl tracking-[0.2em] text-dbb-cream">DBB</span>
            <p className="font-body text-sm text-dbb-muted mt-3 max-w-xs leading-relaxed">
              Done Being Broke. More than clothing — it&apos;s a mindset. Built for the driven.
            </p>
          </div>

          <div>
            <p className="section-label">Shop</p>
            <ul className="flex flex-col gap-3">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="nav-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="section-label">Brand</p>
            <ul className="flex flex-col gap-3">
              {brandLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="nav-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-dbb-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs tracking-widest text-dbb-muted uppercase">
            © {new Date().getFullYear()} Done Being Broke
          </p>
          <a
            href="https://instagram.com/donebeingbroke"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dbb-ash hover:text-dbb-cream transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
