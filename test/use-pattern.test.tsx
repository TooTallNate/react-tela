import React from 'react';
import { join } from 'path';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect, usePattern } from '../src';
import { render } from '../src/render';

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

test('should render <Rect> with usePattern fill', async () => {
	const canvas = new Canvas(150, 100);
	const src = join(__dirname, 'pexels-sidorela-shehaj-339534630-19546368.jpg');

	const root = render(<PatternRect src={src} />, canvas, config);

	// First render: image not loaded yet, pattern is null, rect has no fill
	await root;

	// After image loads, pattern should be applied
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('usePattern with no-repeat', async () => {
	const canvas = new Canvas(150, 100);
	const src = join(__dirname, 'pexels-sidorela-shehaj-339534630-19546368.jpg');

	const root = render(
		<PatternRect src={src} repetition="no-repeat" />,
		canvas,
		config,
	);
	await root;

	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
