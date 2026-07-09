/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dbb: {
          black: '#000000',
          surface: '#111111',
          elevated: '#1A1A1A',
          border: '#2A2A2A',
          muted: '#666666',
          ash: '#999999',
          cream: '#FFFFFF',
          // The only color logic in the system: debit (red) marks a before-state
          // — struck-through prices, low-stock, the ticker's static mark. Credit
          // (green) marks an after-state — new drops, success, in-stock.
          ledger: '#C41E1E',
          credit: '#2E7D4F',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // clamp(2.5rem,6vw,5rem) was copy-pasted verbatim into 6 different files
        // instead of being a token; this is that token.
        'display-md': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1', letterSpacing: '0.04em' }],
        'display-lg': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '0.02em' }],
        'display-xl': ['clamp(4rem, 14vw, 13rem)', { lineHeight: '0.9', letterSpacing: '0.01em' }],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 24s linear infinite',
      },
    },
  },
  plugins: [],
}
