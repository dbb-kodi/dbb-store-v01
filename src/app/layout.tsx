// src/app/layout.tsx
import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Done Being Broke — DBB',
  description: 'More than clothing. It\'s a mindset.',
  openGraph: {
    title: 'Done Being Broke — DBB',
    description: 'More than clothing. It\'s a mindset.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dbb-black text-dbb-cream">
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#2A2A2A',
              color: '#F0EDE8',
              border: '1px solid #4A4A4A',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
