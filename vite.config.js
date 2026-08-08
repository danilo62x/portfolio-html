import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

// Auto-discover all .html files in the project root
const root = process.cwd()
const htmlFiles = readdirSync(root).filter((f) => f.endsWith('.html'))
const input = Object.fromEntries(
  htmlFiles.map((f) => [f.replace(/\.html$/, ''), resolve(root, f)])
)

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5231,
    open: '/index.html',
  },
  build: {
    rollupOptions: { input },
    outDir: 'dist',
  },
})
