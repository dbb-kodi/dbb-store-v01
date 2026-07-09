// src/lib/data/catalog.ts
// Static mock catalog used while the Supabase backend is not connected.
// Swap these reads for live queries later — shapes match src/types.

import type { Product, CommunityPost, Category } from '@/types'

// Inline SVG fallback — used only if no real image is assigned.
export const placeholderImage = (text: string, w = 800, h = 1000) => {
  const fontSize = Math.round(Math.min(w, h) / 8)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#111111"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" letter-spacing="2" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// Unsplash image helper — confirmed free-to-use stock photos.
const unsplash = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

// Per-product image map.
//
// Six slots are deliberately blank. Every image previously here was audited by
// downloading it and looking at the pixels, and each of these carried either a
// third party's brand mark or a subject that has nothing to do with the product:
//
//   mindset-hoodie      a red woven "UNSPLASH / VANSCHNEIDER" tag on the garment
//   no-excuses-hoodie   an embroidered "UNDERGROUND SNAX" shield
//   dbb-tee             a hooded figure in a concrete memorial installation; also a windbreaker
//   dbb-cap             a beanie printed "KASIDEEP — THE PRODUCER EDITION"
//   mindset-beanie      a macro of an adidas logo on a knit shoe upper
//   movement-tote       a CDC-branded duffel packed with biohazard bags and PPE
//
// They render as the placeholder until art-directed replacements land. Do not
// refill these by picking whatever a stock search returns — that is exactly how
// the above shipped. Look at the pixels of anything you put here.
const PRODUCT_IMAGES: Record<string, string> = {
  // built-different-tee's frame was a rooftop scene with the garment barely in
  // it — no legal exposure, but a photo that doesn't show the product reads as
  // a broken page, which is worse than an honest placeholder. Blanked too.
  'the-movement-tee':     unsplash('1722310752951-4d459d28c678'),   // cream tee on a hanger
}

// Lifestyle shots for categories and community grid.
// Only the one clean frame remains; the other three were the UNDERGROUND SNAX
// hoodie, the UNSPLASH-tagged sleeve, and a hoodie carrying a third party's graphic.
const LIFESTYLE = [
  unsplash('1546863929-b9c543a2aec7', 600, 800),  // hooded figure, no visible brand mark
]

const img = placeholderImage

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
  image_url: PRODUCT_IMAGES[p.slug] ?? img(p.name.split(' ')[0]),
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
  const sameCategory = PRODUCTS.filter((p) => p.active && p.slug !== slug && p.category === category)
  if (sameCategory.length >= 4) return sameCategory.slice(0, 4)
  // Thin category — top up from other active products rather than rendering
  // a rail with empty grid columns.
  const rest = PRODUCTS.filter((p) => p.active && p.slug !== slug && p.category !== category)
  return [...sameCategory, ...rest].slice(0, 4)
}

// Hoodies / Headwear / Accessories reused the watermarked, KASIDEEP, and CDC
// biohazard frames respectively — blanked with the rest, and Tees followed in
// 0009. The placeholder text is empty: CategoryGrid already renders the label
// over the tile, and a text-bearing placeholder underneath printed every
// category name twice.
export const CATEGORIES: Array<{ key: Category; label: string; image: string }> = [
  { key: 'hoodies',     label: 'Hoodies',     image: img('', 600, 800) },
  { key: 'tees',        label: 'Tees',        image: img('', 600, 800) },
  { key: 'headwear',    label: 'Headwear',    image: img('', 600, 800) },
  { key: 'accessories', label: 'Accessories', image: img('', 600, 800) },
]

export const COMMUNITY_POSTS: CommunityPost[] = Array.from({ length: 9 }).map((_, i) => ({
  id: `post-${i + 1}`,
  media_url: LIFESTYLE[i % LIFESTYLE.length].replace('600&h=800', '600&h=600'),
  media_type: 'image',
  caption: ['Built different.', 'No days off.', 'The mindset is the movement.', 'Stay dangerous.'][i % 4],
  user_name: ['@marcus', '@jdot', '@simone', '@theo'][i % 4],
  approved: true,
}))
