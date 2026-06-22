// src/lib/supabase/client.ts
// Browser-side Supabase client (untyped on purpose — see DBB_PROMPT.md).
// Returns null when env vars are absent so the frontend builds without a backend.
import { createBrowserClient } from '@supabase/ssr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): any {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createBrowserClient(url, key)
}
