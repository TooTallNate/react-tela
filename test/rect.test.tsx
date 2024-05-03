import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect } from '../src';
import { render } from '../src/render';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

test('should render basic <Rect>', async () => {
	const canvas = new Canvas(150, 100);
	const root = render(
		<Rect x={10} y={10} width={10} height={10} fill="red" />,
		canvas,
		config
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
