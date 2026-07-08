// src/app/admin/layout.tsx
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getSessionProfile } from '@/lib/supabase/session'

export const metadata = { title: 'Admin — DBB' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionProfile()
  if (!session || !session.user) redirect('/auth/login')
  if (session.profile?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-dbb-black flex">
      <AdminSidebar />
      <main className="flex-1 ml-60 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
