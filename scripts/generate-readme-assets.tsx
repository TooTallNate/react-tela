/**
 * Generate README example images.
 * Run with: npx tsx scripts/generate-readme-assets.tsx
 */
import React, { useRef } from 'react';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync, unlinkSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import nodeConfig, {
	Canvas as NativeCanvas,
	GlobalFonts,
} from '@napi-rs/canvas';
import { render } from '../src/render';
import {
	Rect,
	RoundRect,
	Circle,
	Arc,
	Path,
	Text,
	Group,
	Canvas,
	Pattern,
	useDimensions,
	useParent,
	useTextMetrics,
	useLinearGradient,
	useRadialGradient,
	useConicGradient,
	usePattern,
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

async function saveExample(
	name: string,
	width: number,
	height: number,
	element: React.JSX.Element,
	{ waitForAsync = false } = {},
) {
	const canvas = new NativeCanvas(width, height);
	const root = render(element, canvas, nodeConfig);
	// Wait for React reconciler to flush the initial render
	await new Promise((r) => setTimeout(r, 50));
	if (waitForAsync) {
		// Wait for async effects (e.g. usePattern image loading) to settle
		// Give time for promises to resolve and re-renders to flush
		await new Promise((r) => setTimeout(r, 500));
		// Force a final render
		root.dirty = true;
		root.render();
	}
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
	await saveExample(
		'example',
		300,
		100,
		<Group x={5} y={15} width={180} height={30} rotate={0.1}>
			<QuickStartContents />
		</Group>,
	);

	// Rect
	await saveExample(
		'example-rect',
		130,
		70,
		<Rect
			x={5}
			y={5}
			width={100}
			height={50}
			fill='red'
			stroke='black'
			lineWidth={2}
		/>,
	);

	// RoundRect
	await saveExample(
		'example-roundrect',
		130,
		70,
		<RoundRect x={5} y={5} width={100} height={50} fill='blue' radii={10} />,
	);

	// Circle
	await saveExample(
		'example-circle',
		100,
		100,
		<Circle x={10} y={10} radius={40} fill='green' />,
	);

	// Arc — radius=50, half-circle needs 100×60 plus padding
	await saveExample(
		'example-arc',
		120,
		120,
		<Arc
			x={10}
			y={10}
			radius={50}
			startAngle={0}
			endAngle={180}
			fill='orange'
		/>,
	);

	// Path (star) — 47.94×47.94 at 2x scale = ~96×96, centered at (x+w/2, y+h/2)
	// Extends ±48 from center, plus stroke. Need center at ~55 in a 115×115 canvas.
	await saveExample(
		'example-path',
		115,
		115,
		<Path
			x={31}
			y={31}
			width={47.94}
			height={47.94}
			d='M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956C22.602,0.567,25.338,0.567,26.285,2.486z'
			fill='#ED8A19'
			stroke='red'
			lineWidth={3}
			scaleX={2}
			scaleY={2}
		/>,
	);

	// Text
	await saveExample(
		'example-text',
		220,
		45,
		<Text
			x={10}
			y={10}
			fontSize={24}
			fontFamily='Geist'
			fill='#333'
			stroke='rgba(0,0,0,0.1)'
		>
			Hello world!
		</Text>,
	);

	// Canvas (imperative drawing)
	function ImperativeCanvas() {
		const root = useParent();
		return (
			<Canvas
				width={120}
				height={80}
				ref={(ref) => {
					if (!ref) return;
					const ctx = ref.getContext('2d');
					if (!ctx) return;
					// Draw a gradient rectangle
					const grad = ctx.createLinearGradient(0, 0, 120, 80);
					grad.addColorStop(0, '#3498db');
					grad.addColorStop(1, '#9b59b6');
					ctx.fillStyle = grad;
					ctx.fillRect(0, 0, 120, 80);
					// Draw a white circle
					ctx.fillStyle = 'white';
					ctx.beginPath();
					ctx.arc(60, 40, 25, 0, Math.PI * 2);
					ctx.fill();
					root.queueRender();
				}}
			/>
		);
	}
	await saveExample('example-canvas', 120, 80, <ImperativeCanvas />);

	// Group
	await saveExample(
		'example-group',
		300,
		120,
		<Group x={50} y={20} width={200} height={80} rotate={5}>
			<Rect width={200} height={80} fill='purple' alpha={0.5} />
			<Text fontSize={24} fontFamily='Geist' fill='white'>
				Inside a group
			</Text>
		</Group>,
	);

	// useTextMetrics: CenteredText — wider canvas to avoid clipping
	await saveExample(
		'example-centered-text',
		400,
		60,
		<Group x={0} y={0} width={400} height={60}>
			<Rect width={400} height={60} fill='#2c3e50' />
			<CenteredText>Centered with useTextMetrics</CenteredText>
		</Group>,
	);

	// Flex: basic row
	await saveExample(
		'example-flex-row',
		300,
		100,
		<Flex width={300} height={100} flexDirection='row' gap={10}>
			<Flex flex={1}>
				<Rect fill='#e74c3c' />
			</Flex>
			<Flex flex={1}>
				<Rect fill='#2ecc71' />
			</Flex>
			<Flex flex={1}>
				<Rect fill='#3498db' />
			</Flex>
		</Flex>,
	);

	// Flex: app layout
	await saveExample(
		'example-flex-layout',
		400,
		300,
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
		</Flex>,
	);

	// Flex.Text
	await saveExample(
		'example-flex-text',
		300,
		80,
		<Flex
			width={300}
			height={80}
			flexDirection='row'
			alignItems='center'
			justifyContent='center'
			gap={10}
		>
			<Flex width={40} height={40}>
				<Circle fill='#3498db' radius={20} />
			</Flex>
			<Flex.Text fontSize={24} fontFamily='Geist' fill='#333'>
				Hello Flex!
			</Flex.Text>
		</Flex>,
	);

	// Gradient demo
	function GradientDemo() {
		const linear = useLinearGradient(0, 0, 200, 0, [
			[0, 'red'],
			[0.5, 'yellow'],
			[1, 'blue'],
		]);
		const radial = useRadialGradient(100, 100, 10, 100, 100, 100, [
			[0, 'white'],
			[1, 'black'],
		]);
		const conic = useConicGradient(0, 100, 100, [
			[0, 'red'],
			[0.25, 'yellow'],
			[0.5, 'green'],
			[0.75, 'blue'],
			[1, 'red'],
		]);
		const textGradient = useLinearGradient(0, 0, 300, 0, [
			[0, 'red'],
			[1, 'blue'],
		]);
		return (
			<>
				<Rect width={200} height={100} fill={linear} />
				<Rect y={100} width={200} height={200} fill={radial} />
				<Rect y={300} width={200} height={200} fill={conic} />
				<Text y={500} fontSize={48} fontFamily='Geist' fill={textGradient}>
					Gradient Text
				</Text>
			</>
		);
	}
	await saveExample('example-gradient', 300, 560, <GradientDemo />);

	// Pattern: checkerboard
	function CheckerboardDemo() {
		const pattern = useRef<CanvasPattern>(null);
		return (
			<>
				<Pattern ref={pattern} width={20} height={20} repetition='repeat'>
					<Rect width={10} height={10} fill='#ccc' />
					<Rect x={10} y={10} width={10} height={10} fill='#ccc' />
				</Pattern>
				<Rect width={200} height={120} fill={pattern} />
			</>
		);
	}
	await saveExample('example-pattern', 200, 120, <CheckerboardDemo />);

	// usePattern: image-based tiling
	// First, generate a small tile image for usePattern to load
	const tileCanvas = new NativeCanvas(24, 24);
	const tileCtx = tileCanvas.getContext('2d');
	tileCtx.fillStyle = '#3498db';
	tileCtx.fillRect(0, 0, 24, 24);
	tileCtx.fillStyle = '#2ecc71';
	tileCtx.beginPath();
	tileCtx.arc(12, 12, 8, 0, Math.PI * 2);
	tileCtx.fill();
	const tilePath = join(assetsDir, '_tile.png');
	writeFileSync(tilePath, tileCanvas.toBuffer('image/png'));

	function UsePatternDemo() {
		const pattern = usePattern(tilePath, 'repeat');
		return <Rect width={200} height={120} fill={pattern} />;
	}
	await saveExample('example-usepattern', 200, 120, <UsePatternDemo />, {
		waitForAsync: true,
	});
	unlinkSync(tilePath);

	// Filter demo
	await saveExample(
		'example-filter',
		300,
		100,
		<>
			<Rect
				x={10}
				y={10}
				width={80}
				height={80}
				fill='red'
				filter='blur(3px)'
			/>
			<Rect
				x={110}
				y={10}
				width={80}
				height={80}
				fill='blue'
				filter='drop-shadow(4px 4px 4px rgba(0,0,0,0.5))'
			/>
			<Rect
				x={210}
				y={10}
				width={80}
				height={80}
				fill='green'
				filter='brightness(1.5) saturate(2)'
			/>
		</>,
	);

	console.log('\nDone! All example images generated.');
}

main().catch(console.error);
