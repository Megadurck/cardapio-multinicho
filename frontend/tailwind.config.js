/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Bricolage Grotesque', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#eaf4f8',
          100: '#cfe5ed',
          200: '#a8cfdb',
          300: '#76b2c2',
          500: '#176b83',
          700: '#0d4c62',
          900: '#062b3a'
        },
        mint: {
          500: '#087f73'
        }
      },
      boxShadow: {
        soft: '0 14px 30px rgba(6, 43, 58, 0.14)'
      }
    }
  },
  plugins: []
};
