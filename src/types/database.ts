// src/types/database.ts
// Type definitions matching the Supabase schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'customer' | 'admin'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          compare_price: number | null
          category: 'hoodies' | 'pants' | 'tees' | 'accessories'
          image_url: string | null
          images: string[]
          featured: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      variants: {
        Row: {
          id: string
          product_id: string
          size: string
          color: string | null
          sku: string | null
          stock_qty: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['variants']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['variants']['Insert']>
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          guest_email: string | null
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          status: 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded'
          subtotal: number
          shipping_cost: number
          total: number
          shipping_address: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          variant_id: string
          product_id: string
          quantity: number
          unit_price: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      site_content: {
        Row: {
          key: string
          value: string | null
          type: 'text' | 'html' | 'image_url' | 'video_url'
          label: string | null
          updated_at: string
        }
        Insert: Database['public']['Tables']['site_content']['Row']
        Update: Partial<Database['public']['Tables']['site_content']['Row']>
      }
      community_posts: {
        Row: {
          id: string
          media_url: string
          media_type: 'image' | 'video'
          caption: string | null
          user_name: string | null
          approved: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['community_posts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>
      }
    }
  }
}

// ── Convenience types ──────────────────────────────────────
export type Profile        = Database['public']['Tables']['profiles']['Row']
export type Product        = Database['public']['Tables']['products']['Row']
export type Variant        = Database['public']['Tables']['variants']['Row']
export type Order          = Database['public']['Tables']['orders']['Row']
export type OrderItem      = Database['public']['Tables']['order_items']['Row']
export type SiteContent    = Database['public']['Tables']['site_content']['Row']
export type CommunityPost  = Database['public']['Tables']['community_posts']['Row']

// Product with its variants joined
export type ProductWithVariants = Product & { variants: Variant[] }

// Cart item (client-side only, stored in Zustand)
export interface CartItem {
  variantId: string
  productId: string
  productName: string
  productSlug: string
  imageUrl: string | null
  size: string
  color: string | null
  price: number
  quantity: number
}
