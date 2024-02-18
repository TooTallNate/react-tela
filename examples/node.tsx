import React from 'react';
import terminalImage from 'terminal-image';
import config, { Canvas, GlobalFonts } from '@napi-rs/canvas';
import { render } from '../src/render';
import { Group, Text, Rect, Image } from '../src';

GlobalFonts.registerFromPath('/Users/nrajlich/Downloads/NINTENDOSWITCHUI.TTF', 'Switch Font');

function App() {
	return (
		<>
			<Group x={5} y={15} width={180} height={30} rotate={8} ref={g => console.log(g instanceof Group)}>
				<Rect width="100%" height="100%" fill="purple" alpha={0.5} />
				<Text fontSize={24} y={6} fontFamily="Switch Font" fill="white">
					Hello world!
				</Text>
			</Group>
			<Image src="https://nxjs.n8.io/assets/logo.png" width={400} height={400} x={200} y={200} rotate={45} />
		</>
	);
}

const canvas = new Canvas(800, 800);
const root = render(<App />, canvas, config);
await root;
await root;

const buffer = canvas.toBuffer("image/png");
console.log(await terminalImage.buffer(buffer, { height: 45 }));
