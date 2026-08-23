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
        parchment: {
          50: '#FDFBF7',
          100: '#FAF5EE',
          200: '#F4ECE0',
          300: '#ECE0D0',
          400: '#DFCDBC',
          500: '#C8B097',
        },
        ink: {
          50: '#F0F3F1',
          100: '#D9E0DC',
          200: '#B0BDB6',
          300: '#83968C',
          400: '#5C7066',
          500: '#3D4C44',
          600: '#2A3530',
          700: '#1F2824',
          800: '#161D1A',
          900: '#0F1412',
          950: '#090D0B',
        },
        forest: {
          50: '#EDF7F2',
          100: '#D6EFE3',
          200: '#B0DFC9',
          300: '#7EC8A9',
          400: '#4FAA86',
          500: '#2F8D69',
          600: '#237053',
          700: '#1C5942',
          800: '#184736',
          900: '#143B2D',
        },
        warmAmber: {
          50: '#FEF8EE',
          100: '#FCEFD8',
          200: '#F9DCB0',
          300: '#F5C27F',
          400: '#EEA24B',
          500: '#E28222',
          600: '#C46416',
          700: '#9E4A14',
          800: '#7F3C16',
          900: '#683315',
        },
        warmRed: {
          500: '#D9534F',
          600: '#C9302C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
        'book-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.18), 0 10px 15px -5px rgba(0, 0, 0, 0.1)',
        'soft-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
