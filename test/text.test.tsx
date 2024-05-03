import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Text } from '../src';
import { render } from '../src/render';
import { join } from 'path';

config.GlobalFonts.registerFromPath(
	join(__dirname, 'Geist-Regular.otf'),
	'Geist Sans',
);

test('should render <Text>', async () => {
	const canvas = new Canvas(300, 100);
	await render(
		<Text x={10} y={10} fontSize={32} fontFamily='Geist Sans' fill='blue'>
			Hello world!
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
