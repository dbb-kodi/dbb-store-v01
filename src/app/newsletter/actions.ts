'use server'
// src/app/newsletter/actions.ts

import { createClient } from '@/lib/supabase/server'

export async function subscribeToNewsletter(formData: FormData): Promise<{ error?: string }> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email) return { error: 'Email required' }

  const supabase = createClient()
  if (!supabase) return { error: 'Backend not configured' }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email })

  if (error && error.code !== '23505') return { error: error.message }

  if (!error) {
    try {
      const apiKey = process.env.RESEND_API_KEY
      const from = process.env.RESEND_FROM_EMAIL
      if (apiKey && from) {
        const { Resend } = await import('resend')
        const resend = new Resend(apiKey)
        await resend.emails.send({
          from,
          to: email,
          subject: 'Welcome to DBB',
          html: '<p>Thanks for joining the movement. Stay tuned for drops and updates.</p>',
        })
      }
    } catch {
      // best-effort — subscription already succeeded regardless of email send outcome
    }
  }

  return {}
}
