import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // lightningcss used by Vite does not like tachyons
    // switch off css minification for now
    cssMinify: false
  }
})
