import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Ellipse } from '../src';

const test = createStrictTest();

test('should render a basic <Ellipse>', async (render) => {
	const canvas = new Canvas(150, 100);
	const root = render(
		<Ellipse x={25} y={10} radiusX={50} radiusY={40} fill='purple' />,
		canvas,
		config,
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render an <Ellipse> with fill and stroke', async (render) => {
	const canvas = new Canvas(150, 100);
	const root = render(
		<Ellipse
			x={15}
			y={5}
			radiusX={60}
			radiusY={45}
			fill='lightblue'
			stroke='darkblue'
			lineWidth={3}
		/>,
		canvas,
		config,
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
