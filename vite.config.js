import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tcc-prototype/',
  server: {
    port: 5173,
  },
})
