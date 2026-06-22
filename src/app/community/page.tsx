// src/app/community/page.tsx
import Image from 'next/image'
import { Footer } from '@/components/layout/Footer'
import { COMMUNITY_POSTS } from '@/lib/data/catalog'

export const metadata = {
  title: 'Community — DBB',
  description: 'The DBB movement — real people, real mindset.',
}

export default function CommunityPage() {
  return (
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="section-label">The Movement</p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-[0.04em] text-dbb-cream mb-4">
          COMMUNITY
        </h1>
        <p className="font-body text-base text-dbb-ash max-w-lg mb-16 leading-relaxed">
          Tag us in your fits. Share your story. The movement grows when you rep the mindset.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {COMMUNITY_POSTS.map((post) => (
            <div key={post.id} className="group relative aspect-square overflow-hidden bg-dbb-surface">
              <Image
                src={post.media_url}
                alt={post.caption ?? 'Community post'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
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
      </div>
      <Footer />
    </main>
  )
}
