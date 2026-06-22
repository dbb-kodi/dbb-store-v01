// src/app/admin/page.tsx — Admin Dashboard
import { getAllProducts } from '@/lib/data/catalog'

export default function AdminDashboard() {
  const products = getAllProducts()
  const totalValue = products.reduce((sum, p) => sum + p.price, 0)

  const stats = [
    { label: 'Products', value: products.length },
    { label: 'Categories', value: 4 },
    { label: 'Total Value', value: `$${totalValue.toFixed(0)}` },
    { label: 'Orders', value: '—' },
  ]

  return (
    <div>
      <p className="section-label">Admin</p>
      <h1 className="font-display text-5xl tracking-[0.04em] text-dbb-cream mb-12">DASHBOARD</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((s) => (
          <div key={s.label} className="border border-dbb-border p-6">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-dbb-muted mb-2">{s.label}</p>
            <p className="font-display text-4xl text-dbb-cream">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-dbb-border p-6">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-dbb-ash mb-6">Recent Products</p>
        <div className="divide-y divide-dbb-border">
          {products.slice(0, 5).map((p) => (
            <div key={p.id} className="flex justify-between py-4">
              <div>
                <p className="font-body text-sm text-dbb-cream">{p.name}</p>
                <p className="font-body text-xs text-dbb-muted capitalize">{p.category}</p>
              </div>
              <p className="font-display text-lg text-dbb-cream">${p.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
