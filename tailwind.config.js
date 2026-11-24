/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#070b12',
          900: '#0b1320',
          850: '#0e1828',
          800: '#132136',
          700: '#1b2f4c',
          600: '#254168',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          glow: '#22d3ee',
        },
        status: {
          safe: '#10b981',      // Emerald 500
          warning: '#f59e0b',   // Amber 500
          critical: '#ef4444',  // Red 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Menlo', 'monospace'],
      },
      keyframes: {
        'soft-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.008)' },
        },
        'beacon': {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.6)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
        }
      },
      animation: {
        'soft-pulse': 'soft-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'beacon': 'beacon 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
