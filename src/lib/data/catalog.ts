// src/lib/data/catalog.ts
// Static mock catalog used while the Supabase backend is not connected.
// Swap these reads for live queries later — shapes match src/types.

import type { Product, CommunityPost, Category } from '@/types'

const img = (text: string, w = 800, h = 1000) =>
  `https://placehold.co/${w}x${h}/111111/ffffff?text=${encodeURIComponent(text)}`

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function makeVariants(slug: string): Product['variants'] {
  return sizes.map((size, i) => ({
    id: `${slug}-${size.toLowerCase()}`,
    size,
    color: 'Black',
    stock_qty: i === 0 ? 0 : 12 - i,
    sku: `${slug.toUpperCase()}-${size}`,
  }))
}

const base: Array<Omit<Product, 'variants' | 'image_url'>> = [
  { id: '1', name: 'Mindset Heavyweight Hoodie', slug: 'mindset-hoodie', description: 'A 450gsm heavyweight hoodie built to last. Boxy fit, dropped shoulders, embroidered DBB mark.', price: 120, category: 'hoodies', featured: true, active: true },
  { id: '2', name: 'No Excuses Hoodie', slug: 'no-excuses-hoodie', description: 'Premium fleece-lined hoodie with a bold back print. Your daily reminder.', price: 110, category: 'hoodies', featured: true, active: true },
  { id: '3', name: 'Built Different Tee', slug: 'built-different-tee', description: 'Heavyweight cotton tee with a relaxed drape. Screen-printed graphic.', price: 48, category: 'tees', featured: true, active: true },
  { id: '4', name: 'The Movement Tee', slug: 'the-movement-tee', description: 'Garment-dyed essential tee. Soft hand-feel, structured collar.', price: 45, category: 'tees', featured: true, active: true },
  { id: '5', name: 'Done Being Broke Tee', slug: 'dbb-tee', description: 'The statement piece. Oversized fit with chest and sleeve hits.', price: 50, category: 'tees', featured: false, active: true },
  { id: '6', name: 'DBB Structured Cap', slug: 'dbb-cap', description: '6-panel structured cap with raised embroidery and adjustable strap.', price: 38, category: 'headwear', featured: true, active: true },
  { id: '7', name: 'Mindset Beanie', slug: 'mindset-beanie', description: 'Ribbed cuffed beanie in heavyweight knit. One size.', price: 32, category: 'headwear', featured: false, active: true },
  { id: '8', name: 'Movement Tote', slug: 'movement-tote', description: 'Heavy canvas tote with reinforced straps. Carry the mindset.', price: 28, category: 'accessories', featured: false, active: true },
]

export const PRODUCTS: Product[] = base.map((p) => ({
  ...p,
  image_url: img(p.name.split(' ')[0]),
  variants: makeVariants(p.slug),
}))

export function getAllProducts(): Product[] {
  return PRODUCTS.filter((p) => p.active)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.active && p.featured).slice(0, 4)
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getRelatedProducts(slug: string, category: Category): Product[] {
  return PRODUCTS.filter((p) => p.active && p.slug !== slug && p.category === category).slice(0, 4)
}

export const CATEGORIES: Array<{ key: Category; label: string; image: string }> = [
  { key: 'hoodies', label: 'Hoodies', image: img('Hoodies', 600, 800) },
  { key: 'tees', label: 'Tees', image: img('Tees', 600, 800) },
  { key: 'headwear', label: 'Headwear', image: img('Headwear', 600, 800) },
  { key: 'accessories', label: 'Accessories', image: img('Accessories', 600, 800) },
]

export const COMMUNITY_POSTS: CommunityPost[] = Array.from({ length: 9 }).map((_, i) => ({
  id: `post-${i + 1}`,
  media_url: img(`DBB 0${i + 1}`, 600, 600),
  media_type: 'image',
  caption: ['Built different.', 'No days off.', 'The mindset is the movement.', 'Stay dangerous.'][i % 4],
  user_name: ['@marcus', '@jdot', '@simone', '@theo'][i % 4],
  approved: true,
}))
