import React from 'react';
import { join } from 'path';
import { test, expect } from 'vitest';
import config, { Canvas, GlobalFonts } from '@napi-rs/canvas';
import { Group, Rect, Text, useDimensions, LayoutContext } from '../src';
import { render } from '../src/render';

GlobalFonts.registerFromPath(
	join(__dirname, 'Geist-Regular.otf'),
	'Geist Sans',
);

test('should render <Group>', async () => {
	const canvas = new Canvas(300, 100);
	let dims: { width: number; height: number };
	function Inner() {
		dims = useDimensions();
		return (
			<>
				<Rect
					width={dims.width}
					height={dims.height}
					fill='purple'
					alpha={0.5}
				/>
				<Text x={10} y={15} fontSize={32} fontFamily='Geist' fill='white'>
					Hello world!
				</Text>
			</>
		);
	}
	await render(
		<Group x={15} y={25} width={200} height={50} rotate={10}>
			<Inner />
		</Group>,
		canvas,
		config,
	);
	expect(dims!).toEqual({
		width: 200,
		height: 50,
	});
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Group> with parent layout context', async () => {
	const canvas = new Canvas(300, 100);
	let dims: { width: number; height: number };
	function Inner() {
		dims = useDimensions();
		return (
			<>
				<Rect
					width={dims.width}
					height={dims.height}
					fill='orange'
					alpha={0.5}
				/>
				<Text x={10} y={15} fontSize={32} fontFamily='Geist' fill='black'>
					Hello world!
				</Text>
			</>
		);
	}
	await render(
		<LayoutContext.Provider value={{ x: 15, y: 25, width: 200, height: 50 }}>
			<Group rotate={10}>
				<Inner />
			</Group>
		</LayoutContext.Provider>,
		canvas,
		config,
	);
	expect(dims!).toEqual({
		width: 200,
		height: 50,
	});
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
