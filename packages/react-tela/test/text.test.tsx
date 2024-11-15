import './helpers/font';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Text } from '../src';
import { render } from '../src/render';

test('should render <Text>', async () => {
	const canvas = new Canvas(300, 100);
	await render(
		<Text
			x={10}
			y={10}
			fontSize={50}
			fontFamily='Geist Sans'
			fill='blue'
			stroke='red'
		>
			Hello world!
		</Text>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
