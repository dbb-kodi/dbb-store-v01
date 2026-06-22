// src/app/layout.tsx
import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/layout/CartDrawer'
import '@/styles/globals.css'

const display = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'DBB — Done Being Broke',
  description: 'More than clothing. It\'s a mindset. Premium streetwear for the driven.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-dbb-black text-dbb-cream min-h-screen">
        <Navbar />
        <CartDrawer />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#FFFFFF',
              border: '1px solid #2A2A2A',
              borderRadius: 0,
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
