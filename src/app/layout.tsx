// src/app/layout.tsx
import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/layout/CartDrawer'
import CartSync from '@/components/CartSync'
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

// Inline SVG favicon — the ledger rule (thin over thick, debit red) under the
// DBB mark. Data URI so there's no binary asset to keep in sync with the tokens.
const FAVICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
      '<rect width="32" height="32" fill="#000000"/>' +
      '<text x="16" y="17" font-family="Impact, sans-serif" font-size="15" font-weight="bold" ' +
      'letter-spacing="0.5" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">DBB</text>' +
      '<rect x="6" y="23" width="20" height="1" fill="#C41E1E"/>' +
      '<rect x="6" y="25" width="20" height="2" fill="#C41E1E"/>' +
    '</svg>'
  )

export const metadata: Metadata = {
  title: 'DBB — Done Being Broke',
  description: 'More than clothing. It\'s a mindset. Premium streetwear for the driven.',
  icons: { icon: FAVICON },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below adds a `js` class to
    // <html> before React hydrates, so the server-rendered className and the
    // client's necessarily differ. This is the one legitimate use of the escape
    // hatch — it is scoped to this element and the divergence is intentional.
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as scripted before first paint, so the scroll
            reveal's hidden state (.js .reveal) only ever applies when there is
            JavaScript to reveal it again. Without JS the sections render
            normally rather than staying at opacity 0 forever. Runs before
            paint, so there's no flash of unhidden content either. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="bg-dbb-black text-dbb-cream min-h-screen">
        <Navbar />
        <CartDrawer />
        <CartSync />
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
