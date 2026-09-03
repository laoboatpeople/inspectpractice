/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        'card': '12px',
        'btn': '8px',
      },
      colors: {
        // Top-level colors — these generate .bg-card, .bg-hover, .bg-primary,
        // .text-card, .border-card, etc. (REQUIRED — the codebase uses bg-card/bg-hover everywhere)
        primary: '#0B3344',
        secondary: '#F4F7F8',
        card: '#FFFFFF',
        hover: '#F4F7F8',
        // Nested aliases (kept for compatibility — generates .bg-bg-card, .text-text-primary, etc.)
        bg: {
          primary: '#0B3344',
          secondary: '#F4F7F8',
          card: '#FFFFFF',
          hover: '#F4F7F8',
        },
        border: '#DCE4E7',
        text: {
          primary: '#102631',
          secondary: '#586A73',
          tertiary: '#7A8B94',
        },
        blue: '#145A73',
        cyan: '#10455B',
        green: '#55A630',
        amber: '#F5B942',
        red: '#D9534F',
        lime: '#CBEA32',
        purple: '#145A73',
        accent: {
          blue: '#145A73',
          cyan: '#10455B',
          green: '#55A630',
          amber: '#F5B942',
          red: '#D9534F',
          lime: '#CBEA32',
          purple: '#145A73',
        },
        // Flat aliases used by the codebase
        'bg-primary': '#0B3344',
        'bg-secondary': '#F4F7F8',
        'bg-card': '#FFFFFF',
        'bg-hover': '#F4F7F8',
        'text-primary': '#102631',
        'text-secondary': '#586A73',
        'text-tertiary': '#7A8B94',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
