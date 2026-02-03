/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'beauty-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'beauty-shimmer': 'beauty-shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      backdropBlur: {
        'beauty': '24px',
      },
      boxShadow: {
        'beauty': '0 8px 32px rgba(204, 43, 82, 0.08)',
        'beauty-lg': '0 20px 60px rgba(0, 0, 0, 0.4)',
        'beauty-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        // roboto: ['Roboto'],
        syncopate: ['Syncopate'],
        inter: ['Inter'],
        sans : ['DM Sans']
      },
      colors: {
        beauty: {
          primary: '#CC2B52',
          'primary-light': '#E83A6A',
          'primary-dark': '#A82245',
          background: '#0A0A0F',
          surface: '#1A1A24',
          'surface-light': '#252530',
          'text-primary': '#F8F7F5',
          'text-secondary': '#B8B6B2',
          'text-tertiary': '#8A8884',
          gold: '#D4AF8C',
          border: '#2A2A35',
        }
      }
    },
  },
  plugins: [],
}

