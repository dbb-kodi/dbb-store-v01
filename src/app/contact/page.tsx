// src/app/contact/page.tsx
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Contact — DBB',
  description: 'Get in touch with the DBB team.',
}

export default function ContactPage() {
  return (
    <main className="pt-16">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <p className="section-label">Get In Touch</p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[0.04em] text-dbb-cream mb-4">
          CONTACT
        </h1>
        <p className="font-body text-base text-dbb-ash mb-16 leading-relaxed">
          Questions, collabs, or press inquiries — we&apos;re here.
        </p>

        <form className="flex flex-col gap-6">
          <div>
            <label className="admin-label">Name</label>
            <input type="text" placeholder="Your name" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Email</label>
            <input type="email" placeholder="your@email.com" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Subject</label>
            <select className="admin-input">
              <option value="">Select a subject</option>
              <option value="order">Order Support</option>
              <option value="collab">Collaboration</option>
              <option value="press">Press Inquiry</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Message</label>
            <textarea placeholder="Tell us more..." rows={5} className="admin-input resize-none" />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            SEND MESSAGE
          </button>
        </form>
      </div>
      <Footer />
    </main>
  )
}
