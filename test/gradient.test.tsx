import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect, Text, linearGradient, radialGradient } from '../src';
import { render } from '../src/render';

test('should render <Rect> with linearGradient fill', async () => {
	const canvas = new Canvas(200, 100);
	await render(
		<Rect
			width={200}
			height={100}
			fill={linearGradient(0, 0, 200, 0, [
				[0, 'red'],
				[0.5, 'yellow'],
				[1, 'blue'],
			])}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with radialGradient fill', async () => {
	const canvas = new Canvas(200, 200);
	await render(
		<Rect
			width={200}
			height={200}
			fill={radialGradient(100, 100, 10, 100, 100, 100, [
				[0, 'white'],
				[1, 'black'],
			])}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with linearGradient stroke', async () => {
	const canvas = new Canvas(200, 100);
	await render(
		<Rect
			x={10}
			y={10}
			width={180}
			height={80}
			stroke={linearGradient(0, 0, 200, 0, [
				[0, 'green'],
				[1, 'purple'],
			])}
			lineWidth={4}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Text> with linearGradient fill', async () => {
	const canvas = new Canvas(300, 60);
	await render(
		<Text
			fontSize={48}
			fill={linearGradient(0, 0, 300, 0, [
				[0, 'red'],
				[1, 'blue'],
			])}
		>
			Gradient
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('string fill still works (backward compat)', async () => {
	const canvas = new Canvas(100, 100);
	await render(
		<Rect width={100} height={100} fill="red" />,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
