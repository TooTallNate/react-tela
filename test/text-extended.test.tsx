import './helpers/font';
import React, { useState } from 'react';
import { expect } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Text } from '../src';

const test = createStrictTest();

test('should render <Text> with stroke only', async (render) => {
	const canvas = new Canvas(300, 80);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={50}
			fontFamily='Geist Sans'
			stroke='darkblue'
			lineWidth={2}
		>
			Outline
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Text> with textAlign center', async (render) => {
	const canvas = new Canvas(300, 80);
	await render(
		<Text
			x={150}
			y={10}
			fontSize={40}
			fontFamily='Geist Sans'
			fill='black'
			textAlign='center'
		>
			Centered
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Text> with textAlign end', async (render) => {
	const canvas = new Canvas(300, 80);
	await render(
		<Text
			x={290}
			y={10}
			fontSize={40}
			fontFamily='Geist Sans'
			fill='black'
			textAlign='end'
		>
			Right
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Text> with multiple children (concatenated)', async (render) => {
	const canvas = new Canvas(300, 80);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={30}
			fontFamily='Geist Sans'
			fill='teal'
		>
			{'Hello '}
			{'World'}
			{' '}
			{42}
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should dynamically update <Text> content', async (render) => {
	const canvas = new Canvas(300, 80);
	let setText!: (s: string) => void;

	function DynamicText() {
		const [text, setTextState] = useState('Before');
		setText = setTextState;
		return (
			<Text x={10} y={10} fontSize={40} fontFamily='Geist Sans' fill='black'>
				{text}
			</Text>
		);
	}

	const root = render(<DynamicText />, canvas, config);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	setText('After');
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Text> with rotation', async (render) => {
	const canvas = new Canvas(300, 200);
	await render(
		<Text
			x={50}
			y={50}
			fontSize={36}
			fontFamily='Geist Sans'
			fill='crimson'
			rotate={-15}
		>
			Rotated!
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Text> with alpha', async (render) => {
	const canvas = new Canvas(300, 80);
	await render(
		<>
			<Text x={10} y={10} fontSize={50} fontFamily='Geist Sans' fill='red'>
				Behind
			</Text>
			<Text x={30} y={10} fontSize={50} fontFamily='Geist Sans' fill='blue' alpha={0.4}>
				Front
			</Text>
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
