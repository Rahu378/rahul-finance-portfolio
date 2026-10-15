import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { portraitUpload } from './vite-plugin-portrait.ts'
import { spaFallback } from './vite-plugin-spa-fallback.ts'

// GitHub Pages serves this project site from /<repo>/, so assets need that prefix.
// Dev stays at '/' so the local server and the portrait uploader are unaffected.
const BASE = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), portraitUpload(), spaFallback()],
  server: { port: 5173, open: false },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory')) return 'charts'
          if (id.includes('framer-motion') || id.includes('motion-')) return 'motion'
          if (id.includes('react-router')) return 'router'
          if (id.includes('lucide-react')) return 'icons'
          return 'vendor'
        },
      },
    },
  },
})
