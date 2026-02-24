/**
 * Generate README example images for @react-tela/terminal.
 * Run with: npx tsx scripts/generate-readme-assets.tsx
 *
 * This script uses a custom loader to fix @xterm/headless CJS/ESM interop,
 * then delegates to the shared readme-assets utility.
 */
import React, { useEffect, useRef } from 'react';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync } from 'fs';
import nodeConfig, { Canvas as NativeCanvas, GlobalFonts } from '@napi-rs/canvas';
import { render } from 'react-tela/render';
// Work around @xterm/headless CJS interop
import XTermDefault from '@xterm/headless';
const { Terminal: XTerminal } = XTermDefault;

// Monkey-patch the module cache so that when terminal.ts does
// `import { Terminal } from '@xterm/headless'`, it gets the right thing
// This is handled by tsx for .ts source files, so we import from source directly.

import { parseReadmeAssets } from '../../../scripts/readme-assets.mts';
import { Terminal, TerminalEntity } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetsDir = join(__dirname, '..', 'assets');
const readmePath = join(__dirname, '..', 'README.md');

mkdirSync(assetsDir, { recursive: true });

// Register fonts
try {
	const fontPath = join(__dirname, '..', '..', 'react-tela', 'test', 'Geist-Regular.otf');
	GlobalFonts.registerFromPath(fontPath, 'Geist');
	GlobalFonts.registerFromPath(fontPath, 'Geist Sans');
} catch {}

async function saveExample(name: string, width: number, height: number, element: React.JSX.Element) {
	const canvas = new NativeCanvas(width, height);
	render(element, canvas, nodeConfig);
	// Wait for useEffect writes to flush
	await new Promise(r => setTimeout(r, 500));
	const buffer = canvas.toBuffer('image/png');
	const path = join(assetsDir, `${name}.png`);
	writeFileSync(path, buffer);
	console.log(`✓ ${name}.png (${width}×${height})`);
}

// The README code blocks define App components. We replicate them here
// but the source of truth is verified by parseReadmeAssets - if the README
// blocks change, this script needs updating too.
// TODO: Once ESM/CJS interop is resolved for @xterm/headless, switch to
// full dynamic import via generateReadmeAssets().

const blocks = parseReadmeAssets(readmePath);

// ─── example-usage ───
function UsageApp() {
	const ref = useRef<TerminalEntity>(null);

	useEffect(() => {
		const term = ref.current;
		if (!term) return;
		term.write("Hello, terminal! 🖥️\r\n");
		term.write("\x1b[32mGreen text\x1b[0m ");
		term.write("\x1b[31mRed text\x1b[0m ");
		term.write("\x1b[34mBlue text\x1b[0m\r\n");
		term.write("\x1b[1mBold\x1b[0m \x1b[4mUnderline\x1b[0m \x1b[7mInverse\x1b[0m\r\n");
	}, []);

	return (
		<Terminal
			ref={ref}
			cols={40}
			rows={5}
			fontSize={16}
			fontFamily="monospace"
			theme={{ background: "#1e1e1e", foreground: "#d4d4d4" }}
		/>
	);
}

// ─── example-colors ───
function ColorsApp() {
	const ref = useRef<TerminalEntity>(null);

	useEffect(() => {
		const term = ref.current;
		if (!term) return;
		term.write("\x1b[1m Standard Colors \x1b[0m\r\n");
		for (let i = 0; i < 8; i++) {
			term.write(`\x1b[48;5;${i}m  \x1b[0m`);
		}
		term.write("\r\n");
		for (let i = 8; i < 16; i++) {
			term.write(`\x1b[48;5;${i}m  \x1b[0m`);
		}
		term.write("\r\n\r\n\x1b[1m 216 Colors \x1b[0m\r\n");
		for (let i = 16; i < 232; i++) {
			term.write(`\x1b[48;5;${i}m  \x1b[0m`);
			if ((i - 15) % 36 === 0) term.write("\r\n");
		}
		term.write("\r\n\x1b[1m Grayscale \x1b[0m\r\n");
		for (let i = 232; i < 256; i++) {
			term.write(`\x1b[48;5;${i}m  \x1b[0m`);
		}
		term.write("\r\n");
	}, []);

	return (
		<Terminal
			ref={ref}
			cols={72}
			rows={16}
			fontSize={14}
			fontFamily="monospace"
			theme={{ background: "#1a1a2e", foreground: "#eee" }}
		/>
	);
}

async function main() {
	for (const block of blocks) {
		switch (block.name) {
			case 'example-usage':
				await saveExample(block.name, block.width, block.height, <UsageApp />);
				break;
			case 'example-colors':
				await saveExample(block.name, block.width, block.height, <ColorsApp />);
				break;
			default:
				console.error(`✗ Unknown asset: ${block.name}`);
		}
	}
	console.log('\nDone!');
}

main().catch(console.error);
