import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Explicitly point `leaflet` to the installed package directory to
      // avoid path-normalization problems on Windows paths with spaces.
      leaflet: path.resolve(__dirname, 'node_modules/leaflet'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/overpass': {
        target: 'https://overpass-api.de/api/interpreter',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/overpass/, '')
      }
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
