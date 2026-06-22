// src/components/shop/TickerTape.tsx

const words = [
  'DONE BEING BROKE',
  'DBB',
  'THE MINDSET IS THE MOVEMENT',
  'BUILT DIFFERENT',
  'NO EXCUSES',
  'STAY DANGEROUS',
  'DBB',
  'DONE BEING BROKE',
  'THE MINDSET IS THE MOVEMENT',
  'BUILT DIFFERENT',
  'NO EXCUSES',
  'STAY DANGEROUS',
]

export function TickerTape({ inverted = false }: { inverted?: boolean }) {
  return (
    <div
      className={`overflow-hidden py-4 border-y ${
        inverted
          ? 'bg-dbb-cream border-dbb-cream'
          : 'bg-dbb-black border-dbb-border'
      }`}
    >
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {words.map((w, i) => (
          <span
            key={i}
            className={`font-display text-sm tracking-[0.3em] ${
              inverted ? 'text-dbb-black' : 'text-dbb-muted'
            }`}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}
