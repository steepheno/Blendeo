import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path'; // Node.js path 모듈을 import

export default defineConfig({
  plugins: [
    react(),
  nodePolyfills({
    include: ['process']
  })
],
  define: {
    global: 'window', // 브라우저 환경에서 global을 window로 매핑
  },
  resolve: {
    alias: {
      util: path.resolve(__dirname, 'node_modules/util'),
      events: path.resolve(__dirname, 'node_modules/events'),
    },
  },
});
