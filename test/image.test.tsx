import React from 'react';
import { join } from 'path';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Image } from '../src';

const test = createStrictTest();

test('should render <Image>', async (render) => {
	const canvas = new Canvas(150, 100);
	const src = join(__dirname, 'pexels-sidorela-shehaj-339534630-19546368.jpg');
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
