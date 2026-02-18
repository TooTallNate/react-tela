import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect } from '../src';

const { test, render } = createStrictTest();

test('should render a <Rect> with shadow props', async () => {
	const canvas = new Canvas(200, 150);
	const root = render(
		<Rect
			x={30}
			y={20}
			width={80}
			height={60}
			fill='blue'
			shadowColor='rgba(0, 0, 0, 0.5)'
			shadowBlur={10}
			shadowOffsetX={5}
			shadowOffsetY={5}
		/>,
		canvas,
		config,
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
