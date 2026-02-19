import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { BezierCurve } from '../src';

const test = createStrictTest();

test('should render a <BezierCurve> with stroke', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<BezierCurve
			x0={10}
			y0={10}
			cp1x={40}
			cp1y={0}
			cp2x={60}
			cp2y={100}
			x1={90}
			y1={10}
			stroke="blue"
			lineWidth={2}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render a <BezierCurve> with fill', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<BezierCurve
			x0={10}
			y0={50}
			cp1x={30}
			cp1y={10}
			cp2x={70}
			cp2y={90}
			x1={90}
			y1={50}
			fill="rgba(255, 0, 0, 0.5)"
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render a <BezierCurve> with fill and stroke', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<BezierCurve
			x0={5}
			y0={80}
			cp1x={25}
			cp1y={5}
			cp2x={75}
			cp2y={5}
			x1={95}
			y1={80}
			fill="lightyellow"
			stroke="orange"
			lineWidth={3}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
