/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#005bbf',
        'trust-blue': '#1A73E8',
        'deep-navy': '#0D47A1',
        'amber-gold': '#FFC107',
        'surface': '#f9f9f9',
        'border-light': '#E0E0E0',
        'surface-container-low': '#f3f3f3',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#1a1c1c',
        'on-surface-variant': '#414754',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        'container-max': '1280px',
      }
    },
  },
  plugins: [],
}