/**
 * Generate README asset images for ALL packages in the monorepo.
 *
 * Usage: bun scripts/generate-readme-assets.tsx
 *
 * Convention: fenced code blocks in README.md with metadata generate screenshots.
 *
 *     ```tsx asset="example-name" width=300 height=100
 *     // ... code that exports function App() { return <...> }
 *     ```
 *
 * The code block MUST `export function App()`.
 */
import { join, dirname, resolve as pathResolve } from "path";
import { fileURLToPath } from "url";
import {
	readdirSync,
	readFileSync,
	writeFileSync,
	mkdirSync,
	existsSync,
	unlinkSync,
} from "fs";
import { randomUUID } from "crypto";
import { createRequire } from "module";

// Resolve @napi-rs/canvas — it lives in package-level node_modules
const require = createRequire(import.meta.url);
const { GlobalFonts } = require("@napi-rs/canvas");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = pathResolve(__dirname, "..");

// ── Register Geist fonts ──────────────────────────────────────────────
const geistFontsBase = join(rootDir, "node_modules", "geist", "dist", "fonts");

const fontFamilies: Array<{ dir: string; names: string[]; weights: string[] }> = [
	{
		dir: "geist-sans",
		names: ["Geist", "Geist Sans"],
		weights: ["Regular", "Bold", "Medium", "SemiBold", "Light", "Thin"],
	},
	{
		dir: "geist-mono",
		names: ["Geist Mono"],
		weights: ["Regular", "Bold", "Medium", "SemiBold", "Light", "Thin"],
	},
];

let fontsRegistered = 0;
for (const family of fontFamilies) {
	const dir = join(geistFontsBase, family.dir);
	const prefix = family.dir === "geist-mono" ? "GeistMono" : "Geist";
	for (const weight of family.weights) {
		const ttf = join(dir, `${prefix}-${weight}.ttf`);
		if (existsSync(ttf)) {
			for (const name of family.names) {
				GlobalFonts.registerFromPath(ttf, name);
			}
			fontsRegistered++;
		}
	}
}

console.log(
	`Registered ${fontsRegistered} Geist font weights from \`geist\` npm package`,
);

// ── Asset block parsing ───────────────────────────────────────────────
interface AssetBlock {
	name: string;
	width: number;
	height: number;
	code: string;
}

function parseReadmeAssets(readmePath: string): AssetBlock[] {
	const content = readFileSync(readmePath, "utf-8");
	const blocks: AssetBlock[] = [];
	const regex =
		/```tsx\s+asset="([^"]+)"\s+width=(\d+)\s+height=(\d+)\s*\n([\s\S]*?)```/g;
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

// ── Render suffix appended to each temp file ──────────────────────────
const RENDER_SUFFIX = `
import React from "react";
import nodeConfig, { Canvas as NativeCanvas } from "@napi-rs/canvas";
import { render as _telaRender } from "react-tela/render";

export async function __render(width: number, height: number) {
	const _App = App;
	const canvas = new NativeCanvas(width, height);
	const root = _telaRender(React.createElement(_App), canvas, nodeConfig);
	// Give effects/timers a moment to settle
	await new Promise(r => setTimeout(r, 500));
	if (root && typeof root.render === "function") {
		root.dirty = true;
		root.render();
	}
	return canvas.toBuffer("image/png");
}
`;

// ── Generate assets for one package ───────────────────────────────────
async function generatePackageAssets(
	readmePath: string,
	assetsDir: string,
): Promise<void> {
	const blocks = parseReadmeAssets(readmePath);
	if (blocks.length === 0) {
		console.log("  No asset blocks found.");
		return;
	}

	mkdirSync(assetsDir, { recursive: true });

	const tmpDir = dirname(readmePath);

	for (const block of blocks) {
		const tmpFile = join(tmpDir, `.readme-asset-${randomUUID()}.tsx`);
		writeFileSync(tmpFile, block.code + "\n" + RENDER_SUFFIX);

		try {
			const mod = await import(tmpFile);
			const buffer = await mod.__render(block.width, block.height);
			writeFileSync(join(assetsDir, `${block.name}.png`), buffer);
			console.log(`  ✓ ${block.name}.png (${block.width}×${block.height})`);
		} catch (err) {
			console.error(`  ✗ ${block.name}: ${err}`);
		} finally {
			try {
				unlinkSync(tmpFile);
			} catch {}
		}
	}
}

// ── Main ──────────────────────────────────────────────────────────────
const packagesDir = join(rootDir, "packages");
const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => join(packagesDir, d.name))
	.filter((d) => existsSync(join(d, "README.md")));

for (const pkgDir of packageDirs) {
	const readmePath = join(pkgDir, "README.md");
	const assetsDir = join(pkgDir, "assets");
	const pkgName = pkgDir.split("/").pop();

	console.log(`\n── ${pkgName} ──`);
	await generatePackageAssets(readmePath, assetsDir);
}

console.log("\nDone!");
