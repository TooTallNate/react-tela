import './helpers/font';
import config, { Canvas } from '@napi-rs/canvas';
import React from 'react';
import { Rect, Text, useLayout } from 'react-tela';
import { expect } from 'vitest';
import initYoga from 'yoga-wasm-web/asm';
import { createFlex } from '../src/index.js';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

const yoga = initYoga();
const Flex = createFlex(yoga);

// ─── Layout correctness ───

test('flex row: equal children split width evenly', async (render) => {
	const canvas = new Canvas(300, 100);
	const layouts: Record<string, any> = {};
	function Track({ color, name }: { color: string; name: string }) {
		layouts[name] = { ...useLayout() };
		return <Rect fill={color} />;
	}

	await render(
		<Flex width={300} height={100} flexDirection='row'>
			<Flex flex={1}>
				<Track color='red' name='a' />
			</Flex>
			<Flex flex={1}>
				<Track color='green' name='b' />
			</Flex>
			<Flex flex={1}>
				<Track color='blue' name='c' />
			</Flex>
		</Flex>,
		canvas,
		config,
	);

	expect(layouts.a).toMatchObject({ x: 0, y: 0, width: 100, height: 100 });
	expect(layouts.b).toMatchObject({ x: 100, y: 0, width: 100, height: 100 });
	expect(layouts.c).toMatchObject({ x: 200, y: 0, width: 100, height: 100 });
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('flex column: children stack vertically', async (render) => {
	const canvas = new Canvas(200, 300);
	await render(
		<Flex width={200} height={300} flexDirection='column' gap={10}>
			<Flex flex={1}>
				<Rect fill='#e74c3c' />
			</Flex>
			<Flex flex={2}>
				<Rect fill='#3498db' />
			</Flex>
			<Flex flex={1}>
				<Rect fill='#2ecc71' />
			</Flex>
		</Flex>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('flex: padding and per-edge margins', async (render) => {
	const canvas = new Canvas(300, 200);
	await render(
		<Flex width={300} height={200} flexDirection='column' padding={20} gap={10}>
			<Rect fill='#ecf0f1' />
			<Flex flex={1}>
				<Rect fill='#e74c3c' />
			</Flex>
			<Flex flex={1} marginLeft={20} marginRight={20}>
				<Rect fill='#3498db' />
			</Flex>
		</Flex>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('flex: justifyContent center', async (render) => {
	const canvas = new Canvas(300, 100);
	const layouts: Record<string, any> = {};
	function Track({ color, name }: { color: string; name: string }) {
		layouts[name] = { ...useLayout() };
		return <Rect fill={color} />;
	}

	await render(
		<Flex
			width={300}
			height={100}
			flexDirection='row'
			justifyContent='center'
			gap={10}
		>
			<Flex width={50} height={50}>
				<Track color='red' name='a' />
			</Flex>
			<Flex width={50} height={50}>
				<Track color='blue' name='b' />
			</Flex>
		</Flex>,
		canvas,
		config,
	);

	// Two 50px items with 10px gap = 110px total. Centered in 300px => start at 95px
	expect(layouts.a.x).toBe(95);
	expect(layouts.b.x).toBe(155);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('flex: alignItems center', async (render) => {
	const canvas = new Canvas(300, 200);
	const layouts: Record<string, any> = {};
	function Track({ color, name }: { color: string; name: string }) {
		layouts[name] = { ...useLayout() };
		return <Rect fill={color} />;
	}

	await render(
		<Flex
			width={300}
			height={200}
			flexDirection='row'
			alignItems='center'
			justifyContent='center'
			gap={20}
		>
			<Flex width={60} height={40}>
				<Track color='#e74c3c' name='short' />
			</Flex>
			<Flex width={60} height={80}>
				<Track color='#3498db' name='tall' />
			</Flex>
			<Flex width={60} height={60}>
				<Track color='#2ecc71' name='mid' />
			</Flex>
		</Flex>,
		canvas,
		config,
	);

	// All items should be vertically centered in 200px
	expect(layouts.short.y).toBe(80); // (200-40)/2
	expect(layouts.tall.y).toBe(60); // (200-80)/2
	expect(layouts.mid.y).toBe(70); // (200-60)/2
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('flex: space-between', async (render) => {
	const canvas = new Canvas(400, 80);
	const layouts: Record<string, any> = {};
	function Track({ color, name }: { color: string; name: string }) {
		layouts[name] = { ...useLayout() };
		return <Rect fill={color} />;
	}

	await render(
		<Flex
			width={400}
			height={80}
			flexDirection='row'
			justifyContent='space-between'
			alignItems='center'
		>
			<Flex width={60} height={60}>
				<Track color='#9b59b6' name='a' />
			</Flex>
			<Flex width={60} height={60}>
				<Track color='#f39c12' name='b' />
			</Flex>
			<Flex width={60} height={60}>
				<Track color='#1abc9c' name='c' />
			</Flex>
		</Flex>,
		canvas,
		config,
	);

	// First at 0, last at 340, middle at 170
	expect(layouts.a.x).toBe(0);
	expect(layouts.c.x).toBe(340);
	expect(layouts.b.x).toBe(170);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Nested layouts ───

test('nested flex: header / sidebar+content / footer', async (render) => {
	const canvas = new Canvas(300, 300);
	const layouts: Record<string, any> = {};
	function Track({ color, name }: { color: string; name: string }) {
		layouts[name] = { ...useLayout() };
		return <Rect fill={color} />;
	}

	await render(
		<Flex width={300} height={300} flexDirection='column' gap={10}>
			<Flex height={50}>
				<Track color='#2c3e50' name='header' />
			</Flex>
			<Flex flex={1} flexDirection='row' gap={10}>
				<Flex width={80}>
					<Track color='#7f8c8d' name='sidebar' />
				</Flex>
				<Flex flex={1}>
					<Track color='#bdc3c7' name='content' />
				</Flex>
			</Flex>
			<Flex height={40}>
				<Track color='#34495e' name='footer' />
			</Flex>
		</Flex>,
		canvas,
		config,
	);

	expect(layouts.header).toMatchObject({ x: 0, y: 0, width: 300, height: 50 });
	expect(layouts.sidebar).toMatchObject({
		x: 0,
		y: 60,
		width: 80,
		height: 190,
	});
	expect(layouts.content).toMatchObject({
		x: 90,
		y: 60,
		width: 210,
		height: 190,
	});
	expect(layouts.footer).toMatchObject({
		x: 0,
		y: 260,
		width: 300,
		height: 40,
	});
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Percentage dimensions ───

test('flex: percentage widths', async (render) => {
	const canvas = new Canvas(400, 100);
	const layouts: Record<string, any> = {};
	function Track({ color, name }: { color: string; name: string }) {
		layouts[name] = { ...useLayout() };
		return <Rect fill={color} />;
	}

	await render(
		<Flex width={400} height={100} flexDirection='row'>
			<Flex width='25%'>
				<Track color='#e74c3c' name='a' />
			</Flex>
			<Flex width='50%'>
				<Track color='#3498db' name='b' />
			</Flex>
			<Flex width='25%'>
				<Track color='#2ecc71' name='c' />
			</Flex>
		</Flex>,
		canvas,
		config,
	);

	expect(layouts.a.width).toBe(100);
	expect(layouts.b.width).toBe(200);
	expect(layouts.c.width).toBe(100);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Absolute positioning ───

test('flex: absolute positioning overlay', async (render) => {
	const canvas = new Canvas(200, 200);
	await render(
		<Flex width={200} height={200}>
			<Flex flex={1}>
				<Rect fill='#3498db' />
			</Flex>
			<Flex position='absolute' bottom={10} right={10} width={50} height={50}>
				<Rect fill='#e74c3c' />
			</Flex>
		</Flex>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Flex wrap ───

test('flex: wrap creates grid-like layout', async (render) => {
	const canvas = new Canvas(200, 200);
	await render(
		<Flex width={200} height={200} flexWrap='wrap' gap={5} padding={5}>
			{['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'].map(
				(color, i) => (
					<Flex key={i} width={55} height={55}>
						<Rect fill={color} />
					</Flex>
				),
			)}
		</Flex>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Flex.Text ───

test('Flex.Text: text alongside flex items', async (render) => {
	const canvas = new Canvas(300, 100);
	await render(
		<Flex
			width={300}
			height={100}
			alignItems='center'
			justifyContent='center'
			gap={10}
		>
			<Flex width={40} height={40}>
				<Rect fill='#3498db' />
			</Flex>
			<Flex.Text fontFamily='Geist Sans' fontSize={24} fill='white'>
				Hello Flex!
			</Flex.Text>
		</Flex>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Complex real-world layout ───

test('flex: card layout with header, body, and action bar', async (render) => {
	const canvas = new Canvas(250, 350);
	await render(
		<Flex width={250} height={350} justifyContent='center' alignItems='center'>
			<Rect fill='#1a1a2e' />
			<Flex width={200} height={300} flexDirection='column'>
				<Rect fill='#16213e' />
				{/* Card header */}
				<Flex height={60} padding={10} alignItems='center'>
					<Flex width={40} height={40}>
						<Rect fill='#e94560' />
					</Flex>
				</Flex>
				{/* Card body */}
				<Flex flex={1} padding={10}>
					<Rect fill='#0f3460' />
				</Flex>
				{/* Action bar */}
				<Flex
					height={50}
					flexDirection='row'
					justifyContent='space-around'
					alignItems='center'
					padding={5}
				>
					<Flex width={40} height={30}>
						<Rect fill='#533483' />
					</Flex>
					<Flex width={40} height={30}>
						<Rect fill='#533483' />
					</Flex>
					<Flex width={40} height={30}>
						<Rect fill='#533483' />
					</Flex>
				</Flex>
			</Flex>
		</Flex>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
