import './helpers/font';
import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Group, Rect, Text, useDimensions } from '../src';
import { render } from '../src/render';

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
				<Text x={10} y={15} fontSize={32} fontFamily='Geist Sans' fill='white'>
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
