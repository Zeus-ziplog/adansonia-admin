import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ── Clean @ alias for src/ ──
  // Now you can do: import MyComponent from '@/components/MyComponent'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ── Proxy for local backend (your /api calls go to port 5000) ──
  server: {
    proxy: {
      // Proxy all /api requests → http://localhost:5000/api/...
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Keep /api prefix (most APIs expect it)
        // If your backend doesn't want /api prefix, change to:
        // rewrite: (path) => path.replace(/^\/api/, ''),
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        secure: false, // if using https locally and self-signed certs
      },

      // Bonus: if you ever need to proxy Supabase or another service
      // '/supabase': {
      //   target: 'https://your-project.supabase.co',
      //   changeOrigin: true,
      //   secure: false,
      // },
    },

    // Nice-to-have: open browser automatically + show errors overlay
    open: true,
    hmr: true, // hot module replacement (already default but explicit)
  },

  // ── Build optimizations (optional but good for production) ──
  build: {
    outDir: 'dist',
    sourcemap: true, // helpful for debugging prod issues
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },

  // ── If you ever use env vars with VITE_ prefix ──
  // They are auto-injected, no extra config needed
});