// src/app/admin/content/page.tsx
import { ContentEditor } from '@/components/admin/ContentEditor'

const defaultFields = [
  { key: 'hero_headline', label: 'Hero Headline', type: 'text', currentValue: 'MORE THAN CLOTHING.' },
  { key: 'hero_subtext', label: 'Hero Subtext', type: 'text', currentValue: "It's a mindset." },
  { key: 'ticker_text', label: 'Ticker Text', type: 'text', currentValue: 'DONE BEING BROKE · THE MINDSET IS THE MOVEMENT · BUILT DIFFERENT' },
  { key: 'story_headline', label: 'Story Headline', type: 'text', currentValue: 'THE STORY' },
  { key: 'story_body', label: 'Story Body', type: 'textarea', currentValue: 'DBB was born from a simple but radical idea...' },
  { key: 'message_quote', label: 'Message Section Quote', type: 'textarea', currentValue: 'Done Being Broke is not about money. It\'s about deciding you\'ll never settle again.' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'text', currentValue: 'https://instagram.com/donebeingbroke' },
]

export default function AdminContentPage() {
  return (
    <div>
      <p className="section-label">CMS</p>
      <h1 className="font-display text-5xl tracking-[0.04em] text-dbb-cream mb-12">CONTENT</h1>
      <ContentEditor fields={defaultFields} />
    </div>
  )
}
