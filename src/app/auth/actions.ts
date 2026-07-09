'use server'
// src/app/auth/actions.ts

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = createClient()
  if (!supabase) redirect('/auth/login?error=' + encodeURIComponent('Backend not configured'))

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/auth/login?error=' + encodeURIComponent(error.message))

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  redirect(profile?.role === 'admin' ? '/admin' : '/account')
}

export async function signOut() {
  const supabase = createClient()
  if (supabase) await supabase.auth.signOut()
  redirect('/')
}

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const fullName = String(formData.get('fullName') ?? '')

  const supabase = createClient()
  if (!supabase) redirect('/auth/signup?error=' + encodeURIComponent('Backend not configured'))

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) redirect('/auth/signup?error=' + encodeURIComponent(error.message))

  redirect('/auth/login?message=' + encodeURIComponent('Check your email to confirm your account'))
}
