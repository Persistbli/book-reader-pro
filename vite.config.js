import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: { open: true },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          epub: ['epubjs'],
          pdf: ['pdfjs-dist'],
          vendor: ['react', 'react-dom', 'zustand'],
        },
      },
    },
  },
})
