import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect, Circle, Group } from '../src';

const { test, render } = createStrictTest();

test('should render blendMode="multiply"', async () => {
	const canvas = new Canvas(200, 200);
	await render(
		<>
			<Rect x={20} y={20} width={120} height={120} fill="red" />
			<Circle x={60} y={60} radius={60} fill="blue" blendMode="multiply" />
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render blendMode="screen"', async () => {
	const canvas = new Canvas(200, 200);
	await render(
		<>
			<Rect x={20} y={20} width={120} height={120} fill="darkred" />
			<Rect x={60} y={60} width={120} height={120} fill="darkblue" blendMode="screen" />
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render blendMode="destination-out"', async () => {
	const canvas = new Canvas(200, 200);
	await render(
		<>
			<Rect x={0} y={0} width={200} height={200} fill="green" />
			<Circle x={50} y={50} radius={50} fill="white" blendMode="destination-out" />
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
