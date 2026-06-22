'use client'
// src/components/layout/Navbar.tsx

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

const NAV_LINKS = [
  { href: '/',          label: 'HOME' },
  { href: '/shop',      label: 'SHOP' },
  { href: '/story',     label: 'OUR STORY' },
  { href: '/community', label: 'COMMUNITY' },
  { href: '/contact',   label: 'CONTACT' },
]

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobile]   = useState(false)
  const { itemCount, toggleCart } = useCart()
  const count = itemCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dbb-black/95 backdrop-blur-sm border-b border-dbb-charcoal' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex flex-col items-start leading-none group">
          <span className="font-display text-2xl text-dbb-acid tracking-widest group-hover:text-dbb-cream transition-colors">
            DBB
          </span>
          <span className="font-body text-[9px] tracking-[0.25em] text-dbb-ash uppercase">
            Done Being Broke
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-body text-xs tracking-widest text-dbb-ash hover:text-dbb-cream transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Cart + mobile toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleCart}
            className="relative text-dbb-cream hover:text-dbb-acid transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-dbb-acid text-dbb-black text-[10px] font-body font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          <button
            className="md:hidden text-dbb-cream hover:text-dbb-acid transition-colors"
            onClick={() => setMobile(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dbb-black border-t border-dbb-charcoal">
          <nav className="flex flex-col px-6 py-6 gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-display text-3xl text-dbb-cream hover:text-dbb-acid transition-colors"
                onClick={() => setMobile(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
