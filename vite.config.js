// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/chevalclicker/'
  build: {
    assetsInlineLimit: 0 // Force la copie des fichiers bruts
  }
})
