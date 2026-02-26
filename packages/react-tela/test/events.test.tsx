import config, { Canvas } from '@napi-rs/canvas';
import React, { useState } from 'react';
import { expect } from 'vitest';
import { Rect } from '../src';
import { dispatchEvent, enableEvents } from './helpers/event';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

test('should receive "mousedown" and "mouseup" events', async (render) => {
	const canvas = new Canvas(150, 100);
	enableEvents(canvas);
	let downEvent: any;
	let upEvent: any;

	function EventRect() {
		return (
			<Rect
				x={10}
				y={10}
				width={50}
				height={50}
				fill='blue'
				onMouseDown={(e) => {
					downEvent = e;
				}}
				onMouseUp={(e) => {
					upEvent = e;
				}}
			/>
		);
	}

	await render(<EventRect />, canvas, config);

	// Simulate mousedown
	dispatchEvent(
		canvas,
		Object.assign(new Event('mousedown'), { layerX: 30, layerY: 30 }),
	);
	expect(downEvent).toBeDefined();
	expect(downEvent.type).toBe('mousedown');

	// Simulate mouseup
	dispatchEvent(
		canvas,
		Object.assign(new Event('mouseup'), { layerX: 30, layerY: 30 }),
	);
	expect(upEvent).toBeDefined();
	expect(upEvent.type).toBe('mouseup');
});

test('should receive "mousemove" events', async (render) => {
	const canvas = new Canvas(150, 100);
	enableEvents(canvas);
	const moves: any[] = [];

	function MoveRect() {
		return (
			<Rect
				x={10}
				y={10}
				width={100}
				height={80}
				fill='green'
				onMouseMove={(e) => {
					moves.push(e);
				}}
			/>
		);
	}

	await render(<MoveRect />, canvas, config);

	// Simulate multiple moves
	for (let i = 0; i < 3; i++) {
		dispatchEvent(
			canvas,
			Object.assign(new Event('mousemove'), {
				layerX: 20 + i * 20,
				layerY: 30,
			}),
		);
	}
	expect(moves.length).toBe(3);
});

test('should receive "mouseenter" and "mouseleave" events', async (render) => {
	const canvas = new Canvas(150, 100);
	enableEvents(canvas);
	let entered = false;
	let left = false;

	function HoverRect() {
		return (
			<Rect
				x={10}
				y={10}
				width={50}
				height={50}
				fill='orange'
				onMouseEnter={() => {
					entered = true;
				}}
				onMouseLeave={() => {
					left = true;
				}}
			/>
		);
	}

	await render(<HoverRect />, canvas, config);

	// Move into the rect
	dispatchEvent(
		canvas,
		Object.assign(new Event('mousemove'), { layerX: 30, layerY: 30 }),
	);
	expect(entered).toBe(true);

	// Move outside the rect
	dispatchEvent(
		canvas,
		Object.assign(new Event('mousemove'), { layerX: 120, layerY: 90 }),
	);
	expect(left).toBe(true);
});

test('should NOT receive events when pointerEvents is false', async (render) => {
	const canvas = new Canvas(150, 100);
	enableEvents(canvas);
	let clicked = false;

	function NoEventsRect() {
		return (
			<Rect
				x={10}
				y={10}
				width={50}
				height={50}
				fill='red'
				pointerEvents={false}
				onClick={() => {
					clicked = true;
				}}
			/>
		);
	}

	await render(<NoEventsRect />, canvas, config);

	// Click on the rect — should not trigger because pointerEvents=false
	dispatchEvent(
		canvas,
		Object.assign(new Event('click'), { layerX: 30, layerY: 30 }),
	);
	expect(clicked).toBe(false);
});

test('click should target topmost entity (z-order)', async (render) => {
	const canvas = new Canvas(150, 100);
	enableEvents(canvas);
	let clickedBottom = false;
	let clickedTop = false;

	function OverlappingRects() {
		return (
			<>
				<Rect
					x={10}
					y={10}
					width={80}
					height={80}
					fill='red'
					onClick={() => {
						clickedBottom = true;
					}}
				/>
				<Rect
					x={30}
					y={30}
					width={80}
					height={60}
					fill='blue'
					onClick={() => {
						clickedTop = true;
					}}
				/>
			</>
		);
	}

	await render(<OverlappingRects />, canvas, config);

	// Click in the overlapping area — should hit the top (blue) rect
	dispatchEvent(
		canvas,
		Object.assign(new Event('click'), { layerX: 50, layerY: 50 }),
	);
	expect(clickedTop).toBe(true);
	expect(clickedBottom).toBe(false);
});

test('should update visual state via event handler', async (render) => {
	const canvas = new Canvas(150, 100);
	enableEvents(canvas);

	function ToggleRect() {
		const [size, setSize] = useState(40);
		return (
			<Rect
				x={10}
				y={10}
				width={size}
				height={size}
				fill='purple'
				onClick={() => setSize(80)}
			/>
		);
	}

	const root = render(<ToggleRect />, canvas, config);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Click to resize
	dispatchEvent(
		canvas,
		Object.assign(new Event('click'), { layerX: 30, layerY: 30 }),
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
