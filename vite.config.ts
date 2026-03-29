import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // 1. Alias Configuration: Allows for clean imports like '@/components/...'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 2. Development Server & Proxy Configuration
  server: {
    port: 5173,
    proxy: {
      // Local development: Proxies /api calls to your local server on port 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // No rewrite needed if backend routes already start with /api
      },
    },
    open: true,
    hmr: true, // Enable Hot Module Replacement
  },

  // 3. Build Optimizations for Production
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Clears the dist folder before building
    sourcemap: false,   // Keeps the production build size smaller
    rollupOptions: {
      output: {
        // Splitting large libraries into separate chunks for faster page loads
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts', 'react-is'],
        },
      },
    },
  },
});