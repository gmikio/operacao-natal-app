import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
    port: 5173, // Vite's default port
    },
    build: {
    outDir: 'dist',
    },
    css: {
    postcss: './postcss.config.js', // Point to your PostCSS config
  },
});
