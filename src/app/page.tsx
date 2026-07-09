// src/app/page.tsx — Home page
import { HeroSection } from '@/components/shop/HeroSection'
import { TickerTape } from '@/components/shop/TickerTape'
import { FeaturedProducts } from '@/components/shop/FeaturedProducts'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { MessageSection } from '@/components/shop/MessageSection'
import { CommunitySection } from '@/components/shop/CommunitySection'
import { FinalCTA } from '@/components/shop/FinalCTA'
import { Footer } from '@/components/layout/Footer'
import { Reveal } from '@/components/Reveal'
import { fetchSiteContent } from '@/lib/data/queries'

export default async function HomePage() {
  const content = await fetchSiteContent()

  return (
    <main>
      {/* Hero is above the fold — animating what's already on screen at load
          is decoration, not communication. The tickers are constant motion
          already. Neither is wrapped. */}
      <HeroSection headline={content.hero_headline} subtext={content.hero_subtext} />
      <TickerTape text={content.ticker_text} />
      <Reveal>
        <FeaturedProducts />
      </Reveal>
      <TickerTape inverted text={content.ticker_text} />
      <Reveal>
        <CategoryGrid />
      </Reveal>
      <Reveal>
        <MessageSection quote={content.message_quote} />
      </Reveal>
      <Reveal>
        <CommunitySection />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
      <Footer />
    </main>
  )
}
