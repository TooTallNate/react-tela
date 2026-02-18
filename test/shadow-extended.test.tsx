import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect, Circle, Ellipse } from '../src';

const { test, render } = createStrictTest();

test('should render shadow on <Circle>', async () => {
	const canvas = new Canvas(200, 200);
	await render(
		<Circle
			x={40}
			y={40}
			radius={50}
			fill='dodgerblue'
			shadowColor='rgba(0, 0, 0, 0.6)'
			shadowBlur={15}
			shadowOffsetX={8}
			shadowOffsetY={8}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render shadow with negative offset', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<Rect
			x={50}
			y={40}
			width={100}
			height={70}
			fill='coral'
			shadowColor='rgba(0, 0, 0, 0.4)'
			shadowBlur={8}
			shadowOffsetX={-5}
			shadowOffsetY={-5}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render shadow on <Ellipse>', async () => {
	const canvas = new Canvas(250, 180);
	await render(
		<Ellipse
			x={30}
			y={20}
			radiusX={80}
			radiusY={50}
			fill='mediumseagreen'
			shadowColor='rgba(0, 100, 0, 0.5)'
			shadowBlur={12}
			shadowOffsetX={4}
			shadowOffsetY={6}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render colored shadow', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<Rect
			x={30}
			y={20}
			width={100}
			height={70}
			fill='white'
			stroke='gray'
			lineWidth={1}
			shadowColor='rgba(255, 0, 0, 0.7)'
			shadowBlur={20}
			shadowOffsetX={0}
			shadowOffsetY={0}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
