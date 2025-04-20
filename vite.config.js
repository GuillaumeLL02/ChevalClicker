import { defineConfig } from 'vite'

export default defineConfig({
  base: '/chevalclicker/',
  build: {
    assetsInlineLimit: 0 // Important pour les gros fichiers
  }
})