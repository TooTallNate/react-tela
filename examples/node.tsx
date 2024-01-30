import React from 'react';
import { createCanvas } from 'canvas';
import { render } from '../src/render';
import { StaticCanvas, Text, Rect } from '../src';
import terminalImage from 'terminal-image';

function App() {
	return (
		<StaticCanvas>
			<Rect fill="black" width={230} height={85} />
			<Rect
				fill="blue"
				width={50}
				height={40}
				angle={30}
				top={20}
				left={20}
			/>
			<Text fill="#999" fontWeight="bold">
				Hello World!
			</Text>
		</StaticCanvas>
	);
}

const canvas = createCanvas(230, 85);

// `canvas` and `@napi-rs/canvas` packages do not implement
// `getAttribute()` / `setAttribute()`, but fabric uses them
const attributes = new Map<string, string>();
(canvas as any).getAttribute = (name: string) => {
	return attributes.get(name) ?? '';
};
(canvas as any).setAttribute = (name: string, value: string) => {
	attributes.set(name, value);
};

render(<App />, canvas, fabric);

// Small delay because React's rendering process is async
setTimeout(async () => {
	const buffer = canvas.toBuffer('image/png');
	console.log(await terminalImage.buffer(buffer, { width: 40, height: 8 }));
}, 100);
