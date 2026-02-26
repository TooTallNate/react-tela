import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			// Resolve react-tela imports to parent source (no build step needed)
			'react-tela/render': resolve(
				__dirname,
				'../../packages/react-tela/src/render.ts',
			),
			'@react-tela/flex': resolve(
				__dirname,
				'../../packages/flex/src/index.tsx',
			),
			'react-tela': resolve(
				__dirname,
				'../../packages/react-tela/src/index.tsx',
			),
		},
	},
	build: {
		chunkSizeWarningLimit: 1500,
		rollupOptions: {
			output: {
				manualChunks: {
					'monaco-editor': ['monaco-editor'],
				},
			},
		},
	},
});
