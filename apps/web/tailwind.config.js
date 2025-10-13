/********************
 * Tailwind config  *
 *******************/
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1e90ff',
          dark: '#1b6fd1',
          light: '#63b3ff',
        },
      },
    },
  },
  plugins: [],
};
