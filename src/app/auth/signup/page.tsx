// src/app/auth/signup/page.tsx
import Link from 'next/link'

export const metadata = { title: 'Sign Up — DBB' }

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="block font-display text-4xl tracking-[0.3em] text-dbb-cream mb-12 text-center">
          DBB
        </Link>

        <p className="section-label text-center">Join The Movement</p>
        <h1 className="font-display text-4xl tracking-[0.1em] text-dbb-cream text-center mb-10">
          CREATE ACCOUNT
        </h1>

        <form className="flex flex-col gap-5">
          <div>
            <label className="admin-label">Full Name</label>
            <input type="text" placeholder="Your name" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Email</label>
            <input type="email" placeholder="your@email.com" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Password</label>
            <input type="password" placeholder="••••••••" className="admin-input" />
          </div>
          <button type="submit" className="btn-primary w-full justify-center mt-2">
            CREATE ACCOUNT
          </button>
        </form>

        <p className="font-body text-sm text-dbb-muted text-center mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-dbb-cream hover:text-dbb-ash transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
