// src/app/page.tsx — Home page
import { HeroSection } from '@/components/shop/HeroSection'
import { TickerTape } from '@/components/shop/TickerTape'
import { FeaturedProducts } from '@/components/shop/FeaturedProducts'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { MessageSection } from '@/components/shop/MessageSection'
import { CommunitySection } from '@/components/shop/CommunitySection'
import { FinalCTA } from '@/components/shop/FinalCTA'
import { Footer } from '@/components/layout/Footer'
import { fetchSiteContent } from '@/lib/data/queries'

export default async function HomePage() {
  const content = await fetchSiteContent()

  return (
    <main>
      <HeroSection headline={content.hero_headline} subtext={content.hero_subtext} />
      <TickerTape text={content.ticker_text} />
      <FeaturedProducts />
      <TickerTape inverted text={content.ticker_text} />
      <CategoryGrid />
      <MessageSection quote={content.message_quote} />
      <CommunitySection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
