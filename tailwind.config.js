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
          // #666666 measured 3.66:1 on black and 3.29:1 on surface — below the
          // 4.5:1 floor for normal text, and this is the body-copy colour across
          // the whole site. #858585 gives 5.69 / 5.12 / 4.72 on black / surface /
          // elevated. Still reads as muted; now legible.
          muted: '#858585',
          ash: '#999999',
          cream: '#FFFFFF',
          // The only color logic in the system: debit (red) marks a before-state
          // — struck-through prices, low-stock, the ticker's static mark. Credit
          // (green) marks an after-state — new drops, success, in-stock.
          // These two are for rules, borders and fills, where contrast minimums
          // don't apply to text.
          ledger: '#C41E1E',
          credit: '#2E7D4F',
          // ledger red is only 3.55:1 on black — fine for a 2px rule, illegible
          // as small text. This is the same red raised to 5.37:1 for anything
          // that has to be *read* ("Only 3 left", checkout errors).
          'ledger-text': '#E5484D',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      // A semantic stack, so the drawer and the modal can't both sit at 50 and
      // fight. Toast is fixed at 9999 by react-hot-toast; nothing may exceed it.
      zIndex: {
        nav: '30',
        'drawer-backdrop': '40',
        drawer: '50',
        'modal-backdrop': '60',
        modal: '70',
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
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        // Never scale(0) — start from a shape that already exists.
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        marquee: 'marquee 24s linear infinite',
      },
    },
  },
  plugins: [],
}
