'use server'
// src/app/account/cart-actions.ts

import { getSessionProfile } from '@/lib/supabase/session'
import type { CartItem } from '@/types'

export async function getSavedCart(): Promise<CartItem[]> {
  const session = await getSessionProfile()
  if (!session || !session.user) return []

  const { data, error } = await session.supabase
    .from('carts')
    .select('items')
    .eq('user_id', session.user.id)
    .single()

  if (error || !data) return []
  const items = (data.items as CartItem[]) ?? []
  return items.map((item) => ({
    ...item,
    // Carts saved before maxQty existed have no cap on this field. Treat an
    // absent cap as "unknown, don't clamp" rather than letting it become NaN
    // the first time addItem/updateQuantity runs Math.min against it.
    maxQty: item.maxQty ?? Infinity,
    // imageUrl was snapshotted at add-time, so carts saved before the
    // infringing product images were purged still carry those URLs. Blanking
    // the products table never reached rows already written to `carts`.
    imageUrl: item.imageUrl?.startsWith('https://images.unsplash.com/') ? null : item.imageUrl,
  }))
}

export async function saveCart(items: CartItem[]): Promise<{ error?: string }> {
  const session = await getSessionProfile()
  if (!session || !session.user) return {}

  const { error } = await session.supabase
    .from('carts')
    .upsert({ user_id: session.user.id, items, updated_at: new Date().toISOString() })

  if (error) return { error: error.message }
  return {}
}
