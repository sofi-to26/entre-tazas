/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        corporativo: '#162444',
        dorado: '#C5A880',
        arena: '#F5F5DC',
        'dorado-dark': '#8B6914',
      },
      animation: {
        'ken-burns': 'kenBurns 10s ease-out infinite alternate',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}