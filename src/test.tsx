import React, { useEffect, useState } from 'react';
import { render } from './render';
import { Circle, Rect, Path, Image, Group, Text } from './index';

const c = document.getElementById('c') as HTMLCanvasElement;

function App() {
	const [show, setShow] = useState(true);
	const [offset, setOffset] = useState(0);
	const [rotate, setRotate] = useState(0);

	//useEffect(() => {
	//	const id = requestAnimationFrame(() => {
	//		setRotate((r) => r + 0.01);
	//	});
	//	return () => cancelAnimationFrame(id);
	//}, [rotate]);

	//useEffect(() => {
	//	setInterval(() => {
	//		//setShow(s => !s);
	//		setOffset(o => o === 14 ? 0 : o + 1);
	//	}, 20)
	//}, [])

	return (
		<>
			<Rect
				x={1}
				y={1}
				width={150}
				height={150}
				stroke="black"
				rotate={-rotate}
			/>
			<Path
				x={50}
				y={50}
				d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"
				width={50}
				height={50}
				scaleX={3}
				scaleY={3}
				fill="yellow"
				stroke="green"
				rotate={rotate}
			/>
			<Image
				src="cover.png"
				x={500}
				y={200}
				width={600}
				height={600}
				rotate={-rotate}
			/>
			<Text
				x={200}
				y={300}
				value="hello world"
				fontSize={64}
				fontFamily='Geist Mono'
				fill='red'
				lineWidth={20}
				rotate={rotate}
			/>
		</>
	);
}

render(<App />, c);
