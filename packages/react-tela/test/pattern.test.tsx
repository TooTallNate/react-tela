import config, { Canvas } from '@napi-rs/canvas';
import React, { useRef } from 'react';
import { expect } from 'vitest';
import { Pattern, Rect } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

test('should render <Rect> with pattern fill (checkerboard)', async (render) => {
	const canvas = new Canvas(100, 100);

	function Checkerboard() {
		const pattern = useRef(null);
		return (
			<>
				<Pattern ref={pattern} width={20} height={20} repetition='repeat'>
					<Rect width={10} height={10} fill='#ccc' />
					<Rect x={10} y={10} width={10} height={10} fill='#ccc' />
				</Pattern>
				<Rect width={100} height={100} fill={pattern} />
			</>
		);
	}

	await render(<Checkerboard />, canvas, config);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with pattern stroke', async (render) => {
	const canvas = new Canvas(100, 100);

	function PatternStroke() {
		const pattern = useRef(null);
		return (
			<>
				<Pattern ref={pattern} width={10} height={10} repetition='repeat'>
					<Rect width={5} height={5} fill='red' />
					<Rect x={5} y={5} width={5} height={5} fill='blue' />
				</Pattern>
				<Rect
					x={10}
					y={10}
					width={80}
					height={80}
					stroke={pattern}
					lineWidth={4}
				/>
			</>
		);
	}

	await render(<PatternStroke />, canvas, config);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('pattern with repeat-x', async (render) => {
	const canvas = new Canvas(100, 100);

	function RepeatX() {
		const pattern = useRef(null);
		return (
			<>
				<Pattern ref={pattern} width={20} height={20} repetition='repeat-x'>
					<Rect width={20} height={20} fill='green' />
				</Pattern>
				<Rect width={100} height={100} fill={pattern} />
			</>
		);
	}

	await render(<RepeatX />, canvas, config);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('pattern children are not drawn to main canvas (hidden)', async (render) => {
	const canvas = new Canvas(100, 100);

	function App() {
		const pattern = useRef(null);
		return (
			<>
				<Rect width={100} height={100} fill='white' />
				<Pattern ref={pattern} width={20} height={20}>
					<Rect width={20} height={20} fill='red' />
				</Pattern>
				{/* Don't use the pattern - the red rect should NOT appear */}
			</>
		);
	}

	const root = render(<App />, canvas, config);
	await root;
	// Should be all white - pattern content should not be visible
	const buf = canvas.toBuffer('image/png');
	expect(buf).toMatchImageSnapshot();
});
