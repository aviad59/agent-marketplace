import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    // The browser only talks to this dev server; it forwards API calls to the local backend.
    proxy: { '/api': 'http://127.0.0.1:3000' },
  },
});
