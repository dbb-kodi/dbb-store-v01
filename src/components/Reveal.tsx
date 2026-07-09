'use client'
// src/components/Reveal.tsx

import { useEffect, useRef, useState } from 'react'

/** If the observer hasn't fired by now, show the content anyway. */
const SAFETY_MS = 3000

/**
 * Fades + lifts its children in when they scroll into view, once.
 *
 * Content is visible by default and the hidden state is *armed* by this
 * component, never assumed. Three ways the reveal can fail to fire, all of
 * which must still leave the page readable:
 *
 *   1. No JavaScript at all — the `armed` state never applies.
 *   2. JS runs but the observer never fires: a background tab, a headless
 *      renderer, a print stylesheet. Hence the safety timer.
 *   3. The element is already on screen at mount — nothing to reveal, so it
 *      is never armed in the first place, and there's no flash.
 *
 * An animation must never be load-bearing for content.
 */
export function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already in view (above the fold, or a refresh mid-page)? Leave it alone.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) return

    setArmed(true)

    const reveal = () => setVisible(true)
    const timer = window.setTimeout(reveal, SAFETY_MS)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal()
          observer.disconnect()
          window.clearTimeout(timer)
        }
      },
      // Fire slightly before the element's top edge clears the viewport bottom,
      // so the motion is already resolving by the time it's properly on screen.
      { rootMargin: '0px 0px -80px 0px', threshold: 0.01 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`${armed ? 'reveal' : ''} ${className}`}
      data-visible={armed ? visible : undefined}
    >
      {children}
    </div>
  )
}
