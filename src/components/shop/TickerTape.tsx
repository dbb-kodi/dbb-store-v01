'use client'
// src/components/shop/TickerTape.tsx
// Scrolling marquee between sections

export function TickerTape({ text }: { text: string }) {
  const repeated = text.repeat(6) // repeat for seamless loop

  return (
    <div className="ticker-wrap bg-dbb-acid py-3 overflow-hidden">
      <div className="ticker-inner">
        {[0, 1].map(i => (
          <span key={i} className="font-display text-2xl tracking-widest text-dbb-black whitespace-nowrap px-8">
            {repeated}
          </span>
        ))}
      </div>
    </div>
  )
}
