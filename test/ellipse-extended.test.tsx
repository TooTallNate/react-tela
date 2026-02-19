import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Ellipse } from '../src';

const test = createStrictTest();

test('should render partial <Ellipse> (half)', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Ellipse
			x={20}
			y={15}
			radiusX={80}
			radiusY={55}
			startAngle={0}
			endAngle={180}
			fill='coral'
			stroke='darkred'
			lineWidth={2}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Ellipse> with counterclockwise', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Ellipse
			x={20}
			y={15}
			radiusX={80}
			radiusY={55}
			startAngle={0}
			endAngle={90}
			counterclockwise
			fill='mediumpurple'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Ellipse> with ellipseRotation', async (render) => {
	const canvas = new Canvas(200, 200);
	await render(
		<Ellipse
			x={20}
			y={20}
			radiusX={80}
			radiusY={40}
			ellipseRotation={30}
			fill='steelblue'
			stroke='navy'
			lineWidth={2}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Ellipse> with scale', async (render) => {
	const canvas = new Canvas(200, 200);
	await render(
		<Ellipse
			x={30}
			y={30}
			radiusX={40}
			radiusY={40}
			fill='forestgreen'
			scaleX={2}
			scaleY={1}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
