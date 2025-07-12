// tailwind.config.js
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
    },
  },
  plugins: [],
}
