// vite.config.js — build configuration for the FrontEdge PWA
import { defineConfig } from 'vite';          // defineConfig gives editor autocomplete for Vite options
import react from '@vitejs/plugin-react';     // enables JSX + React Fast Refresh

export default defineConfig({
  plugins: [react()],                         // register the React plugin
  build: {
    outDir: 'dist',                           // Vercel serves this folder
    chunkSizeWarningLimit: 2500               // mermaid is large; it is lazy-loaded so silence the warning
  }
});
