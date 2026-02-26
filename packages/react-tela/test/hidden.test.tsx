import config, { Canvas } from '@napi-rs/canvas';
import React, { useState } from 'react';
import { expect } from 'vitest';
import { Rect } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

test('hidden entities should not be rendered', async (render) => {
	const canvas = new Canvas(200, 100);
	let setVisible!: (v: boolean) => void;

	function App() {
		const [visible, setVisibleState] = useState(true);
		setVisible = setVisibleState;
		return (
			<>
				<Rect x={10} y={10} width={80} height={80} fill='green' />
				{visible && <Rect x={50} y={20} width={80} height={60} fill='red' />}
			</>
		);
	}

	const root = render(<App />, canvas, config);
	await root;
	// Both rects visible
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Remove the red rect
	setVisible(false);
	await root;
	// Only green rect visible
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Bring it back
	setVisible(true);
	await root;
	// Both rects visible again
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
