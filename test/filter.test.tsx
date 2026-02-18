import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect, Image } from '../src';
import { render } from '../src/render';

test('should render <Rect> with blur filter', async () => {
	const canvas = new Canvas(150, 100);
	await render(
		<Rect
			x={10}
			y={10}
			width={100}
			height={50}
			fill='red'
			filter='blur(4px)'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with drop-shadow filter', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<Rect
			x={30}
			y={30}
			width={100}
			height={60}
			fill='blue'
			filter='drop-shadow(4px 4px 4px black)'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with brightness filter', async () => {
	const canvas = new Canvas(150, 100);
	await render(
		<Rect
			x={10}
			y={10}
			width={100}
			height={50}
			fill='green'
			filter='brightness(1.5)'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with combined filters', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<Rect
			x={20}
			y={20}
			width={120}
			height={80}
			fill='purple'
			filter='blur(2px) brightness(1.2)'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
