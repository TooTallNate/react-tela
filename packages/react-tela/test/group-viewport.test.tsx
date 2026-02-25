import './helpers/font';
import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Group, Rect, Text } from '../src';

const test = createStrictTest();

test('should render <Group> with contentHeight and scrollTop', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group x={0} y={0} width={200} height={100} contentHeight={300} scrollTop={0}>
			<Rect width={200} height={100} fill="red" />
			<Rect y={100} width={200} height={100} fill="green" />
			<Rect y={200} width={200} height={100} fill="blue" />
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
		<Group x={0} y={0} width={200} height={100} contentHeight={300} scrollTop={100}>
			<Rect width={200} height={100} fill="red" />
			<Rect y={100} width={200} height={100} fill="green" />
			<Rect y={200} width={200} height={100} fill="blue" />
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
		<Group x={0} y={0} width={100} height={100} contentWidth={300} scrollLeft={100}>
			<Rect width={100} height={100} fill="red" />
			<Rect x={100} width={100} height={100} fill="green" />
			<Rect x={200} width={100} height={100} fill="blue" />
		</Group>,
		canvas,
		config,
	);
	// scrollLeft=100 shows the green rect
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should clamp scrollTop to max value', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group x={0} y={0} width={200} height={100} contentHeight={300} scrollTop={9999}>
			<Rect width={200} height={100} fill="red" />
			<Rect y={100} width={200} height={100} fill="green" />
			<Rect y={200} width={200} height={100} fill="blue" />
		</Group>,
		canvas,
		config,
	);
	// scrollTop clamped to 200, shows the blue rect
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should clamp scrollTop to 0 for negative values', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group x={0} y={0} width={200} height={100} contentHeight={300} scrollTop={-50}>
			<Rect width={200} height={100} fill="red" />
			<Rect y={100} width={200} height={100} fill="green" />
			<Rect y={200} width={200} height={100} fill="blue" />
		</Group>,
		canvas,
		config,
	);
	// scrollTop clamped to 0, shows the red rect
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should work without contentWidth/contentHeight (backward compat)', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group x={10} y={10} width={180} height={80}>
			<Rect width={180} height={80} fill="purple" />
		</Group>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
