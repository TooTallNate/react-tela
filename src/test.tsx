import React, { useEffect, useState } from 'react';
import { render } from './render';
import { Rect } from './index';

const c = document.getElementById('c') as HTMLCanvasElement;

function App() {
	const [show, setShow] = useState(true);
	const [rotate, setRotate] = useState(0);

	//useEffect(() => {
	//	const id = requestAnimationFrame(() => {
	//		setRotate(r => r + 0.01);
	//	});
	//	return () => cancelAnimationFrame(id);
	//}, [ rotate])

	//useEffect(() => {
	//	setInterval(() => {
	//		setShow(s => !s);
	//	}, 1000)
	//}, [])

	return (
		<>
			<Rect
				x={100}
				y={100}
				width={200}
				height={200}
				fill="green"
				originX="center"
				originY="center"
				stroke="black"
				lineWidth={10}
				rotate={rotate}
			/>
			{show && (
				<Rect
					x={200}
					y={200}
					width={200}
					height={200}
					fill="red"
					originX="center"
					originY="center"
					stroke="black"
					lineWidth={10}
					rotate={rotate}
				/>
			)}
			<Rect
				x={300}
				y={300}
				width={200}
				height={200}
				fill="blue"
				originX="center"
				originY="center"
				stroke="black"
				lineWidth={10}
				rotate={rotate}
			/>
		</>
	);
}

render(<App />, c);
