// src/lib/supabase/session.ts
import { createClient } from './server'

export async function getSessionProfile() {
  const supabase = createClient()
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, profile: null }
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  return { supabase, user, profile }
}

export async function requireAdmin() {
  const session = await getSessionProfile()
  if (!session || !session.user || session.profile?.role !== 'admin') return null
  return session
}
