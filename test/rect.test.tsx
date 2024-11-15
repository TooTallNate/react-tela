import { it, expect } from 'vitest';
import React from 'react';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect } from '../src';
import { Rect as BaseRect } from '../src/rect';
import { render } from '../src/render';
import { Root } from '../src/root';

it.each([
	{ x: 0, y: 0, expected: false },
	{ x: 9, y: 22, expected: false },
	{ x: 10, y: 23, expected: true },
	{ x: 30, y: 50, expected: true },
	{ x: 13, y: 29, expected: true },
	{ x: 60, y: 123, expected: true },
	{ x: 60, y: 124, expected: false },
	{ x: 61, y: 123, expected: false },
])(
	'should return "$expected" for `isPointInPath($x, $y)`',
	({ x, y, expected }) => {
		const canvas = new Canvas(150, 100);
		const root = new Root(canvas.getContext('2d'), config);
		const rect = new BaseRect({
			x: 10,
			y: 23,
			width: 50,
			height: 100,
			fill: 'red',
		});
		root.add(rect);
		expect(rect.isPointInPath(x, y)).toEqual(expected);
	},
);

it('should have "Rect" as `displayName`', () => {
	expect(Rect.displayName).toEqual('Rect');
});

it('should render <Rect>', async () => {
	const canvas = new Canvas(150, 100);
	await render(
		<Rect x={10} y={10} width={10} height={10} fill='red' />,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
