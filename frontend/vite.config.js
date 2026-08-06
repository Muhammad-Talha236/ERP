import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Enables JSX support + Fast Refresh for React components
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // '@' now points to the /src folder.
      // Example: '@/components/ui/Button' resolves to 'src/components/ui/Button'
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    // Fixed port so it's predictable during team demos / testing
    port: 5173,
    open: false,
    // Yahan proxy add kar diya hai taake /api ki saari requests backend server par chalijayein
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Apne backend server ka port yahan likhein (e.g. 5000 ya jo bhi aapka backend port ho)
        changeOrigin: true,
        secure: false,
      },
    },
  },
});