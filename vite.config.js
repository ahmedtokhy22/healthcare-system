import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://healthcare52.runasp.net',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})