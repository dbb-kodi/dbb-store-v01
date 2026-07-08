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
  return (data.items as CartItem[]) ?? []
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
