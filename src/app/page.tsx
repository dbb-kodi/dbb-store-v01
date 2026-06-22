// src/app/page.tsx
// Homepage — pulls content from site_content table (admin-editable)

import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/shop/HeroSection'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { FeaturedProducts } from '@/components/shop/FeaturedProducts'
import { MessageSection } from '@/components/shop/MessageSection'
import { CommunitySection } from '@/components/shop/CommunitySection'
import { FinalCTA } from '@/components/shop/FinalCTA'
import { TickerTape } from '@/components/shop/TickerTape'
import { Footer } from '@/components/layout/Footer'

export const revalidate = 60 // ISR — revalidate every 60 seconds

async function getSiteContent() {
  const supabase = createClient()
  const { data } = await supabase.from('site_content').select('*')
  // Convert array to key→value map
  return Object.fromEntries((data ?? []).map(row => [row.key, row.value ?? '']))
}

async function getFeaturedProducts() {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('*, variants(*)')
    .eq('featured', true)
    .eq('active', true)
    .limit(4)
  return data ?? []
}

async function getCommunityPosts() {
  const supabase = createClient()
  const { data } = await supabase
    .from('community_posts')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return data ?? []
}

export default async function HomePage() {
  const [content, products, community] = await Promise.all([
    getSiteContent(),
    getFeaturedProducts(),
    getCommunityPosts(),
  ])

  return (
    <>
      <HeroSection
        videoUrl={content.hero_video_url}
        headline={content.hero_headline}
        subtext={content.hero_subtext}
        ctaLabel={content.hero_cta_label}
      />

      <TickerTape text="DONE BEING BROKE · BUILT DIFFERENT · NO EXCUSES · THE MINDSET IS THE MOVEMENT · " />

      <section className="max-w-7xl mx-auto px-6 py-24">
        <p className="section-label text-center">Collections</p>
        <h2 className="font-display text-display-lg text-center text-dbb-cream mb-12">
          {content.brand_statement || 'More than clothing. It\'s a mindset.'}
        </h2>
        <CategoryGrid />
      </section>

      <FeaturedProducts products={products} />

      <MessageSection quote={content.dbb_quote} />

      <CommunitySection posts={community} />

      <FinalCTA
        headline={content.cta_headline}
        subtext={content.cta_subtext}
        buttonLabel={content.cta_button_label}
      />

      <Footer
        instagramUrl={content.instagram_url}
        tiktokUrl={content.tiktok_url}
        contactEmail={content.contact_email}
      />
    </>
  )
}
