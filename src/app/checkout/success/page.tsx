// src/app/checkout/success/page.tsx
'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

export default function CheckoutSuccessPage() {
  const { clear } = useCart()

  useEffect(() => {
    clear()
  }, [clear])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <CheckCircle size={56} className="text-dbb-cream mb-6" strokeWidth={1} />
      <p className="section-label justify-center flex">Order Confirmed</p>
      <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[0.04em] text-dbb-cream mb-6">
        ORDER PLACED
      </h1>
      <p className="font-body text-base text-dbb-ash max-w-md leading-relaxed mb-12">
        Thank you for your order. A confirmation email is on its way. You&apos;re built for this.
      </p>
      <Link href="/shop" className="btn-primary">KEEP SHOPPING</Link>
    </main>
  )
}
