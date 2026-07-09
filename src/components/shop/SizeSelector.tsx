'use client'
// src/components/shop/SizeSelector.tsx

import type { Variant } from '@/types'

interface Props {
  variants: Variant[]
  selected: string | null
  onChange: (size: string) => void
  onSizeGuideClick: () => void
}

export function SizeSelector({ variants, selected, onChange, onSizeGuideClick }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-dbb-ash">Size</p>
        <button
          type="button"
          onClick={onSizeGuideClick}
          className="font-body text-xs tracking-[0.15em] uppercase text-dbb-muted hover:text-dbb-cream underline transition-colors"
        >
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = selected === v.size
          const outOfStock = v.stock_qty === 0

          return (
            <button
              key={v.id}
              disabled={outOfStock}
              onClick={() => !outOfStock && onChange(v.size)}
              className={`w-12 h-12 font-body text-sm tracking-wider border transition-all duration-200 ${
                outOfStock
                  ? 'border-dbb-border text-dbb-border cursor-not-allowed line-through'
                  : isSelected
                  ? 'border-dbb-cream bg-dbb-cream text-dbb-black'
                  : 'border-dbb-border text-dbb-cream hover:border-dbb-cream'
              }`}
            >
              {v.size}
            </button>
          )
        })}
      </div>

      {(() => {
        const selectedVariant = variants.find((v) => v.size === selected)
        if (selectedVariant && selectedVariant.stock_qty > 0 && selectedVariant.stock_qty <= 5) {
          return (
            <p className="font-body text-xs text-dbb-ledger-text mt-3">
              Only {selectedVariant.stock_qty} left in {selectedVariant.size}
            </p>
          )
        }
        return null
      })()}
    </div>
  )
}
