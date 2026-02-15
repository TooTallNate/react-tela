/**
 * Generate README example images.
 * Run with: npx tsx scripts/generate-readme-assets.tsx
 */
import React from 'react';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import nodeConfig, { Canvas, GlobalFonts } from '@napi-rs/canvas';
import { render } from '../src/render';
import {
	Rect,
	RoundRect,
	Circle,
	Arc,
	Path,
	Text,
	Group,
	useDimensions,
	useTextMetrics,
} from '../src/index';
import initYoga from 'yoga-wasm-web/asm';
import { createFlex } from '../src/flex';

const yoga = initYoga();
const Flex = createFlex(yoga);

const assetsDir = join(__dirname, '..', 'assets');
mkdirSync(assetsDir, { recursive: true });

// Try to register a font for nicer text rendering
try {
	const fontPath = join(__dirname, '..', 'test', 'Geist-Regular.otf');
	GlobalFonts.registerFromPath(fontPath, 'Geist');
	GlobalFonts.registerFromPath(fontPath, 'Geist Sans');
} catch {}

async function saveExample(name: string, width: number, height: number, element: React.JSX.Element) {
	const canvas = new Canvas(width, height);
	await render(element, canvas, nodeConfig);
	const buffer = canvas.toBuffer('image/png');
	const path = join(assetsDir, `${name}.png`);
	writeFileSync(path, buffer);
	console.log(`✓ ${name}.png (${width}×${height})`);
}

// ─── Quick Start ───
function QuickStartContents() {
	const dims = useDimensions();
	return (
		<>
			<Rect width={dims.width} height={dims.height} fill='purple' alpha={0.5} />
			<Text fontSize={32} fontFamily='Geist' fill='white'>
				Hello world!
			</Text>
		</>
	);
}

// ─── useTextMetrics: CenteredText ───
function CenteredText({ children }: { children: string }) {
	const dims = useDimensions();
	const metrics = useTextMetrics(children, 'Geist', 24);
	return (
		<Text
			x={dims.width / 2 - metrics.width / 2}
			y={dims.height / 2 - 12}
			fontSize={24}
			fontFamily='Geist'
			fill='white'
		>
			{children}
		</Text>
	);
}

async function main() {
	// Quick Start (update existing example.png too)
	await saveExample('example', 300, 100, (
		<>
			<Rect width={300} height={100} fill='#1a1a2e' />
			<Group x={5} y={15} width={180} height={30} rotate={0.1}>
				<QuickStartContents />
			</Group>
		</>
	));

	// Rect
	await saveExample('example-rect', 200, 80, (
		<>
			<Rect width={200} height={80} fill='#1a1a2e' />
			<Rect x={10} y={10} width={100} height={50} fill='red' stroke='black' lineWidth={2} />
		</>
	));

	// RoundRect
	await saveExample('example-roundrect', 200, 80, (
		<>
			<Rect width={200} height={80} fill='#1a1a2e' />
			<RoundRect x={10} y={10} width={100} height={50} fill='blue' radii={10} />
		</>
	));

	// Circle
	await saveExample('example-circle', 200, 120, (
		<>
			<Rect width={200} height={120} fill='#1a1a2e' />
			<Circle x={60} y={20} radius={40} fill='green' />
		</>
	));

	// Arc
	await saveExample('example-arc', 200, 120, (
		<>
			<Rect width={200} height={120} fill='#1a1a2e' />
			<Arc x={50} y={10} radius={50} startAngle={0} endAngle={180} fill='orange' />
		</>
	));

	// Path (star)
	await saveExample('example-path', 200, 200, (
		<>
			<Rect width={200} height={200} fill='#1a1a2e' />
			<Path
				x={52}
				y={52}
				width={47.94}
				height={47.94}
				d='M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956C22.602,0.567,25.338,0.567,26.285,2.486z'
				fill='#ED8A19'
				stroke='red'
				lineWidth={3}
				scaleX={2}
				scaleY={2}
			/>
		</>
	));

	// Text
	await saveExample('example-text', 300, 60, (
		<>
			<Rect width={300} height={60} fill='#1a1a2e' />
			<Text x={10} y={10} fontSize={24} fontFamily='Geist' fill='white' stroke='rgba(255,255,255,0.3)'>
				Hello world!
			</Text>
		</>
	));

	// Group
	await saveExample('example-group', 300, 120, (
		<>
			<Rect width={300} height={120} fill='#1a1a2e' />
			<Group x={50} y={20} width={200} height={80} rotate={5}>
				<Rect width={200} height={80} fill='purple' alpha={0.5} />
				<Text fontSize={24} fontFamily='Geist' fill='white'>
					Inside a group
				</Text>
			</Group>
		</>
	));

	// useTextMetrics: CenteredText
	await saveExample('example-centered-text', 300, 80, (
		<Group x={0} y={0} width={300} height={80}>
			<Rect width={300} height={80} fill='#2c3e50' />
			<CenteredText>Centered with useTextMetrics</CenteredText>
		</Group>
	));

	// Flex: basic row
	await saveExample('example-flex-row', 300, 100, (
		<Flex width={300} height={100} flexDirection='row' gap={10}>
			<Flex flex={1}><Rect fill='#e74c3c' /></Flex>
			<Flex flex={1}><Rect fill='#2ecc71' /></Flex>
			<Flex flex={1}><Rect fill='#3498db' /></Flex>
		</Flex>
	));

	// Flex: app layout
	await saveExample('example-flex-layout', 400, 300, (
		<Flex width={400} height={300} flexDirection='column' gap={4}>
			<Flex height={40}>
				<Rect fill='#2c3e50' />
			</Flex>
			<Flex flex={1} flexDirection='row' gap={4}>
				<Flex width={100}>
					<Rect fill='#7f8c8d' />
				</Flex>
				<Flex flex={1}>
					<Rect fill='#bdc3c7' />
				</Flex>
			</Flex>
			<Flex height={30}>
				<Rect fill='#2c3e50' />
			</Flex>
		</Flex>
	));

	// Flex.Text
	await saveExample('example-flex-text', 300, 80, (
		<Flex width={300} height={80} flexDirection='row' alignItems='center' justifyContent='center' gap={10}>
			<Rect fill='#1a1a2e' />
			<Flex width={40} height={40}>
				<Circle fill='#3498db' radius={20} />
			</Flex>
			<Flex.Text fontSize={24} fontFamily='Geist' fill='white'>
				Hello Flex!
			</Flex.Text>
		</Flex>
	));

	console.log('\nDone! All example images generated.');
}

main().catch(console.error);
