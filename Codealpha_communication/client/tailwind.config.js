/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          light: '#34d399',
          DEFAULT: '#10b981', // Emerald Green
          dark: '#059669'
        },
        sage: {
          light: '#b2c0b4',
          DEFAULT: '#8aa18c', // Sage
          dark: '#6b826d'
        },
        bottle: {
          light: '#134e4a',
          DEFAULT: '#0f381c', // Deep Bottle Green
          dark: '#022c22'
        },
        cream: {
          light: '#ffffff',
          DEFAULT: '#f8f4e6', // Cream
          dark: '#e8e2cd'
        }
      }
    },
  },
  plugins: [],
}
