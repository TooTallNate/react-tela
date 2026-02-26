import './helpers/font';
import config, { Canvas } from '@napi-rs/canvas';
import React from 'react';
import { expect } from 'vitest';
import { Text } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

test('should render <Text> with letterSpacing', async (render) => {
	const canvas = new Canvas(400, 80);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={40}
			fontFamily='Geist Sans'
			fill='black'
			letterSpacing={5}
		>
			Spaced Out
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Text> with wordSpacing', async (render) => {
	const canvas = new Canvas(500, 80);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={40}
			fontFamily='Geist Sans'
			fill='black'
			wordSpacing={20}
		>
			Wide Word Gaps
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Text> with direction rtl', async (render) => {
	const canvas = new Canvas(300, 80);
	await render(
		<Text
			x={290}
			y={10}
			fontSize={40}
			fontFamily='Geist Sans'
			fill='darkgreen'
			direction='rtl'
			textAlign='start'
		>
			RTL Text
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
