import React, { useState } from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { LayoutContext, Rect } from '../src';
import { enableEvents, dispatchEvent } from './helpers/event';

const { test, render } = createStrictTest();

test('should render <Rect>', async () => {
	const canvas = new Canvas(150, 100);
	await render(
		<Rect x={10} y={10} width={10} height={10} fill='red' />,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with layout context', async () => {
	const canvas = new Canvas(150, 100);
	function BlueRect() {
		return <Rect fill='blue' />;
	}
	await render(
		<LayoutContext.Provider value={{ x: 10, y: 10, width: 50, height: 40 }}>
			<BlueRect />
		</LayoutContext.Provider>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should receive "click" event', async () => {
	const canvas = new Canvas(150, 100);
	enableEvents(canvas);
	let event: MouseEvent;

	function ClickRect() {
		const [color, setColor] = useState('red');
		return (
			<Rect
				x={10}
				y={10}
				width={50}
				height={50}
				fill={color}
				onClick={(e) => {
					setColor('blue');
					event = e;
				}}
			/>
		);
	}

	const root = render(<ClickRect />, canvas, config);
	expect(root.renderCount).toEqual(0);

	// Initial state, Rect is red
	await root;
	expect(root.renderCount).toEqual(1);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Simulate "click" event
	dispatchEvent(
		canvas,
		Object.assign(new Event('click'), {
			layerX: 50,
			layerY: 40,
		}),
	);

	// Rect should be blue now
	await root;
	expect(root.renderCount).toEqual(2);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Check event values
	expect(event!.layerX).toEqual(40);
	expect(event!.layerY).toEqual(30);
});
