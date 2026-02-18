import React, { useState } from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect, Ellipse, Circle } from '../src';

const { test, render } = createStrictTest();

// ─── Scale ───

test('should render <Rect> with scaleX and scaleY', async () => {
	const canvas = new Canvas(200, 200);
	await render(
		<Rect
			x={50}
			y={50}
			width={40}
			height={40}
			fill='dodgerblue'
			scaleX={2}
			scaleY={1.5}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with scaleX only (horizontal stretch)', async () => {
	const canvas = new Canvas(200, 100);
	await render(
		<Rect
			x={30}
			y={20}
			width={30}
			height={30}
			fill='coral'
			scaleX={3}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Alpha ───

test('should render overlapping shapes with alpha', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<>
			<Rect x={20} y={20} width={100} height={100} fill='red' />
			<Rect x={80} y={40} width={100} height={100} fill='blue' alpha={0.4} />
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Rotation ───

test('should render <Rect> with rotation', async () => {
	const canvas = new Canvas(200, 200);
	await render(
		<Rect
			x={50}
			y={50}
			width={80}
			height={80}
			fill='forestgreen'
			rotate={45}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Combined transforms ───

test('should render <Rect> with rotation + scale + alpha', async () => {
	const canvas = new Canvas(250, 250);
	await render(
		<>
			<Rect x={50} y={50} width={80} height={80} fill='gray' />
			<Rect
				x={50}
				y={50}
				width={80}
				height={80}
				fill='crimson'
				rotate={30}
				scaleX={1.5}
				scaleY={1.5}
				alpha={0.6}
			/>
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Dynamic prop update ───

test('should re-render <Rect> when fill color changes', async () => {
	const canvas = new Canvas(150, 100);
	let setColor!: (c: string) => void;

	function DynamicRect() {
		const [color, setColorState] = useState('red');
		setColor = setColorState;
		return <Rect x={10} y={10} width={50} height={50} fill={color} />;
	}

	const root = render(<DynamicRect />, canvas, config);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Change color
	setColor('green');
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Z-ordering (later elements paint over earlier ones) ───

test('should render entities in z-order (last on top)', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<>
			<Rect x={20} y={20} width={80} height={80} fill='red' />
			<Rect x={60} y={40} width={80} height={80} fill='green' />
			<Rect x={100} y={60} width={80} height={80} fill='blue' />
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
