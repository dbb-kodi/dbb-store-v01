// src/app/community/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Community | DBB',
  description: 'See what the DBB community is building',
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

async function getCommunityPosts() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('community_posts')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function CommunityPage() {
  const [content, posts] = await Promise.all([
    getSiteContent(),
    getCommunityPosts(),
  ])

  return (
    <div className="min-h-screen bg-dbb-black pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="font-display text-display-lg text-dbb-cream mb-4">
          THE COMMUNITY
        </h1>
        <p className="font-body text-dbb-ash mb-12">
          See how the DBB community is building and thriving.
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-dbb-ash text-lg">
              Community posts coming soon. Share your journey with us!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group bg-dbb-charcoal overflow-hidden rounded-sm cursor-pointer hover:shadow-lg transition-shadow"
              >
                {post.media_type === 'image' ? (
                  <img
                    src={post.media_url}
                    alt={post.caption || 'Community post'}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <video
                    src={post.media_url}
                    className="w-full aspect-square object-cover bg-dbb-black"
                    controls
                  />
                )}
                {post.caption && (
                  <div className="p-4">
                    <p className="font-body text-sm text-dbb-cream line-clamp-2">
                      {post.caption}
                    </p>
                    {post.user_name && (
                      <p className="font-body text-xs text-dbb-ash mt-2">
                        by {post.user_name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer
        instagramUrl={content.instagram_url}
        tiktokUrl={content.tiktok_url}
        contactEmail={content.contact_email}
      />
    </div>
  )
}
