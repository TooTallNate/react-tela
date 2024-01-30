import React, { useEffect, useRef, useState } from 'react';
import { render } from './render';
import { Circle, Group, Rect, Image, Arc, Text, useRoot, Path } from './index';
const canvas = document.getElementById('c') as HTMLCanvasElement;

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
	const root = useRoot();
	const [rotation, setRotation] = useState(0);
	const [pos, setPos] = useState({ x: 100, y: 50 });
	const isDragging = useRef(false);
	const [stroke, setStroke] = useState<string | undefined>();
	const [stroke2, setStroke2] = useState<string | undefined>();
	const [stroke3, setStroke3] = useState<string | undefined>();
	const [color, setColor] = useState('red');
	useEffect(() => {
		function frame() {
			setRotation((r) => r + 10);
			requestAnimationFrame(frame);
		}
		//frame();
	}, []);
	useEffect(() => {
		root.addEventListener('mouseup', () => {
			isDragging.current = false;
		});
		root.addEventListener('mousemove', (e) => {
			if (!isDragging.current) return;
			setPos({ x: e.clientX - 50, y: e.clientY - 50 });
		});
	}, [root]);
	return (
		<>
			<Image src="cover.png" />
			<Rect
				x={pos.x}
				y={pos.y}
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
				}}
				onMouseDown={(e) => {
					isDragging.current = true;
				}}
				onMouseEnter={(e) => {
					setStroke('black');
				}}
				onMouseLeave={() => {
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
				onMouseEnter={(e) => {
					setStroke2('black');
				}}
				onMouseLeave={() => {
					setStroke2(undefined);
				}}
			/>
			<Text
				fill="black"
				x={500}
				y={200}
				fontFamily="Comic Sans MS"
				fontSize={34}
			>
				hello world
			</Text>
			<Group x={500} y={400} width={180} height={30} rotate={6}>
				<Rect width="100%" height="100%" fill="purple" alpha={0.5} />
				<Text fontSize={32} fontFamily="Geist" fill="white">
					Hello world!
				</Text>
			</Group>
			<Path
				x={400}
				y={400}
				width={47.94}
				height={47.94}
				d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
        c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
        c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
        c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
        c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
        C22.602,0.567,25.338,0.567,26.285,2.486z"
				fill="#ED8A19"
				rotate={rotation}
				scaleX={1}
				scaleY={1}
				stroke={stroke3}
				lineWidth={1.5}
				onMouseEnter={(e) => {
					setStroke3('black');
				}}
				onMouseLeave={() => {
					setStroke3(undefined);
				}}
			/>
		</>
	);
}

document.body.onclick = (e) => {
	console.log('body', e.offsetX, e.offsetY);
};

document.getElementById('parent')!.ontouchstart = (e) => {
	console.log(e);
};

render(<App />, canvas);
