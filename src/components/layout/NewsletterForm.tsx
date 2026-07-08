'use client'
// src/components/layout/NewsletterForm.tsx

import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { subscribeToNewsletter } from '@/app/newsletter/actions'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await subscribeToNewsletter(formData)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success('Subscribed')
      setEmail('')
    })
  }

  return (
    <form action={handleSubmit} className="flex gap-2">
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="flex-1 bg-transparent border border-dbb-border px-3 py-2 text-sm text-dbb-cream placeholder:text-dbb-muted"
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 text-xs tracking-[0.15em] uppercase bg-dbb-cream text-dbb-black hover:opacity-90 transition-all disabled:opacity-50"
      >
        {isPending ? '...' : 'Join'}
      </button>
    </form>
  )
}
