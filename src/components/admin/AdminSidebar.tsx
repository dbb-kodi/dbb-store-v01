// src/components/admin/AdminSidebar.tsx
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, FileText, ArrowLeft } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/content', label: 'Content', icon: FileText },
]

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-dbb-surface border-r border-dbb-border flex flex-col z-30">
      <div className="px-6 py-6 border-b border-dbb-border">
        <Link href="/" className="font-display text-2xl tracking-[0.2em] text-dbb-cream">
          DBB
        </Link>
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-dbb-muted mt-1">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-3 font-body text-xs tracking-[0.15em] uppercase text-dbb-ash hover:text-dbb-cream hover:bg-dbb-elevated transition-all rounded-none"
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-6 border-t border-dbb-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 font-body text-xs tracking-[0.15em] uppercase text-dbb-muted hover:text-dbb-cream transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Site
        </Link>
      </div>
    </aside>
  )
}
