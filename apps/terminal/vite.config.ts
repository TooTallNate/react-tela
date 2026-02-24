import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'react-tela/render': resolve(__dirname, '../../packages/react-tela/src/render.ts'),
      'react-tela/flex': resolve(__dirname, '../../packages/react-tela/src/flex.tsx'),
      'react-tela': resolve(__dirname, '../../packages/react-tela/src/index.tsx'),
      '@react-tela/core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@react-tela/terminal': resolve(__dirname, '../../packages/terminal/src/index.ts'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
