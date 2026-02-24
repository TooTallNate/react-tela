/**
 * Generate README example images for @react-tela/flex.
 * Run with: npx tsx scripts/generate-readme-assets.tsx
 */
import React from 'react';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import nodeConfig, { Canvas as NativeCanvas, GlobalFonts } from '@napi-rs/canvas';
import { render } from 'react-tela/render';
import { Rect, Text } from 'react-tela';
import initYoga from 'yoga-wasm-web/asm';
import { createFlex } from '../src/index.js';

const yoga = initYoga();
const Flex = createFlex(yoga);

const assetsDir = join(__dirname, '..', 'assets');
mkdirSync(assetsDir, { recursive: true });

// Try to register a font for nicer text rendering
try {
	const fontPath = join(__dirname, '..', '..', 'react-tela', 'test', 'Geist-Regular.otf');
	GlobalFonts.registerFromPath(fontPath, 'Geist');
	GlobalFonts.registerFromPath(fontPath, 'Geist Sans');
} catch {}

async function saveExample(name: string, width: number, height: number, element: React.JSX.Element) {
	const canvas = new NativeCanvas(width, height);
	render(element, canvas, nodeConfig);
	await new Promise(r => setTimeout(r, 100));
	const buffer = canvas.toBuffer('image/png');
	const path = join(assetsDir, `${name}.png`);
	writeFileSync(path, buffer);
	console.log(`✓ ${name}.png (${width}×${height})`);
}

// ─── Quick Start: Three colored columns ───
function QuickStart() {
	return (
		<Flex width={300} height={100} flexDirection="row" gap={10}>
			<Flex flex={1}><Rect fill="#e74c3c" /></Flex>
			<Flex flex={1}><Rect fill="#2ecc71" /></Flex>
			<Flex flex={1}><Rect fill="#3498db" /></Flex>
		</Flex>
	);
}

// ─── Nested Layout: Header/Sidebar/Content/Footer ───
function NestedLayout() {
	return (
		<Flex width={300} height={300} flexDirection="column" gap={10}>
			<Flex height={50}><Rect fill="#2c3e50" /></Flex>
			<Flex flex={1} flexDirection="row" gap={10}>
				<Flex width={80}><Rect fill="#7f8c8d" /></Flex>
				<Flex flex={1}><Rect fill="#bdc3c7" /></Flex>
			</Flex>
			<Flex height={40}><Rect fill="#34495e" /></Flex>
		</Flex>
	);
}

// ─── Flex.Text example ───
function FlexTextExample() {
	return (
		<Flex width={300} height={60} flexDirection="row" alignItems="center" gap={10}>
			<Rect fill="#1a1a2e" />
			<Flex width={60} height={60}><Rect fill="#9b59b6" /></Flex>
			<Flex flex={1} justifyContent="center">
				<Flex.Text fontFamily="Geist Sans" fontSize={24} fill="white">
					Hello Flex!
				</Flex.Text>
			</Flex>
		</Flex>
	);
}

async function main() {
	await saveExample('example-quickstart', 300, 100, <QuickStart />);
	await saveExample('example-nested', 300, 300, <NestedLayout />);
	await saveExample('example-text', 300, 60, <FlexTextExample />);
	console.log('\nDone!');
}

main().catch(console.error);
