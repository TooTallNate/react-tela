import config, { Canvas } from '@napi-rs/canvas';
import React from 'react';
import { expect } from 'vitest';
import { QuadraticCurve } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

test('should render a <QuadraticCurve> with stroke', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<QuadraticCurve
			x0={10}
			y0={80}
			cpx={50}
			cpy={10}
			x1={90}
			y1={80}
			stroke='red'
			lineWidth={2}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render a <QuadraticCurve> with fill', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<QuadraticCurve
			x0={10}
			y0={90}
			cpx={50}
			cpy={10}
			x1={90}
			y1={90}
			fill='rgba(0, 128, 0, 0.5)'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render a <QuadraticCurve> with fill and stroke', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<QuadraticCurve
			x0={5}
			y0={95}
			cpx={50}
			cpy={5}
			x1={95}
			y1={95}
			fill='lavender'
			stroke='purple'
			lineWidth={3}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
