'use client'
// src/components/shop/CategoryFilter.tsx

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/types'

const filters: Array<{ key: Category | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'hoodies', label: 'Hoodies' },
  { key: 'tees', label: 'Tees' },
  { key: 'headwear', label: 'Headwear' },
  { key: 'accessories', label: 'Accessories' },
]

export function CategoryFilter() {
  const router = useRouter()
  const params = useSearchParams()
  const active = (params.get('category') ?? 'all') as Category | 'all'

  const setFilter = (key: Category | 'all') => {
    const url = key === 'all' ? '/shop' : `/shop?category=${key}`
    router.push(url)
  }

  return (
    <div className="flex flex-wrap gap-3 py-6 border-b border-dbb-border">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => setFilter(f.key)}
          className={`font-body text-xs tracking-[0.2em] uppercase px-5 py-2.5 border transition-all duration-200 ${
            active === f.key
              ? 'border-dbb-cream bg-dbb-cream text-dbb-black'
              : 'border-dbb-border text-dbb-ash hover:border-dbb-cream hover:text-dbb-cream'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
