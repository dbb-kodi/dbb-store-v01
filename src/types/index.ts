// src/types/index.ts
// Shared domain types — independent of any backend

export type Category = 'hoodies' | 'tees' | 'headwear' | 'accessories'

export interface Variant {
  id: string
  size: string
  color: string | null
  stock_qty: number
  sku: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: Category
  image_url: string
  featured: boolean
  active: boolean
  variants: Variant[]
}

export interface CommunityPost {
  id: string
  media_url: string
  media_type: 'image' | 'video'
  caption: string | null
  user_name: string | null
  approved: boolean
}

export interface CartItem {
  variantId: string
  productId: string
  productName: string
  slug: string
  size: string
  color: string | null
  price: number
  quantity: number
  imageUrl: string | null
}

export interface SiteContent {
  key: string
  value: string | null
  label: string
  type: string
}
