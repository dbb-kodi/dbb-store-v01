/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dbb: {
          black:   '#0A0A0A',
          charcoal:'#2A2A2A',
          smoke:   '#4A4A4A',
          ash:     '#8A8A8A',
          cream:   '#F0EDE8',
          white:   '#FAFAFA',
          acid:    '#C8FF00',  // signature accent
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(4rem, 12vw, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 7vw, 6rem)',  { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.75rem, 4vw, 3rem)',  { lineHeight: '1', letterSpacing: '0.02em' }],
      },
      animation: {
        'slide-up':    'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':     'fadeIn 0.4s ease forwards',
        'ticker':      'ticker 20s linear infinite',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
