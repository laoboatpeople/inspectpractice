import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0E1A',
        secondary: '#111827',
        card: '#1A2035',
        hover: '#243047',
        border: '#2D3A52',
        'text-primary': '#F8FAFC',
        'text-secondary': '#94A3B8',
        'text-tertiary': '#64748B',
        blue: '#C8102E',
        cyan: '#4C7FBF',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#C8102E',
        purple: '#8B5CF6',
        // Aliases for pages using accent- prefix
        'accent-blue': '#C8102E',
        'accent-cyan': '#4C7FBF',
        'accent-green': '#10B981',
        'accent-amber': '#F59E0B',
        'accent-red': '#C8102E',
        'accent-purple': '#8B5CF6',
        // Aliases for pages using bg- prefix on color names
        'bg-primary': '#0A0E1A',
        'bg-secondary': '#111827',
        'bg-card': '#1A2035',
        'bg-hover': '#243047',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
        input: '4px',
      },
    },
  },
  plugins: [],
};

export default config;
