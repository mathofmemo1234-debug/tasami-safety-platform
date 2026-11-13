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
        brand: {
          gold: {
            DEFAULT: '#c59a45',
            light: '#dfb76c',
            dark: '#9a752a',
            gradient: '#dfb76c'
          },
          royal: {
            DEFAULT: '#1d4ed8',
            header: '#162d6c',
            deep: '#0f2152',
            hover: '#1e40af',
            light: '#60a5fa'
          },
          dark: {
            DEFAULT: '#0b1120',
            surface: '#131c31',
            deep: '#070b14',
            card: '#162036'
          },
          accent: {
            orange: '#f97316',
            red: '#ef4444',
            green: '#10b981',
            blue: '#1d4ed8'
          }
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(197, 154, 69, 0.25)',
        'gold-subtle': '0 4px 20px -2px rgba(197, 154, 69, 0.15)',
      }
    },
  },
  plugins: [],
}
