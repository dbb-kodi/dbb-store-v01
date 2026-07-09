// src/components/shop/TickerTape.tsx

const DEFAULT_TEXT =
  'DONE BEING BROKE · DBB · THE MINDSET IS THE MOVEMENT · BUILT DIFFERENT · NO EXCUSES · STAY DANGEROUS'

export function TickerTape({ inverted = false, text }: { inverted?: boolean; text?: string }) {
  const base = (text ?? DEFAULT_TEXT).split('·').map((w) => w.trim()).filter(Boolean)
  // Repeat so the marquee loop never shows a gap
  const words = [...base, ...base]

  return (
    <div
      className={`overflow-hidden py-4 border-y-2 ${
        inverted
          ? 'bg-dbb-cream border-dbb-ledger'
          : 'bg-dbb-black border-dbb-ledger'
      }`}
    >
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {words.map((w, i) => (
          <span key={i} className="flex items-center gap-12">
            <span
              className={`font-display text-sm tracking-[0.3em] ${
                inverted ? 'text-dbb-black' : 'text-dbb-muted'
              }`}
            >
              {w}
            </span>
            <span className="text-dbb-ledger" aria-hidden="true">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}
