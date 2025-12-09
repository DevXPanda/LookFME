/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './src/app/**/*.{js,jsx,ts,tsx,mdx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,   //stop conflict between Tailwind and Bootstrap
  },
  plugins: [],
}
