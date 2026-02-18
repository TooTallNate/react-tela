import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { RoundRect } from '../src';

const { test, render } = createStrictTest();

test('should render <RoundRect> with uniform radii', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<RoundRect
			x={20}
			y={20}
			width={160}
			height={110}
			radii={20}
			fill='cornflowerblue'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <RoundRect> with per-corner radii', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<RoundRect
			x={20}
			y={20}
			width={160}
			height={110}
			radii={[5, 15, 25, 35]}
			fill='salmon'
			stroke='darkred'
			lineWidth={2}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <RoundRect> with zero radii (same as Rect)', async () => {
	const canvas = new Canvas(150, 100);
	await render(
		<RoundRect
			x={10}
			y={10}
			width={130}
			height={80}
			radii={0}
			fill='limegreen'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <RoundRect> with stroke only', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<RoundRect
			x={20}
			y={20}
			width={160}
			height={110}
			radii={15}
			stroke='navy'
			lineWidth={3}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
