'use client'
// src/components/shop/SizeGuideModal.tsx

import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { Category } from '@/types'

const MEASUREMENTS: Record<Category, { rows: string[][]; unit: string }> = {
  hoodies: {
    unit: 'Chest width (in), laid flat',
    rows: [
      ['XS', '19'], ['S', '20'], ['M', '21'], ['L', '22'], ['XL', '23'], ['XXL', '24'],
    ],
  },
  tees: {
    unit: 'Chest width (in), laid flat',
    rows: [
      ['XS', '17'], ['S', '18'], ['M', '19'], ['L', '20'], ['XL', '21'], ['XXL', '22'],
    ],
  },
  headwear: {
    unit: 'One size — adjustable strap, fits most',
    rows: [],
  },
  accessories: {
    unit: 'One size',
    rows: [],
  },
}

export function SizeGuideModal({
  category,
  open,
  onClose,
}: {
  category: Category
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const { rows, unit } = MEASUREMENTS[category]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Size guide"
      className="fixed inset-0 z-50 flex items-center justify-center bg-dbb-black/80 px-6 motion-safe:animate-[fade-in_150ms_var(--ease-out)]"
      onClick={onClose}
    >
      {/* Enters from scale(0.96), never scale(0) — nothing in the real world
          appears from nothing. transform-origin stays centered: this is a
          modal, not a popover anchored to its trigger. */}
      <div
        className="bg-dbb-surface border border-dbb-border max-w-sm w-full p-8 motion-safe:animate-[modal-in_200ms_var(--ease-out)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <p className="font-display text-2xl text-dbb-cream">Size Guide</p>
          <button onClick={onClose} aria-label="Close" className="text-dbb-ash hover:text-dbb-cream transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="font-body text-xs tracking-[0.15em] uppercase text-dbb-ash mb-4">{unit}</p>

        {rows.length > 0 && (
          <table className="w-full font-body text-sm text-dbb-cream">
            <tbody>
              {rows.map(([size, value]) => (
                <tr key={size} className="border-b border-dbb-border last:border-b-0">
                  <td className="py-2 text-dbb-ash">{size}</td>
                  <td className="py-2 text-right">{value}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="font-body text-xs text-dbb-muted mt-6">
          Runs true to size. Between sizes? Size up for the boxy fit.
        </p>
      </div>
    </div>
  )
}
