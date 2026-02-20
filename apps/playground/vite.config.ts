import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Resolve react-tela imports to parent source (no build step needed)
      'react-tela/render': resolve(__dirname, '../../packages/react-tela/src/render.ts'),
      'react-tela/flex': resolve(__dirname, '../../packages/react-tela/src/flex.tsx'),
      'react-tela': resolve(__dirname, '../../packages/react-tela/src/index.tsx'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'monaco-editor': ['monaco-editor/esm/vs/editor/editor.api'],
        },
      },
    },
  },
});
