import './helpers/font';
import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect, Circle, Text, Line } from '../src';

const { test, render } = createStrictTest();

test('should render <Rect> with blur filter', async () => {
	const canvas = new Canvas(150, 100);
	await render(
		<Rect x={10} y={10} width={100} height={50} fill="red" filter="blur(4px)" />,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Circle> with drop-shadow filter', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<Circle
			x={100}
			y={75}
			radius={40}
			fill="blue"
			filter="drop-shadow(4px 4px 4px black)"
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Text> with brightness filter', async () => {
	const canvas = new Canvas(200, 60);
	await render(
		<Text x={10} y={40} fill="green" fontFamily="Geist Sans" fontSize={32} filter="brightness(1.5)">
			Hello
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Line> with combined filters', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<Line
			points={[
				{ x: 10, y: 10 },
				{ x: 180, y: 130 },
			]}
			stroke="purple"
			lineWidth={6}
			filter="blur(2px) brightness(1.2)"
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
