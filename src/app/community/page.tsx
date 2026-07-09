// src/app/community/page.tsx
import Image from 'next/image'
import { Footer } from '@/components/layout/Footer'
import { fetchCommunityPosts } from '@/lib/data/queries'

export const metadata = {
  title: 'Community — DBB',
  description: 'The DBB movement — real people, real mindset.',
}

/** Below this, a "customer photos" grid is padding, not proof. */
const MIN_GENUINE_POSTS = 3

export default async function CommunityPage() {
  // Distinct by image — fetchCommunityPosts dedupes, because the seed reused
  // the same stock photo across several rows.
  const posts = await fetchCommunityPosts()
  const enough = posts.length >= MIN_GENUINE_POSTS

  return (
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="section-label">The Movement</p>
        <h1 className="font-display text-display-md text-dbb-cream mb-4">
          COMMUNITY
        </h1>
        <p className="font-body text-base text-dbb-ash max-w-lg mb-16 leading-relaxed">
          Tag us in your fits. Share your story. The movement grows when you rep the mindset.
        </p>

        {enough ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {posts.map((post) => (
              <div key={post.id} className="group relative aspect-square overflow-hidden bg-dbb-surface">
                <Image
                  src={post.media_url}
                  alt={post.caption ?? 'Community post'}
                  fill
                  className="object-cover media-zoom"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-dbb-black/0 group-hover:bg-dbb-black/60 transition-all duration-300 flex flex-col items-end justify-end p-4 opacity-0 group-hover:opacity-100">
                  {post.user_name && (
                    <p className="font-body text-xs text-dbb-ash">{post.user_name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dbb-border bg-dbb-surface px-8 py-24 text-center">
            <p className="font-display text-4xl tracking-[0.1em] text-dbb-ash mb-4">
              NO ENTRIES YET
            </p>
            <p className="font-body text-sm text-dbb-muted max-w-md mx-auto leading-relaxed">
              The first people to wear DBB will be the ones who show it. Tag{' '}
              <span className="text-dbb-ash">@donebeingbroke</span> and your photo goes here.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="https://instagram.com/donebeingbroke"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                SEE THE FEED
              </a>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
