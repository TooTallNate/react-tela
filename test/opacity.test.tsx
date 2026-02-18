import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect, Circle } from '../src';
import { render } from '../src/render';

test('should render <Rect> with opacity prop', async () => {
	const canvas = new Canvas(200, 150);
	await render(
		<>
			<Rect x={20} y={20} width={100} height={100} fill='red' />
			<Rect x={80} y={40} width={100} height={100} fill='blue' opacity={0.4} />
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Circle> with opacity prop', async () => {
	const canvas = new Canvas(200, 200);
	await render(
		<>
			<Circle x={30} y={30} radius={50} fill='green' />
			<Circle x={80} y={80} radius={50} fill='purple' opacity={0.5} />
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('opacity prop takes precedence over alpha', async () => {
	const canvas = new Canvas(150, 100);
	await render(
		<Rect x={10} y={10} width={80} height={60} fill='red' alpha={0.8} opacity={0.3} />,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
