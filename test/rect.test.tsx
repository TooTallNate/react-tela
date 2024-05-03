import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect } from '../src';
import { render } from '../src/render';

test('should render <Rect>', async () => {
	const canvas = new Canvas(150, 100);
	await render(
		<Rect x={10} y={10} width={10} height={10} fill='red' />,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
