import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Arc, Circle } from '../src';

const { test, render } = createStrictTest();

test('should render a full <Arc> (donut shape)', async () => {
	const canvas = new Canvas(150, 150);
	await render(
		<Arc
			x={25}
			y={25}
			radius={50}
			startAngle={0}
			endAngle={360}
			fill='tomato'
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render a partial <Arc> (pie slice)', async () => {
	const canvas = new Canvas(150, 150);
	await render(
		<Arc
			x={25}
			y={25}
			radius={50}
			startAngle={0}
			endAngle={90}
			fill='steelblue'
			stroke='navy'
			lineWidth={2}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Arc> with counterclockwise', async () => {
	const canvas = new Canvas(150, 150);
	await render(
		<Arc
			x={25}
			y={25}
			radius={50}
			startAngle={0}
			endAngle={270}
			counterclockwise
			fill='mediumseagreen'
			stroke='darkgreen'
			lineWidth={2}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Arc> with stroke only', async () => {
	const canvas = new Canvas(150, 150);
	await render(
		<Arc
			x={25}
			y={25}
			radius={50}
			startAngle={45}
			endAngle={315}
			stroke='darkorange'
			lineWidth={4}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Circle> as full arc', async () => {
	const canvas = new Canvas(150, 150);
	await render(
		<Circle
			x={25}
			y={25}
			radius={50}
			fill='mediumpurple'
			stroke='indigo'
			lineWidth={3}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Circle> with alpha transparency', async () => {
	const canvas = new Canvas(150, 150);
	await render(
		<>
			<Circle x={15} y={15} radius={45} fill='red' />
			<Circle x={45} y={45} radius={45} fill='blue' alpha={0.5} />
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
