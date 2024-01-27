import React, { useEffect, useState } from 'react';
import { render } from './render';
import { Circle, Rect, Image } from './index';
const c = document.getElementById('c') as HTMLCanvasElement;

const randomColor = () =>
	`#${((Math.random() * 256) | 0).toString(16).padStart(2, '0')}${(
		(Math.random() * 256) |
		0
	)
		.toString(16)
		.padStart(2, '0')}${((Math.random() * 256) | 0)
		.toString(16)
		.padStart(2, '0')}`;

function App() {
	const [s, setS] = useState(100);
	const [stroke, setStroke] = useState<string | undefined>();
	const [stroke2, setStroke2] = useState<string | undefined>();
	const [color, setColor] = useState('red');
	useEffect(() => {
		setTimeout(() => {
			setS(200);
		}, 400);
	}, []);
	return (
		<>
			<Image src="cover.png" />
			<Rect
				x={s}
				y={50}
				fill={color}
				stroke={stroke}
				lineWidth={5}
				width={100}
				height={100}
				rotate={45}
				//alpha={0.5}
				onClick={(e) => {
					e.stopPropagation();
					const color = randomColor();
					setColor(color);
					console.log(color);
				}}
				//onMouseMove={e => {
				//	console.log(e);
				//}}
				onMouseEnter={() => {
					console.log('mouseenter');
					setStroke('black');
				}}
				onMouseLeave={() => {
					console.log('mouseleave');
					setStroke(undefined);
				}}
			/>
			<Circle
				x={200}
				y={200}
				fill="green"
				radius={40}
				stroke={stroke2}
				lineWidth={5}
				onMouseEnter={() => {
					console.log('mouseenter');
					setStroke2('black');
				}}
				onMouseLeave={() => {
					console.log('mouseleave');
					setStroke2(undefined);
				}}
			/>
		</>
	);
}

document.body.onclick = (e) => {
	console.log('body', e.offsetX, e.offsetY);
};

render(<App />, c);
