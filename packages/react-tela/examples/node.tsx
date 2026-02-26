import config, { Canvas, GlobalFonts } from '@napi-rs/canvas';
import React, { useEffect, useState } from 'react';
import {
	RouterProvider,
	createMemoryRouter,
	useNavigate,
} from 'react-router-dom';
import terminalImage from 'terminal-image';
import { Group, Image, Rect, Text } from '../src';
import { render } from '../src/render';

GlobalFonts.registerFromPath(
	'/Users/nrajlich/Downloads/NINTENDOSWITCHUI.TTF',
	'Switch Font',
);

function App() {
	const [r, setR] = useState(0);
	useEffect(() => {
		setInterval(() => {
			setR((v) => v + 1);
		}, 33.3);
	}, []);
	return (
		<>
			{/*
			<Group x={5} y={15} width={180} height={30} rotate={8} ref={g => console.log(g)} onClick={console.log}>
				<Rect width="100%" height="100%" fill="purple" alpha={0.5} />
				<Text fontSize={24} y={6} fontFamily="Switch Font" fill="white">
					Hello world!
				</Text>
			</Group>
			<Image src="https://nxjs.n8.io/assets/logo.png" width={400} height={400} x={200} y={200} rotate={45} />
	*/}
			<Rect
				x={20}
				y={20}
				width={100}
				height={100}
				fill='red'
				stroke='green'
				lineWidth={8}
				rotate={r}
				onClick={console.log}
			/>
		</>
	);
}

function Foo() {
	const navigate = useNavigate();
	useEffect(() => {
		setTimeout(() => {
			navigate('/');
		}, 1000);
	}, []);
	return (
		<Text fontSize={100} fontFamily='Geist' fill='white'>
			test
		</Text>
	);
}

const routes = [
	{
		path: '/',
		element: <App />,
		//loader: () => FAKE_EVENT,
	},
	{
		path: '/foo',
		element: <Foo />,
		//loader: () => FAKE_EVENT,
	},
];

const router = createMemoryRouter(routes, {
	initialEntries: ['/', '/foo'],
	initialIndex: 1,
});

const canvas = new Canvas(800, 500);
const root = render(<RouterProvider router={router} />, canvas, config);

// Hide cursor
process.stdout.write('\x1B[?25l');

root.addEventListener('render', async () => {
	const buffer = canvas.toBuffer('image/png');
	const i = await terminalImage.buffer(buffer, { height: 30 });
	process.stdout.write(`\x1B[2J\x1B[2;2H${i}`);
});

process.on('exit', () => {
	// Show cursor
	process.stdout.write('\x1B[?25h');
});
