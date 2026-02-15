import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Ellipse } from '../src';
import { render } from '../src/render';

test('should render a basic <Ellipse>', async () => {
	const canvas = new Canvas(150, 100);
	const root = render(
		<Ellipse x={25} y={10} radiusX={50} radiusY={40} fill='purple' />,
		canvas,
		config,
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render an <Ellipse> with fill and stroke', async () => {
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
