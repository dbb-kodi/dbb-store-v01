// src/components/shop/CommunitySection.tsx
import Link from 'next/link'
import Image from 'next/image'
import { fetchCommunityPosts } from '@/lib/data/queries'

/** Below this, a "customer photos" grid is padding, not proof. */
const MIN_GENUINE_POSTS = 3

export async function CommunitySection() {
  // Already distinct by image — fetchCommunityPosts dedupes. What arrives here
  // is the real count of genuine posts, which may be too thin to show at all.
  const genuine = await fetchCommunityPosts(6)
  const enough = genuine.length >= MIN_GENUINE_POSTS

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[0.04em] text-dbb-cream">
            COMMUNITY
          </h2>
        </div>
        {enough && (
          <Link href="/community" className="btn-outline hidden sm:inline-flex">SEE MORE</Link>
        )}
      </div>

      {enough ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {genuine.map((post) => (
            <div key={post.id} className="relative aspect-square overflow-hidden bg-dbb-surface group">
              <Image
                src={post.media_url}
                alt={post.caption ?? 'Community post'}
                fill
                className="object-cover media-zoom"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-dbb-black/0 group-hover:bg-dbb-black/60 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-4">
                <p className="font-body text-sm text-dbb-cream text-center">{post.caption}</p>
                {post.user_name && (
                  <p className="font-body text-xs text-dbb-ash mt-2">{post.user_name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* An empty screen is an invitation to act, not an apology. Framed as an
           open account: nothing entered yet, and the reader is who enters it. */
        <div className="border border-dbb-border bg-dbb-surface px-8 py-16 text-center">
          {/* dbb-ash, not dbb-border. This is the headline of a section with
              nothing else in it; border-grey on surface measures 1.3:1. */}
          <p className="font-display text-3xl tracking-[0.1em] text-dbb-ash mb-4">
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
    </section>
  )
}
