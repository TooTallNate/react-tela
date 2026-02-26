import config, { Canvas } from '@napi-rs/canvas';
import React from 'react';
import { expect } from 'vitest';
import { Ellipse, Line, Rect } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

// ─── lineDash ───

test('should render <Rect> with dashed stroke', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Rect
			x={20}
			y={20}
			width={160}
			height={110}
			stroke='black'
			lineWidth={3}
			lineDash={[10, 5]}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with lineDashOffset', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Rect
			x={20}
			y={20}
			width={160}
			height={110}
			stroke='purple'
			lineWidth={3}
			lineDash={[15, 10]}
			lineDashOffset={7}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── lineJoin ───

test('should render <Line> with round lineJoin', async (render) => {
	const canvas = new Canvas(150, 100);
	await render(
		<Line
			points={[
				{ x: 10, y: 80 },
				{ x: 75, y: 10 },
				{ x: 140, y: 80 },
			]}
			stroke='darkblue'
			lineWidth={10}
			lineJoin='round'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Line> with bevel lineJoin', async (render) => {
	const canvas = new Canvas(150, 100);
	await render(
		<Line
			points={[
				{ x: 10, y: 80 },
				{ x: 75, y: 10 },
				{ x: 140, y: 80 },
			]}
			stroke='darkred'
			lineWidth={10}
			lineJoin='bevel'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── fillRule ───

test('should render <Rect> with fill and stroke', async (render) => {
	const canvas = new Canvas(150, 100);
	await render(
		<Rect
			x={10}
			y={10}
			width={130}
			height={80}
			fill='lightyellow'
			stroke='goldenrod'
			lineWidth={4}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── lineCap ───

test('should render <Line> with butt lineCap', async (render) => {
	const canvas = new Canvas(150, 50);
	await render(
		<Line
			points={[
				{ x: 20, y: 25 },
				{ x: 130, y: 25 },
			]}
			stroke='black'
			lineWidth={15}
			lineCap='butt'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Line> with square lineCap', async (render) => {
	const canvas = new Canvas(150, 50);
	await render(
		<Line
			points={[
				{ x: 20, y: 25 },
				{ x: 130, y: 25 },
			]}
			stroke='black'
			lineWidth={15}
			lineCap='square'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Ellipse stroke only ───

test('should render <Ellipse> with stroke only', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Ellipse
			x={20}
			y={15}
			radiusX={80}
			radiusY={55}
			stroke='teal'
			lineWidth={4}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
