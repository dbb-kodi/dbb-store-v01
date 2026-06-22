'use client'
// src/app/auth/login/page.tsx

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const router                  = useRouter()
  const searchParams            = useSearchParams()
  const redirect                = searchParams.get('redirect') || '/'
  const supabase                = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-dbb-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <span className="font-display text-5xl text-dbb-acid tracking-widest">DBB</span>
          <p className="font-body text-xs text-dbb-ash tracking-widest mt-2 uppercase">Done Being Broke</p>
        </div>

        <h1 className="font-display text-3xl text-dbb-cream tracking-widest mb-8">SIGN IN</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="admin-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="admin-input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="admin-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="admin-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary justify-center mt-2">
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <p className="text-center mt-6 font-body text-sm text-dbb-ash">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-dbb-acid hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
