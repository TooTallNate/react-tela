import React from 'react';
import { join } from 'path';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Image } from '../src';
import { render } from '../src/render';

test('should render <Image>', async () => {
	const canvas = new Canvas(150, 100);
	const src = join(__dirname, 'pexels-small.jpg');
	const root = render(
		<Image x={10} y={20} width={100} height={60} rotate={10} src={src} />,
		canvas,
		config,
	);

	// First render is empty, image not yet loaded
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Second render is the image loaded
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
