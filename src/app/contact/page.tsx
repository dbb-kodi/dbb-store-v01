// src/app/contact/page.tsx
'use client'

import { useState } from 'react'
import { Footer } from '@/components/layout/Footer'
import toast from 'react-hot-toast'

const CONTACT_EMAIL = 'contact@donebeingbroke.com'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // For now, just show a success message
      // In production, this would send to an email service
      toast.success('Message sent! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Failed to send message. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dbb-black pt-24">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-display-lg text-dbb-cream mb-4">
          GET IN TOUCH
        </h1>
        <p className="font-body text-dbb-ash mb-12">
          Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mb-16">
          <div>
            <label className="admin-label">NAME</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="admin-label">EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="admin-label">SUBJECT</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="admin-input"
              placeholder="What is this about?"
            />
          </div>

          <div>
            <label className="admin-label">MESSAGE</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="admin-input min-h-32 resize-none"
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>

        <div className="border-t border-dbb-charcoal pt-8">
          <p className="font-body text-dbb-ash text-sm">
            Or email us directly at:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-dbb-acid hover:text-dbb-cream transition-colors">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>

      <Footer
        instagramUrl="https://instagram.com/donebeingbroke"
        tiktokUrl="https://tiktok.com/@donebeingbroke"
        contactEmail={CONTACT_EMAIL}
      />
    </div>
  )
}
