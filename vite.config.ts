import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { join } from 'path'

// Plugin to copy index.html to 404.html for GitHub Pages SPA routing
const copy404Plugin = () => {
  return {
    name: 'copy-404',
    closeBundle() {
      const distPath = join(process.cwd(), 'dist')
      copyFileSync(join(distPath, 'index.html'), join(distPath, '404.html'))
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bellaprep/',
  plugins: [react(), copy404Plugin()],
  build: {
    rollupOptions: {
      output: {
        // Add timestamp to filenames for cache busting
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    },
    // Clear output directory before build
    emptyOutDir: true
  }
})