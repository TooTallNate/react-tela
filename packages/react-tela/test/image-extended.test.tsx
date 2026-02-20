import React from 'react';
import { join } from 'path';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Image, Rect } from '../src';

const test = createStrictTest();

const SRC = join(__dirname, 'pexels-sidorela-shehaj-339534630-19546368.jpg');

test('should render <Image> with alpha transparency', async (render) => {
	const canvas = new Canvas(200, 150);
	const root = render(
		<>
			<Rect width={200} height={150} fill='yellow' />
			<Image x={10} y={10} width={180} height={130} src={SRC} alpha={0.5} />
		</>,
		canvas,
		config,
	);
	await root; // first render (image loading)
	await root; // second render (image loaded)
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Image> with rotation', async (render) => {
	const canvas = new Canvas(200, 200);
	const root = render(
		<Image x={30} y={30} width={120} height={90} src={SRC} rotate={15} />,
		canvas,
		config,
	);
	await root;
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Image> with source region crop (sx, sy, sw, sh)', async (render) => {
	const canvas = new Canvas(150, 100);
	const root = render(
		<Image
			x={10}
			y={10}
			width={130}
			height={80}
			src={SRC}
			sx={100}
			sy={100}
			sw={300}
			sh={200}
		/>,
		canvas,
		config,
	);
	await root;
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
