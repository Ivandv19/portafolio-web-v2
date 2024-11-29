/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require("@iconify/tailwind");
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 15px rgba(255, 0, 0, 0.6)", // sombra personalizada
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
};
