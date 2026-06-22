// src/components/shop/CommunitySection.tsx
import type { CommunityPost } from '@/types/database'

export function CommunitySection({ posts }: { posts: CommunityPost[] }) {
  return (
    <section className="bg-dbb-charcoal py-24">
      <div className="max-w-7xl mx-auto px-6">
        <p className="section-label text-center">The Movement</p>
        <h2 className="font-display text-display-lg text-center text-dbb-cream mb-4">
          COMMUNITY
        </h2>
        <p className="text-center font-body text-sm text-dbb-ash mb-12 tracking-widest">
          Real people. Real mindset.
        </p>

        {posts.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-dbb-black flex items-center justify-center"
              >
                <span className="font-display text-3xl text-dbb-smoke/30">DBB</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {posts.map((post) => (
              <div key={post.id} className="aspect-square overflow-hidden bg-dbb-black group relative">
                {post.media_type === 'video' ? (
                  <video
                    src={post.media_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={post.media_url}
                    alt={post.caption || 'DBB community'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {post.caption && (
                  <div className="absolute inset-0 bg-dbb-black/0 group-hover:bg-dbb-black/60 transition-colors duration-300 flex items-end p-4 opacity-0 group-hover:opacity-100">
                    <p className="font-body text-xs text-dbb-cream">{post.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Instagram CTA */}
        <p className="text-center mt-10 font-body text-xs text-dbb-ash tracking-widest">
          Tag us <span className="text-dbb-acid">@donebeingbroke</span> to be featured
        </p>
      </div>
    </section>
  )
}
