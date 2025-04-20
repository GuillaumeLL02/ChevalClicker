import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/ChevalClicker/', // ← remplace par le nom exact de ton repo GitHub
})
