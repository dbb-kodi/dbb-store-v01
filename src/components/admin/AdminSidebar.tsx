'use client'
// src/components/admin/AdminSidebar.tsx

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Type, Users, Image, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const LINKS = [
  { href: '/admin',             label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/products',    label: 'Products',    icon: Package },
  { href: '/admin/orders',      label: 'Orders',      icon: ShoppingCart },
  { href: '/admin/content',     label: 'Site Content', icon: Type },
  { href: '/admin/community',   label: 'Community',   icon: Image },
  { href: '/admin/customers',   label: 'Customers',   icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dbb-charcoal border-r border-dbb-smoke flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-dbb-smoke">
        <span className="font-display text-2xl text-dbb-acid tracking-widest">DBB</span>
        <p className="font-body text-[10px] text-dbb-ash tracking-widest uppercase mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-body tracking-wide transition-colors ${
                active
                  ? 'bg-dbb-acid/10 text-dbb-acid border-l-2 border-dbb-acid'
                  : 'text-dbb-ash hover:text-dbb-cream hover:bg-dbb-black/50'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-dbb-smoke">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-xs text-dbb-ash hover:text-dbb-cream tracking-widest uppercase mb-2"
        >
          ← View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-xs text-dbb-smoke hover:text-red-400 tracking-widest uppercase w-full transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
