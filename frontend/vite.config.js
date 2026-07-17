
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'

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
    // Optional: fixed port so it's predictable during team demos / testing
    port: 5173,
    open: false,
  },
});