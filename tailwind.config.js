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
            light: '#dcb86a',
            dark: '#9a752a',
            gradient: '#dfb76c'
          },
          dark: {
            DEFAULT: '#0f172a',
            surface: '#1e293b',
            deep: '#090d16',
            card: '#161f30'
          },
          accent: {
            orange: '#f97316',
            red: '#ef4444',
            green: '#10b981',
            blue: '#2563eb'
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
