'use server'
// src/app/account/actions.ts

import { getSessionProfile } from '@/lib/supabase/session'

export interface OrderSummary {
  id: string
  status: string
  total: number
  created_at: string
  items: Array<{ quantity: number; unit_price: number; product_id: string | null; variant_id: string | null }>
}

export async function getOrders(): Promise<OrderSummary[]> {
  const session = await getSessionProfile()
  if (!session || !session.user) return []

  const { data, error } = await session.supabase
    .from('orders')
    .select('id, status, total, created_at, order_items(quantity, unit_price, product_id, variant_id)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map((o: any) => ({
    id: o.id,
    status: o.status,
    total: o.total,
    created_at: o.created_at,
    items: o.order_items ?? [],
  }))
}
