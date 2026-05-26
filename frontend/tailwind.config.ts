import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
        },
        secondary: 'var(--secondary)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
        },
        accent: 'var(--accent)',
        danger: 'var(--danger)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        title: ['Poppins', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        pill: '9999px',
      },
      animation: {
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        shimmer: 'shimmer 1.5s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'count-up': 'countUp 0.5s ease-out',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(0,229,160,0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 0 8px rgba(0,229,160,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(245, 166, 35, 0.08)',
        'card-hover': '0 8px 32px rgba(245, 166, 35, 0.15)',
        glow: '0 0 20px rgba(245, 166, 35, 0.3)',
        'glow-accent': '0 0 20px rgba(0, 229, 160, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
