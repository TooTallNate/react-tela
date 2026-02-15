import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Resolve react-tela imports to parent source (no build step needed)
      'react-tela/render': resolve(__dirname, '../src/render.ts'),
      'react-tela/flex': resolve(__dirname, '../src/flex.tsx'),
      'react-tela': resolve(__dirname, '../src/index.tsx'),
    },
  },
});
