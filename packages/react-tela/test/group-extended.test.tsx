import './helpers/font';
import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Group, Rect, Text, useDimensions } from '../src';

const test = createStrictTest();

test('should render nested <Group> components', async (render) => {
	const canvas = new Canvas(300, 200);
	await render(
		<Group x={10} y={10} width={280} height={180}>
			<Rect fill='#2c3e50' />
			<Group x={20} y={20} width={100} height={60}>
				<Rect fill='#e74c3c' />
			</Group>
			<Group x={140} y={20} width={100} height={60}>
				<Rect fill='#3498db' />
			</Group>
		</Group>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Group> with alpha', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<>
			<Rect x={20} y={20} width={100} height={100} fill='red' />
			<Group x={60} y={40} width={120} height={100} alpha={0.5}>
				<Rect fill='blue' />
			</Group>
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Group> with scale', async (render) => {
	const canvas = new Canvas(300, 200);
	await render(
		<Group x={20} y={20} width={100} height={80} scaleX={2} scaleY={1.5}>
			<Rect fill='seagreen' />
		</Group>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Group> with uniform radii', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Group x={20} y={20} width={160} height={110} borderRadius={20}>
			<Rect fill='#e74c3c' />
		</Group>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Group> with per-corner radii', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Group x={20} y={20} width={160} height={110} borderRadius={[0, 0, 20, 20]}>
			<Rect fill='#3498db' />
		</Group>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should correctly report useDimensions inside <Group>', async (render) => {
	const canvas = new Canvas(200, 100);
	let dims: { width: number; height: number };
	function Inner() {
		dims = useDimensions();
		return <Rect fill='orange' />;
	}
	await render(
		<Group x={10} y={10} width={150} height={60}>
			<Inner />
		</Group>,
		canvas,
		config,
	);
	expect(dims!).toEqual({ width: 150, height: 60 });
});
