import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  server: {
    host: true, // Exponer en red local
    port: 5173,
    strictPort: false, // Intentar otros puertos si 5173 está ocupado
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  }
});
