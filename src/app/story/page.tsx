// src/app/story/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Our Story | DBB',
  description: 'Learn about Done Being Broke',
}

async function getSiteContent() {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('site_content').select('*')
    return Object.fromEntries((data ?? []).map(row => [row.key, row.value ?? '']))
  } catch {
    return {}
  }
}

export default async function StoryPage() {
  const content = await getSiteContent()

  return (
    <div className="min-h-screen bg-dbb-black pt-24">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-display-lg text-dbb-cream mb-12">
          OUR STORY
        </h1>

        <div className="font-body text-dbb-cream space-y-6 mb-20">
          {content.story_body ? (
            <div
              dangerouslySetInnerHTML={{ __html: content.story_body }}
              className="prose prose-invert max-w-none"
            />
          ) : (
            <p className="text-dbb-ash">
              DBB was born from a feeling — the frustration of where you are versus where you know you
              can be. We believe more than clothing. It's a mindset. Stop waiting. Start building.
            </p>
          )}
        </div>

        <blockquote className="border-l-4 border-dbb-acid pl-6 py-4 mb-20">
          <p className="font-display text-2xl text-dbb-cream">
            {content.dbb_quote || 'Everybody wants more. Few people are willing to become more.'}
          </p>
        </blockquote>

        <div className="text-center">
          <a href="/shop" className="btn-primary">
            START BUILDING
          </a>
        </div>
      </div>

      <Footer
        instagramUrl={content.instagram_url}
        tiktokUrl={content.tiktok_url}
        contactEmail={content.contact_email}
      />
    </div>
  )
}
