/**
 * Generate README asset images for ALL packages in the monorepo.
 *
 * Single entry point: npx tsx scripts/generate-readme-assets.tsx
 */
import { join, dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, existsSync } from 'fs';
import { register } from 'node:module';
import { GlobalFonts } from '@napi-rs/canvas';
import { generateReadmeAssets } from './readme-assets.mts';

// Fix @xterm/headless CJS/ESM interop
register(new URL('./xterm-fix-loader.mjs', import.meta.url));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = pathResolve(__dirname, '..');

// Register Geist fonts from the `geist` npm package
const geistFontsDir = join(rootDir, 'node_modules', 'geist', 'dist', 'fonts', 'geist-sans');
for (const file of ['Geist-Regular', 'Geist-Bold', 'Geist-Medium', 'Geist-SemiBold', 'Geist-Light', 'Geist-Thin']) {
	const ttf = join(geistFontsDir, `${file}.ttf`);
	if (existsSync(ttf)) {
		GlobalFonts.registerFromPath(ttf, 'Geist');
		GlobalFonts.registerFromPath(ttf, 'Geist Sans');
	}
}

console.log('Registered Geist fonts from `geist` npm package\n');

// Discover all packages with README.md
const packagesDir = join(rootDir, 'packages');
const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
	.filter(d => d.isDirectory())
	.map(d => join(packagesDir, d.name))
	.filter(d => existsSync(join(d, 'README.md')));

async function main() {
	for (const pkgDir of packageDirs) {
		const readmePath = join(pkgDir, 'README.md');
		const assetsDir = join(pkgDir, 'assets');
		const pkgName = pkgDir.split('/').pop();

		console.log(`\n── ${pkgName} ──`);

		await generateReadmeAssets({
			readmePath,
			assetsDir,
		});
	}

	console.log(`\nDone!`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
