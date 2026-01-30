import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Vite configuration for the React application.
 * Configures the development server, plugins (React), and testing environment (Vitest).
 * 
 * @see https://vitejs.dev/config/
 */
export default defineConfig(() => ({
  base: '', // relative paths
  server: {
    port: 3000,
  },
  plugins: [react()],
  test: {
    environment: 'happy-dom',
  },
}));
