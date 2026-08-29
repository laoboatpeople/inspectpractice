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
        'card': '8px',
        'btn': '6px',
      },
      colors: {
        // Top-level colors — these generate .bg-card, .bg-hover, .bg-primary,
        // .text-card, .border-card, etc. (REQUIRED — the codebase uses bg-card/bg-hover everywhere)
        primary: '#0A0E1A',
        secondary: '#111827',
        card: '#1A2035',
        hover: '#243047',
        // Nested aliases (kept for compatibility — generates .bg-bg-card, .text-text-primary, etc.)
        bg: {
          primary: '#0A0E1A',
          secondary: '#111827',
          card: '#1A2035',
          hover: '#243047',
        },
        border: '#2D3A52',
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          tertiary: '#64748B',
        },
        blue: '#C8102E',
        cyan: '#4C7FBF',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444',
        purple: '#8B5CF6',
        accent: {
          blue: '#C8102E',
          cyan: '#4C7FBF',
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
          purple: '#8B5CF6',
        },
        // Flat aliases used by the codebase
        'bg-primary': '#0A0E1A',
        'bg-secondary': '#111827',
        'bg-card': '#1A2035',
        'bg-hover': '#243047',
        'text-primary': '#F8FAFC',
        'text-secondary': '#94A3B8',
        'text-tertiary': '#64748B',
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
