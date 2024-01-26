import React, { useEffect, useState } from 'react';
import { render } from './render';
import { Circle, Rect, Image } from './index';
const c = document.getElementById('c') as HTMLCanvasElement;

function App() {
	const [s, setS] = useState(100);
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
				width={100}
				height={100}
				rotate={45}
				//alpha={0.5}
				onClick={(e) => {
					e.stopPropagation();
					const color = `#${((Math.random() * 256) | 0)
						.toString(16)
						.padStart(2, '0')}${((Math.random() * 256) | 0)
						.toString(16)
						.padStart(2, '0')}${((Math.random() * 256) | 0)
						.toString(16)
						.padStart(2, '0')}`;
					setColor(color);
					console.log(color);
				}}
			/>
			<Circle x={200} y={200} fill="green" radius={40} />
		</>
	);
}

document.body.onclick = (e) => {
	console.log('body', e.offsetX, e.offsetY);
};

render(<App />, c);
