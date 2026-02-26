import { join } from 'path';
import config, { Canvas } from '@napi-rs/canvas';
import React from 'react';
import { expect } from 'vitest';
import { Image } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

const SRC = join(__dirname, 'pexels-small.jpg');

test('should render <Image> with imageSmoothing disabled', async (render) => {
	const canvas = new Canvas(200, 200);
	const root = render(
		<Image
			x={0}
			y={0}
			width={200}
			height={200}
			src={SRC}
			imageSmoothing={false}
		/>,
		canvas,
		config,
	);
	await root;
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Image> with imageSmoothing enabled and high quality', async (render) => {
	const canvas = new Canvas(200, 200);
	const root = render(
		<Image
			x={0}
			y={0}
			width={200}
			height={200}
			src={SRC}
			imageSmoothing={true}
			imageSmoothingQuality='high'
		/>,
		canvas,
		config,
	);
	await root;
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Image> with imageSmoothingQuality medium', async (render) => {
	const canvas = new Canvas(200, 200);
	const root = render(
		<Image
			x={0}
			y={0}
			width={200}
			height={200}
			src={SRC}
			imageSmoothing={true}
			imageSmoothingQuality='medium'
		/>,
		canvas,
		config,
	);
	await root;
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
