import './helpers/font';
import config, { Canvas } from '@napi-rs/canvas';
import React from 'react';
import { expect } from 'vitest';
import { Text } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

test('should render <Text>', async (render) => {
	const canvas = new Canvas(300, 100);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={50}
			fontFamily='Geist Sans'
			fill='blue'
			stroke='red'
		>
			Hello world!
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
