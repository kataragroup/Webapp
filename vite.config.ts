import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    root: 'frontend',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './frontend/src'),
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Use a fixed fallback port to avoid random WebSocket port conflicts.
      hmr:
        process.env.DISABLE_HMR === 'true'
          ? false
          : {
              protocol: 'ws',
              host: 'localhost',
              port: Number(process.env.VITE_HMR_PORT) || 24679,
            },
    },
  };
});
