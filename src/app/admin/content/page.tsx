// src/app/admin/content/page.tsx
import { ContentEditor } from '@/components/admin/ContentEditor'
import { fetchSiteContent } from '@/lib/data/queries'

const FIELDS: Array<{ key: string; label: string; type: string }> = [
  { key: 'hero_headline', label: 'Hero Headline', type: 'text' },
  { key: 'hero_subtext', label: 'Hero Subtext', type: 'text' },
  { key: 'ticker_text', label: 'Ticker Text', type: 'text' },
  { key: 'story_headline', label: 'Story Headline', type: 'text' },
  { key: 'story_body', label: 'Story Body', type: 'textarea' },
  { key: 'message_quote', label: 'Message Section Quote', type: 'textarea' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'text' },
]

export default async function AdminContentPage() {
  const content = await fetchSiteContent()
  const fields = FIELDS.map((f) => ({ ...f, currentValue: content[f.key] ?? '' }))

  return (
    <div>
      <p className="section-label">CMS</p>
      <h1 className="font-display text-5xl tracking-[0.04em] text-dbb-cream mb-12">CONTENT</h1>
      <ContentEditor fields={fields} />
    </div>
  )
}
