// src/lib/data/queries.ts
// Server-side data reads: live Supabase queries with the static mock catalog
// as fallback, so every page renders even before the backend is configured.
// Server-only (uses next/headers via the server client) — do not import from
// client components; pass results down as props instead.

import { createClient } from '@/lib/supabase/server'
import {
  getAllProducts as mockAllProducts,
  getFeaturedProducts as mockFeaturedProducts,
  getProductBySlug as mockProductBySlug,
  getRelatedProducts as mockRelatedProducts,
  COMMUNITY_POSTS as MOCK_COMMUNITY_POSTS,
} from '@/lib/data/catalog'
import type { Category, CommunityPost, Product } from '@/types'

function normalizeProduct(row: any): Product {
  return {
    ...row,
    price: Number(row.price),
    variants: (row.variants ?? []).sort((a: any, b: any) => {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      return order.indexOf(a.size) - order.indexOf(b.size)
    }),
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const supabase = createClient()
  if (!supabase) return mockAllProducts()
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, variants(*)')
      .eq('active', true)
      .order('created_at', { ascending: true })
    if (error || !data || data.length === 0) return mockAllProducts()
    return data.map(normalizeProduct)
  } catch {
    return mockAllProducts()
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient()
  if (!supabase) return mockFeaturedProducts()
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, variants(*)')
      .eq('active', true)
      .eq('featured', true)
      .order('created_at', { ascending: true })
      .limit(4)
    if (error || !data || data.length === 0) return mockFeaturedProducts()
    return data.map(normalizeProduct)
  } catch {
    return mockFeaturedProducts()
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient()
  if (!supabase) return mockProductBySlug(slug) ?? null
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, variants(*)')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    if (error || !data) return mockProductBySlug(slug) ?? null
    return normalizeProduct(data)
  } catch {
    return mockProductBySlug(slug) ?? null
  }
}

export async function fetchRelatedProducts(slug: string, category: Category): Promise<Product[]> {
  const supabase = createClient()
  if (!supabase) return mockRelatedProducts(slug, category)
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, variants(*)')
      .eq('active', true)
      .eq('category', category)
      .neq('slug', slug)
      .limit(4)
    if (error || !data || data.length === 0) return mockRelatedProducts(slug, category)
    return data.map(normalizeProduct)
  } catch {
    return mockRelatedProducts(slug, category)
  }
}

export async function fetchCommunityPosts(limit?: number): Promise<CommunityPost[]> {
  const fallback = limit ? MOCK_COMMUNITY_POSTS.slice(0, limit) : MOCK_COMMUNITY_POSTS
  const supabase = createClient()
  if (!supabase) return fallback
  try {
    let query = supabase
      .from('community_posts')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error || !data || data.length === 0) return fallback
    return data as CommunityPost[]
  } catch {
    return fallback
  }
}

export const DEFAULT_CONTENT: Record<string, string> = {
  hero_headline: 'MORE THAN CLOTHING.',
  hero_subtext: "It's a mindset. Built for the driven, the ambitious, the relentless.",
  ticker_text:
    'DONE BEING BROKE · DBB · THE MINDSET IS THE MOVEMENT · BUILT DIFFERENT · NO EXCUSES · STAY DANGEROUS',
  story_headline: 'THE STORY',
  story_body:
    "DBB was born from a simple but radical idea: that ambition is a lifestyle, not a moment. We were tired of seeing people settle — settle for less than they're capable of, less than they deserve, less than they're built for.\n\nSo we built a brand for the ones who decided enough was enough. The ones grinding before the sun comes up. The ones who see every setback as a setup. DBB is for the movers, the builders, the ones who choose growth every single day.\n\nEvery piece we release carries that energy. Heavyweight construction. Clean lines. No noise — just purpose.",
  message_quote: "DONE BEING BROKE IS NOT ABOUT MONEY. IT'S ABOUT DECIDING YOU'LL NEVER SETTLE AGAIN.",
  instagram_url: 'https://instagram.com/donebeingbroke',
}

export async function fetchSiteContent(): Promise<Record<string, string>> {
  const supabase = createClient()
  if (!supabase) return DEFAULT_CONTENT
  try {
    const { data, error } = await supabase.from('site_content').select('key, value')
    if (error || !data || data.length === 0) return DEFAULT_CONTENT
    const live = Object.fromEntries(
      data.filter((r: any) => r.value != null && r.value !== '').map((r: any) => [r.key, r.value])
    )
    return { ...DEFAULT_CONTENT, ...live }
  } catch {
    return DEFAULT_CONTENT
  }
}

export interface AdminStats {
  productCount: number
  orderCount: number
  paidRevenue: number
  recentProducts: Product[]
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const fallbackProducts = mockAllProducts()
  const fallback: AdminStats = {
    productCount: fallbackProducts.length,
    orderCount: 0,
    paidRevenue: 0,
    recentProducts: fallbackProducts.slice(0, 5),
  }
  const supabase = createClient()
  if (!supabase) return fallback
  try {
    const [products, orders] = await Promise.all([
      supabase
        .from('products')
        .select('*, variants(*)')
        .order('created_at', { ascending: false }),
      supabase.from('orders').select('status, total'),
    ])
    if (products.error || !products.data) return fallback
    const orderRows: Array<{ status: string; total: number }> = orders.data ?? []
    return {
      productCount: products.data.length,
      orderCount: orderRows.length,
      paidRevenue: orderRows
        .filter((o) => o.status === 'paid' || o.status === 'fulfilled')
        .reduce((sum, o) => sum + Number(o.total), 0),
      recentProducts: products.data.slice(0, 5).map(normalizeProduct),
    }
  } catch {
    return fallback
  }
}
