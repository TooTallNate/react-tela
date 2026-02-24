/**
 * Generate README example images for @react-tela/flex.
 * Run with: npx tsx scripts/generate-readme-assets.tsx
 */
import React from 'react';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import nodeConfig, { Canvas as NativeCanvas, GlobalFonts } from '@napi-rs/canvas';
import { render } from 'react-tela/render';
import { generateReadmeAssets } from '../../../scripts/readme-assets.mts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register fonts
try {
	const fontPath = join(__dirname, '..', '..', 'react-tela', 'test', 'Geist-Regular.otf');
	GlobalFonts.registerFromPath(fontPath, 'Geist');
	GlobalFonts.registerFromPath(fontPath, 'Geist Sans');
} catch {}

generateReadmeAssets({
	readmePath: join(__dirname, '..', 'README.md'),
	assetsDir: join(__dirname, '..', 'assets'),
	async renderBlock(mod, width, height) {
		const AppComponent = mod.App || mod.default;
		if (!AppComponent) throw new Error('No App export found');
		const canvas = new NativeCanvas(width, height);
		render(React.createElement(AppComponent), canvas, nodeConfig);
		await new Promise(r => setTimeout(r, 100));
		return canvas.toBuffer('image/png');
	},
}).then(() => {
	console.log('\nDone!');
}).catch(console.error);
