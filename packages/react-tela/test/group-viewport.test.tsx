import './helpers/font';
import config, { Canvas } from '@napi-rs/canvas';
import React from 'react';
import { expect } from 'vitest';
import { Group, Rect, Text } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

test('should render <Group> with contentHeight and scrollTop', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={100}
			contentHeight={300}
			scrollTop={0}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=0 shows the red rect
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should scroll content with scrollTop', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={100}
			contentHeight={300}
			scrollTop={100}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=100 shows the green rect
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should scroll content with scrollLeft', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={100}
			height={100}
			contentWidth={300}
			scrollLeft={100}
		>
			<Rect width={100} height={100} fill='red' />
			<Rect x={100} width={100} height={100} fill='green' />
			<Rect x={200} width={100} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollLeft=100 shows the green rect
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should allow overscroll past max (no clamping)', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={100}
			contentHeight={300}
			scrollTop={250}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=250 with contentHeight=300, height=100: shows bottom 50px of blue + 50px empty
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should allow negative overscroll (no clamping)', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={100}
			contentHeight={300}
			scrollTop={-50}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=-50: shows 50px empty space at top + top 50px of red
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should show partial content with scrollTop between components', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={100}
			contentHeight={300}
			scrollTop={50}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=50 shows bottom half of red and top half of green
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should show partial content with scrollLeft between components', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={100}
			height={100}
			contentWidth={300}
			scrollLeft={50}
		>
			<Rect width={100} height={100} fill='red' />
			<Rect x={100} width={100} height={100} fill='green' />
			<Rect x={200} width={100} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollLeft=50 shows right half of red and left half of green
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should show three partial components with scrollTop', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={150}
			contentHeight={300}
			scrollTop={75}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=75 with viewport height 150: shows bottom 25px of red, all 100px of green, top 25px of blue
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should show partial content with both scrollTop and scrollLeft', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={100}
			height={100}
			contentWidth={200}
			contentHeight={200}
			scrollTop={50}
			scrollLeft={50}
		>
			<Rect width={100} height={100} fill='red' />
			<Rect x={100} width={100} height={100} fill='green' />
			<Rect y={100} width={100} height={100} fill='blue' />
			<Rect x={100} y={100} width={100} height={100} fill='yellow' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=50, scrollLeft=50: shows corners of all four rects
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should work without contentWidth/contentHeight (backward compat)', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group x={10} y={10} width={180} height={80}>
			<Rect width={180} height={80} fill='purple' />
		</Group>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
