// src/app/checkout/cancel/page.tsx
import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <XCircle size={56} className="text-dbb-muted mb-6" strokeWidth={1} />
      <p className="section-label justify-center flex">Payment Cancelled</p>
      <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[0.04em] text-dbb-cream mb-6">
        CANCELLED
      </h1>
      <p className="font-body text-base text-dbb-ash max-w-md leading-relaxed mb-12">
        Your order was cancelled and nothing was charged. Your bag is still saved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/checkout" className="btn-primary">BACK TO CHECKOUT</Link>
        <Link href="/shop" className="btn-outline">CONTINUE SHOPPING</Link>
      </div>
    </main>
  )
}
