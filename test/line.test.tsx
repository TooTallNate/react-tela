import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Line } from '../src';
import { render } from '../src/render';

test('should render a horizontal <Line>', async () => {
	const canvas = new Canvas(150, 100);
	const root = render(
		<Line
			points={[
				{ x: 10, y: 50 },
				{ x: 140, y: 50 },
			]}
			stroke='black'
			lineWidth={2}
		/>,
		canvas,
		config,
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render a polyline with 3+ points', async () => {
	const canvas = new Canvas(150, 100);
	const root = render(
		<Line
			points={[
				{ x: 10, y: 10 },
				{ x: 75, y: 90 },
				{ x: 140, y: 10 },
			]}
			stroke='blue'
			lineWidth={3}
		/>,
		canvas,
		config,
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render a <Line> with stroke color and lineWidth', async () => {
	const canvas = new Canvas(150, 100);
	const root = render(
		<Line
			points={[
				{ x: 20, y: 20 },
				{ x: 130, y: 80 },
			]}
			stroke='red'
			lineWidth={5}
			lineCap='round'
		/>,
		canvas,
		config,
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
