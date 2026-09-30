import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH is set by the GitHub Pages workflow to "/<repo-name>/".
// Locally it stays "/" so `npm run dev` and `npm run preview` just work.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
  build: { outDir: 'dist', sourcemap: false },
})
