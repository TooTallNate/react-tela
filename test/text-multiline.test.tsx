import './helpers/font';
import React from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Text } from '../src';

const { test, render } = createStrictTest();

test('should wrap text to multiple lines with maxWidth', async () => {
	const canvas = new Canvas(250, 200);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={20}
			fontFamily='Geist Sans'
			fill='black'
			maxWidth={200}
		>
			This is a long paragraph that will automatically wrap to fit within the given width.
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should support lineHeight prop', async () => {
	const canvas = new Canvas(250, 250);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={20}
			fontFamily='Geist Sans'
			fill='black'
			maxWidth={200}
			lineHeight={1.8}
		>
			Line height makes text more readable with extra spacing between lines.
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should truncate with ellipsis when overflow is ellipsis', async () => {
	const canvas = new Canvas(250, 50);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={20}
			fontFamily='Geist Sans'
			fill='black'
			maxWidth={150}
			overflow='ellipsis'
		>
			This text is way too long to fit in the available space
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should clip text when overflow is clip', async () => {
	const canvas = new Canvas(250, 50);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={20}
			fontFamily='Geist Sans'
			fill='black'
			maxWidth={150}
			overflow='clip'
		>
			This text is way too long to fit in the available space
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should handle explicit newlines', async () => {
	const canvas = new Canvas(300, 150);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={20}
			fontFamily='Geist Sans'
			fill='darkblue'
		>
			{'Line one\nLine two\nLine three'}
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should wrap text with stroke and fill', async () => {
	const canvas = new Canvas(250, 200);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={24}
			fontFamily='Geist Sans'
			fill='tomato'
			stroke='darkred'
			lineWidth={1}
			maxWidth={200}
		>
			Wrapped text with both fill and stroke styling applied.
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
