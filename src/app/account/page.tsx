// src/app/account/page.tsx
import { redirect } from 'next/navigation'
import { getSessionProfile } from '@/lib/supabase/session'
import { signOut } from '@/app/auth/actions'
import { getOrders } from './actions'

export default async function AccountPage() {
  const session = await getSessionProfile()
  if (!session || !session.user) redirect('/auth/login')

  const orders = await getOrders()

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="section-label">Account</p>
          <h1 className="font-display text-5xl tracking-[0.04em] text-dbb-cream">ORDER HISTORY</h1>
          <p className="font-body text-xs text-dbb-muted mt-3">{session.user.email}</p>
        </div>
        <form action={signOut}>
          <button type="submit" className="btn-outline">SIGN OUT</button>
        </form>
      </div>

      {orders.length === 0 ? (
        <p className="text-dbb-muted text-sm">No orders yet.</p>
      ) : (
        <div className="border border-dbb-border divide-y divide-dbb-border">
          {orders.map((o) => (
            <div key={o.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-dbb-cream text-sm">Order #{o.id.slice(0, 8)}</p>
                <p className="text-dbb-muted text-xs">{new Date(o.created_at).toLocaleDateString()} — {o.items.length} item(s)</p>
              </div>
              <div className="text-right">
                <p className="text-dbb-cream font-display text-base tabular-nums">${o.total.toFixed(2)}</p>
                <p className="text-dbb-muted text-xs capitalize">{o.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
