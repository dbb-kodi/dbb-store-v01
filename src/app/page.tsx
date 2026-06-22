// src/app/page.tsx — Home page
import { HeroSection } from '@/components/shop/HeroSection'
import { TickerTape } from '@/components/shop/TickerTape'
import { FeaturedProducts } from '@/components/shop/FeaturedProducts'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { MessageSection } from '@/components/shop/MessageSection'
import { CommunitySection } from '@/components/shop/CommunitySection'
import { FinalCTA } from '@/components/shop/FinalCTA'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TickerTape />
      <FeaturedProducts />
      <TickerTape inverted />
      <CategoryGrid />
      <MessageSection />
      <CommunitySection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
