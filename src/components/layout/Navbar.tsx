'use client'
// src/components/layout/Navbar.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/story', label: 'Story' },
  { href: '/community', label: 'Community' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { count, openCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const itemCount = mounted ? count() : 0

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled ? 'bg-dbb-black/90 backdrop-blur-md border-b border-dbb-border' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-3xl tracking-[0.2em] text-dbb-cream">
          DBB
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={openCart}
            className="relative text-dbb-cream hover:text-dbb-ash transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-dbb-cream text-dbb-black text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-dbb-cream"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-dbb-black border-b border-dbb-border px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="nav-link text-base"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
