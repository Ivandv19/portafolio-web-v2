/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require("@iconify/tailwind");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        'border-color': '#FF0000',
      },
      boxShadow: {
        custom: '0px -3px 15px 1px #FF0000',
      },
      fontFamily: {
        // Define tu fuente aquí
        sans: ['"Montserrat"','"Roboto"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        serif: ['"Merriweather"', 'serif'],
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
};