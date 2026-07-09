'use client'
// src/components/Reveal.tsx

import { useEffect, useRef, useState } from 'react'

/**
 * Fades + lifts its children in when they scroll into view, once.
 *
 * IntersectionObserver rather than a scroll listener: the callback fires off
 * the main thread's scroll path, so a slow render never janks the scroll.
 * Disconnects after firing — a section that re-animates every time you scroll
 * past it stops being delight and becomes noise.
 *
 * The animation itself lives in the .reveal class (globals.css) so it runs as
 * a CSS transition off the main thread, and so prefers-reduced-motion can
 * downgrade it to a plain opacity fade in one place.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  /** Stagger offset in ms. Keep under ~80ms between siblings. */
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already in view on mount (above the fold, or a refresh mid-page):
    // show immediately rather than waiting for a scroll that may never come.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      // Fire slightly before the element's top edge clears the viewport bottom,
      // so the motion is already resolving by the time it's properly on screen.
      { rootMargin: '0px 0px -80px 0px', threshold: 0.01 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-visible={visible}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
