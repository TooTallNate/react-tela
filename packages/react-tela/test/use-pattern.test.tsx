import { join } from 'path';
import config, { Canvas } from '@napi-rs/canvas';
import React from 'react';
import { expect } from 'vitest';
import { Rect, usePattern } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

function PatternRect({
	src,
	repetition,
}: {
	src: string;
	repetition?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
}) {
	const pattern = usePattern(src, repetition);
	return <Rect width={150} height={100} fill={pattern} />;
}

/** Wait for the next render event after async work (e.g. image load) */
function waitForRender(root: any): Promise<void> {
	return new Promise((resolve) => {
		const renderCount = root.renderCount;
		const check = () => {
			if (root.renderCount > renderCount) {
				resolve();
			} else {
				setTimeout(check, 10);
			}
		};
		check();
	});
}

test('should render <Rect> with usePattern fill', async (render) => {
	const canvas = new Canvas(150, 100);
	const src = join(__dirname, 'pexels-small.jpg');

	const root = render(<PatternRect src={src} />, canvas, config);

	// First render: pattern is null (image not loaded yet)
	await root;
	// Wait for image load → state update → re-render
	await waitForRender(root);

	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('usePattern with no-repeat', async (render) => {
	const canvas = new Canvas(150, 100);
	const src = join(__dirname, 'pexels-small.jpg');

	const root = render(
		<PatternRect src={src} repetition='no-repeat' />,
		canvas,
		config,
	);
	await root;
	await waitForRender(root);

	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
