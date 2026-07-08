'use server'
// src/app/admin/products/actions.ts

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/session'
import type { Product, Variant } from '@/types'

type VariantInput = Pick<Variant, 'size' | 'color' | 'stock_qty' | 'sku'>

function parseVariants(formData: FormData): VariantInput[] {
  const raw = formData.get('variantsJson')
  if (typeof raw !== 'string' || !raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((v: any) => ({
      size: String(v.size ?? ''),
      color: v.color ? String(v.color) : null,
      stock_qty: Number(v.stock_qty) || 0,
      sku: String(v.sku ?? ''),
    }))
  } catch {
    return []
  }
}

export async function getProducts(): Promise<Product[]> {
  const session = await requireAdmin()
  if (!session) return []
  const { data, error } = await session.supabase
    .from('products')
    .select('*, variants(*)')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  const session = await requireAdmin()
  if (!session) return null
  const { data, error } = await session.supabase
    .from('products')
    .select('*, variants(*)')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return data as Product
}

export async function createProduct(formData: FormData): Promise<{ error: string } | void> {
  const session = await requireAdmin()
  if (!session) return { error: 'Not authorized' }

  const name = String(formData.get('name') ?? '')
  const slug = String(formData.get('slug') ?? '')
  const description = String(formData.get('description') ?? '')
  const price = Number(formData.get('price')) || 0
  const category = String(formData.get('category') ?? '')
  const image_url = String(formData.get('image_url') ?? '')
  const active = formData.get('active') === 'on'
  const featured = formData.get('featured') === 'on'
  const variants = parseVariants(formData)

  const { data: product, error } = await session.supabase
    .from('products')
    .insert({ name, slug, description, price, category, image_url, active, featured })
    .select()
    .single()

  if (error || !product) return { error: error?.message ?? 'Failed to create product' }

  if (variants.length) {
    const { error: variantError } = await session.supabase
      .from('variants')
      .insert(variants.map((v) => ({ ...v, product_id: product.id })))
    if (variantError) return { error: variantError.message }
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData): Promise<{ error: string } | void> {
  const session = await requireAdmin()
  if (!session) return { error: 'Not authorized' }

  const name = String(formData.get('name') ?? '')
  const slug = String(formData.get('slug') ?? '')
  const description = String(formData.get('description') ?? '')
  const price = Number(formData.get('price')) || 0
  const category = String(formData.get('category') ?? '')
  const image_url = String(formData.get('image_url') ?? '')
  const active = formData.get('active') === 'on'
  const featured = formData.get('featured') === 'on'
  const variants = parseVariants(formData)

  const { error } = await session.supabase
    .from('products')
    .update({ name, slug, description, price, category, image_url, active, featured })
    .eq('id', id)

  if (error) return { error: error.message }

  const { error: deleteError } = await session.supabase.from('variants').delete().eq('product_id', id)
  if (deleteError) return { error: deleteError.message }

  if (variants.length) {
    const { error: variantError } = await session.supabase
      .from('variants')
      .insert(variants.map((v) => ({ ...v, product_id: id })))
    if (variantError) return { error: variantError.message }
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  const session = await requireAdmin()
  if (!session) return { error: 'Not authorized' }

  const { error } = await session.supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  return {}
}

export async function toggleProductField(
  id: string,
  field: 'featured' | 'active',
  value: boolean
): Promise<{ error?: string }> {
  const session = await requireAdmin()
  if (!session) return { error: 'Not authorized' }

  const { error } = await session.supabase.from('products').update({ [field]: value }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  return {}
}

export async function uploadProductImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const session = await requireAdmin()
  if (!session) return { error: 'Not authorized' }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'No file provided' }

  const admin = createAdminClient()
  if (!admin) return { error: 'Storage not configured' }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')
  const path = 'products/' + randomUUID() + '-' + safeName

  const { error: uploadError } = await admin.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) return { error: uploadError.message }

  const { data } = admin.storage.from('product-images').getPublicUrl(path)
  return { url: data?.publicUrl }
}
