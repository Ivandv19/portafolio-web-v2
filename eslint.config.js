import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config} */
export default {
  overrides: [
    {
      files: ["**/*.{js,mjs,cjs,jsx}"], // Archivos JS/JSX
      languageOptions: {
        globals: globals.browser, // Definir el entorno global
      },
      plugins: ["react"], // Usar plugin React
      extends: [
        pluginJs.configs.recommended, // Reglas recomendadas de JavaScript
        pluginReact.configs.flat.recommended, // Reglas recomendadas de React
      ],
    },
    {
      files: ["**/*.astro"], // Archivos Astro
      extends: ["plugin:astro/recommended"], // Reglas recomendadas de Astro
      parser: "astro-eslint-parser", // Usar el parser de ESLint para Astro
      plugins: ["astro"], // Incluir el plugin de Astro
    },
  ],
};
