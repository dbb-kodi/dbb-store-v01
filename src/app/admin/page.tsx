// src/app/admin/page.tsx — Admin Dashboard
import { fetchAdminStats } from '@/lib/data/queries'

export default async function AdminDashboard() {
  const { productCount, orderCount, paidRevenue, recentProducts } = await fetchAdminStats()

  const stats = [
    { label: 'Products', value: productCount },
    { label: 'Categories', value: 4 },
    { label: 'Revenue (paid)', value: `$${paidRevenue.toFixed(0)}` },
    { label: 'Orders', value: orderCount },
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
          {recentProducts.map((p) => (
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
