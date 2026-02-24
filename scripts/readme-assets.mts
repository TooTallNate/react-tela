/**
 * Shared utility for generating README asset images.
 *
 * Convention: fenced code blocks in README.md with metadata generate screenshots.
 *
 *     ```tsx asset="example-name" width=300 height=100
 *     // ... code that exports function App() { return <...> }
 *     ```
 *
 * The code block MUST `export function App()`.
 */
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { randomUUID } from 'crypto';

export interface AssetBlock {
	name: string;
	width: number;
	height: number;
	code: string;
}

/**
 * Parse a README.md file for asset-marked code blocks.
 */
export function parseReadmeAssets(readmePath: string): AssetBlock[] {
	const content = readFileSync(readmePath, 'utf-8');
	const blocks: AssetBlock[] = [];
	const regex = /```tsx\s+asset="([^"]+)"\s+width=(\d+)\s+height=(\d+)\s*\n([\s\S]*?)```/g;
	let match;
	while ((match = regex.exec(content)) !== null) {
		blocks.push({
			name: match[1],
			width: parseInt(match[2]),
			height: parseInt(match[3]),
			code: match[4].trimEnd(),
		});
	}
	return blocks;
}

export interface GenerateOptions {
	/** Path to the README.md file */
	readmePath: string;
	/** Directory to save generated PNGs */
	assetsDir: string;
	/**
	 * Extra code to prepend to each temp file (e.g. font registration).
	 * This is inserted AFTER the original code block.
	 */
	renderSuffix?: string;
}

const DEFAULT_RENDER_SUFFIX = `
import React from "react";
import nodeConfig, { Canvas as NativeCanvas } from "@napi-rs/canvas";
import { render as _telaRender } from "react-tela/render";

export async function __render(width, height) {
	const _App = App || exports.default;
	const canvas = new NativeCanvas(width, height);
	const root = _telaRender(React.createElement(_App), canvas, nodeConfig);
	await new Promise(r => setTimeout(r, 500));
	if (root && typeof root.render === "function") {
		root.dirty = true;
		root.render();
	}
	return canvas.toBuffer("image/png");
}
`;

/**
 * Generate all asset images from a README.md file.
 */
export async function generateReadmeAssets(opts: GenerateOptions): Promise<void> {
	const { readmePath, assetsDir, renderSuffix = DEFAULT_RENDER_SUFFIX } = opts;

	const blocks = parseReadmeAssets(readmePath);
	if (blocks.length === 0) {
		console.log('No asset blocks found in README.');
		return;
	}

	mkdirSync(assetsDir, { recursive: true });

	// Write temp files next to the README so module resolution works
	const tmpDir = dirname(readmePath);

	for (const block of blocks) {
		const tmpFile = join(tmpDir, `.readme-asset-${randomUUID()}.tsx`);
		// Append render helper so everything runs in the same module scope
		writeFileSync(tmpFile, block.code + '\n' + renderSuffix);

		try {
			const mod = await import(tmpFile);
			const buffer = await mod.__render(block.width, block.height);
			writeFileSync(join(assetsDir, `${block.name}.png`), buffer);
			console.log(`✓ ${block.name}.png (${block.width}×${block.height})`);
		} catch (err) {
			console.error(`✗ ${block.name}: ${err}`);
		} finally {
			try { unlinkSync(tmpFile); } catch {}
		}
	}
}
