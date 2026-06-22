// src/app/shop/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Shop | DBB Store',
  description: 'Browse our collection of premium clothing',
}

async function getSiteContent() {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('site_content').select('*')
    return Object.fromEntries((data ?? []).map(row => [row.key, row.value ?? '']))
  } catch {
    return {}
  }
}

async function getAllProducts() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*, variants(*)')
      .eq('active', true)
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function ShopPage() {
  const [content, products] = await Promise.all([
    getSiteContent(),
    getAllProducts(),
  ])

  return (
    <div className="min-h-screen bg-dbb-black pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="font-display text-display-lg text-dbb-cream mb-4">
          ALL PRODUCTS
        </h1>
        <p className="font-body text-dbb-ash mb-12">
          {products.length} items available
        </p>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-dbb-ash text-lg">
              No products available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group product-card">
                <div className="aspect-[3/4] overflow-hidden bg-dbb-charcoal">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-6xl text-dbb-smoke">DBB</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-body text-sm font-medium text-dbb-cream mb-1">
                    {product.name}
                  </h3>
                  <span className="font-display text-lg text-dbb-acid">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer
        instagramUrl={content.instagram_url}
        tiktokUrl={content.tiktok_url}
        contactEmail={content.contact_email}
      />
    </div>
  )
}
