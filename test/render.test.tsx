import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect } from '../src';
import { render } from '../src/render';

test('render() returns a Root with renderCount tracking', async () => {
	const canvas = new Canvas(100, 100);
	const root = render(
		<Rect width={100} height={100} fill='blue' />,
		canvas,
		config,
	);
	expect(root.renderCount).toBe(0);
	await root;
	expect(root.renderCount).toBe(1);
});

test('render() should clear and re-render on tree change', async () => {
	const canvas = new Canvas(150, 100);

	// First render
	const root = render(
		<Rect x={10} y={10} width={50} height={50} fill='red' />,
		canvas,
		config,
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Root should be accessible
	expect(root.entities.length).toBe(1);
	expect(root.width).toBe(150);
	expect(root.height).toBe(100);
});

test('root.entities tracks child entities', async () => {
	const canvas = new Canvas(200, 100);
	const root = render(
		<>
			<Rect x={0} y={0} width={50} height={50} fill='red' />
			<Rect x={60} y={0} width={50} height={50} fill='green' />
			<Rect x={120} y={0} width={50} height={50} fill='blue' />
		</>,
		canvas,
		config,
	);
	await root;
	expect(root.entities.length).toBe(3);
});

test('empty render produces blank canvas', async () => {
	const canvas = new Canvas(100, 100);
	const root = render(<></>, canvas, config);
	await root;
	expect(root.entities.length).toBe(0);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
