import config, { Canvas } from '@napi-rs/canvas';
import React from 'react';
import { expect } from 'vitest';
import { Rect } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

test('should render <Rect> with uniform borderRadius', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Rect
			x={20}
			y={20}
			width={160}
			height={110}
			borderRadius={20}
			fill='cornflowerblue'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with per-corner borderRadius', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Rect
			x={20}
			y={20}
			width={160}
			height={110}
			borderRadius={[5, 15, 25, 35]}
			fill='salmon'
			stroke='darkred'
			lineWidth={2}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with zero borderRadius (same as plain Rect)', async (render) => {
	const canvas = new Canvas(150, 100);
	await render(
		<Rect
			x={10}
			y={10}
			width={130}
			height={80}
			borderRadius={0}
			fill='limegreen'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with borderRadius and stroke only', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Rect
			x={20}
			y={20}
			width={160}
			height={110}
			borderRadius={15}
			stroke='navy'
			lineWidth={3}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
