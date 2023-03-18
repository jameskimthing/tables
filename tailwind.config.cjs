/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        background: "#f1faee",
        dark: "#003049",
        light: "#fcbf49",
        middle: "#fcbf49",
        strong: "#fcbf49",
      }
    },
  },
  plugins: [],
}
