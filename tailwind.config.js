/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        income: '#90ee90',
        expense: '#f08080',
        balance: '#add8e6',
      },
      animation: {
        'pulse-scale': 'pulse-scale 0.5s ease-out',
        'shine-text': 'shine 1s ease-in-out forwards',
        growImage: 'growImage 0.6s ease-out forwards',
      },
      keyframes: {
        'pulse-scale': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(9)' },
          '100%': { transform: 'scale(0,1)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200%' },
          '100%': { backgroundPosition: '200%' },
        },
        growImage: {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '70%': { transform: 'scale(20)', opacity: 1 },
          '100%': { transform: 'scale(20)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
