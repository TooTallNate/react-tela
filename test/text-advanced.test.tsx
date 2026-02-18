import './helpers/font';
import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Text } from '../src';
import { render } from '../src/render';

test('should render <Text> with letterSpacing', async () => {
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

test('should render <Text> with wordSpacing', async () => {
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

test('should render <Text> with direction rtl', async () => {
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
