'use server'
// src/app/admin/content/actions.ts

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/supabase/session'

const FIELD_META: Record<string, { label: string; type: string }> = {
  hero_headline: { label: 'Hero Headline', type: 'text' },
  hero_subtext: { label: 'Hero Subtext', type: 'text' },
  ticker_text: { label: 'Ticker Text', type: 'text' },
  story_headline: { label: 'Story Headline', type: 'text' },
  story_body: { label: 'Story Body', type: 'textarea' },
  message_quote: { label: 'Message Section Quote', type: 'textarea' },
  instagram_url: { label: 'Instagram URL', type: 'text' },
}

export async function saveContent(values: Record<string, string>): Promise<{ error?: string }> {
  const session = await requireAdmin()
  if (!session) return { error: 'Not authorized' }

  const rows = Object.entries(values)
    .filter(([key]) => key in FIELD_META)
    .map(([key, value]) => ({
      key,
      value,
      label: FIELD_META[key].label,
      type: FIELD_META[key].type,
    }))
  if (rows.length === 0) return { error: 'Nothing to save' }

  const { error } = await session.supabase
    .from('site_content')
    .upsert(rows, { onConflict: 'key' })
  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/story')
  revalidatePath('/admin/content')
  return {}
}
