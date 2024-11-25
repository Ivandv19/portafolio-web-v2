import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  server: {
    proxy: {
      '/api': 'https://screenshotapi.net', // Ruta del proxy
    },
  },
});
