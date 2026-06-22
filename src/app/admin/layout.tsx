// src/app/admin/layout.tsx
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Admin — DBB' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dbb-black flex">
      <AdminSidebar />
      <main className="flex-1 ml-60 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
