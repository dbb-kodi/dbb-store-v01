// src/app/admin/content/page.tsx
// Let the client edit all homepage text, video URL, social links, etc.

import { createClient } from '@/lib/supabase/server'
import { ContentEditor } from '@/components/admin/ContentEditor'

export default async function AdminContentPage() {
  const supabase = createClient()
  const { data: content } = await supabase
    .from('site_content')
    .select('*')
    .order('key')

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-dbb-cream tracking-widest">SITE CONTENT</h1>
        <p className="font-body text-sm text-dbb-ash mt-1">
          Edit homepage text, video, quotes, and links. Changes go live within 60 seconds.
        </p>
      </div>

      <ContentEditor content={content ?? []} />
    </div>
  )
}
