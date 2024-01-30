import React from 'react';
import terminalImage from 'terminal-image';
import { Image, Path2D, DOMMatrix, createCanvas } from '@napi-rs/canvas';
import { render } from '../src/render';
import { Text, Rect } from '../src';

function App() {
	return (
		<>
			<Rect fill="black" width={230} height={85} />
			<Rect
				x={20}
				y={20}
				fill="blue"
				width={50}
				height={40}
				rotate={30}
			/>
			<Text x={10} y={10} fill="#999" fontWeight="bold">
				Hello World!
			</Text>
		</>
	);
}

const canvas = createCanvas(230, 85);
await render(<App />, canvas, {
	createCanvas,
	Image,
	Path2D,
	DOMMatrix,
});

const buffer = canvas.toBuffer("image/png");
console.log(await terminalImage.buffer(buffer, { height: 12 }));
