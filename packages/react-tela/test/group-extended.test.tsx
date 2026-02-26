import './helpers/font';
import config, { Canvas } from '@napi-rs/canvas';
import React from 'react';
import { expect } from 'vitest';
import { Group, Rect, Text, useDimensions } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

function FillRect({ fill }: { fill: string }) {
	const { width, height } = useDimensions();
	return <Rect width={width} height={height} fill={fill} />;
}

test('should render nested <Group> components', async (render) => {
	const canvas = new Canvas(300, 200);
	await render(
		<Group x={10} y={10} width={280} height={180}>
			<FillRect fill='#2c3e50' />
			<Group x={20} y={20} width={100} height={60}>
				<FillRect fill='#e74c3c' />
			</Group>
			<Group x={140} y={20} width={100} height={60}>
				<FillRect fill='#3498db' />
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
				<FillRect fill='blue' />
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
			<FillRect fill='seagreen' />
		</Group>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Group> with uniform borderRadius', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Group x={20} y={20} width={160} height={110} borderRadius={20}>
			<FillRect fill='#e74c3c' />
		</Group>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Group> with per-corner borderRadius', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Group x={20} y={20} width={160} height={110} borderRadius={[0, 0, 20, 20]}>
			<FillRect fill='#3498db' />
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
		return <FillRect fill='orange' />;
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
