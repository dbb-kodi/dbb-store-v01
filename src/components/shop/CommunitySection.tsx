// src/components/shop/CommunitySection.tsx
import Link from 'next/link'
import Image from 'next/image'
import { COMMUNITY_POSTS } from '@/lib/data/catalog'

export function CommunitySection() {
  const posts = COMMUNITY_POSTS.slice(0, 6)

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="section-label">The Movement</p>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] tracking-[0.04em] text-dbb-cream">
            COMMUNITY
          </h2>
        </div>
        <Link href="/community" className="btn-outline hidden sm:inline-flex">SEE MORE</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square overflow-hidden bg-dbb-surface group">
            <Image
              src={post.media_url}
              alt={post.caption ?? 'Community post'}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
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
    </section>
  )
}
