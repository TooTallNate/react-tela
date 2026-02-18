import React from 'react';
import { join } from 'path';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Image } from '../src';

const { test, render } = createStrictTest();

const SRC = join(__dirname, 'pexels-small.jpg');

test('should render <Image> with imageSmoothing disabled', async () => {
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

test('should render <Image> with imageSmoothing enabled and high quality', async () => {
	const canvas = new Canvas(200, 200);
	const root = render(
		<Image
			x={0}
			y={0}
			width={200}
			height={200}
			src={SRC}
			imageSmoothing={true}
			imageSmoothingQuality="high"
		/>,
		canvas,
		config,
	);
	await root;
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Image> with imageSmoothingQuality medium', async () => {
	const canvas = new Canvas(200, 200);
	const root = render(
		<Image
			x={0}
			y={0}
			width={200}
			height={200}
			src={SRC}
			imageSmoothing={true}
			imageSmoothingQuality="medium"
		/>,
		canvas,
		config,
	);
	await root;
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
