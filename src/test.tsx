import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { render } from './render';
import {
	Circle,
	Group,
	Rect,
	Image,
	Arc,
	Text,
	useRoot,
	Path,
	RoundRectProps,
	RoundRect,
} from './index';
const canvas = document.getElementById('c') as HTMLCanvasElement;

const randomColor = () =>
	`#${((Math.random() * 255) | 0).toString(16).padStart(2, '0')}${(
		(Math.random() * 255) |
		0
	)
		.toString(16)
		.padStart(2, '0')}${((Math.random() * 255) | 0)
		.toString(16)
		.padStart(2, '0')}`;

function Button({ children, ...props }: RoundRectProps & { children: string }) {
	const root = useRoot();
	const rectRef = useRef();
	const [hover, setHover] = useState(false);
	const [textPos, setTextPos] = useState({ x: 0, y: 0 });
	return (
		<>
			<RoundRect
				{...props}
				fill={hover ? 'rgba(250, 250, 250, 0.9)' : props.fill}
				onMouseEnter={() => {
					setHover(true);
					// @ts-ignore
					root.ctx.canvas.style.cursor = 'pointer';
				}}
				onMouseLeave={() => {
					setHover(false);
					// @ts-ignore
					root.ctx.canvas.style.cursor = 'unset';
				}}
				onClick={() => {
					console.log('click!');
				}}
				ref={(ref) => {
					if (!ref || rectRef.current) return;
					// @ts-ignore
					rectRef.current = ref;
					setTextPos({
						x: ref.calculatedX,
						y: ref.calculatedY,
					});
				}}
			></RoundRect>
			<Text
				x={textPos.x}
				y={textPos.y}
				fill='black'
				fontFamily='Geist'
				pointerEvents={false}
				textAlign='center'
				textBaseline='middle'
			>
				{children}
			</Text>
		</>
	);
}

function App() {
	const [r, setR] = useState(0);
	const [pos, setPos] = useState({ x: 0, y: 0 });
	useEffect(() => {
		function frame() {
			setR((r) => r + 1);
			requestAnimationFrame(frame);
		}
		//requestAnimationFrame(frame);
	}, []);
	return (
		<>
			<Rect
				x={pos.x}
				y={pos.y}
				width={800}
				height={600}
				fill='#222'
				rotate={r}
				onTouchMove={(e) => {
					e.preventDefault();
					const touch = e.changedTouches[0];
					setPos({ x: touch.clientX - 200, y: touch.clientY - 150 });
				}}
			></Rect>
			<Button
				x={400}
				y={200}
				width={150}
				height={75}
				radii={30}
				fill='rgb(250, 250, 250)'
			>
				Button
			</Button>
		</>
	);
}

//function App() {
//	const root = useRoot();
//	const [rotation, setRotation] = useState(0);
//	const [pos, setPos] = useState({ x: 100, y: 50 });
//	const isDragging = useRef(false);
//	const [stroke, setStroke] = useState<string | undefined>();
//	const [stroke2, setStroke2] = useState<string | undefined>();
//	const [stroke3, setStroke3] = useState<string | undefined>();
//	const [color, setColor] = useState('red');
//	useEffect(() => {
//		function frame() {
//			setRotation((r) => r + 10);
//			requestAnimationFrame(frame);
//		}
//		//frame();
//	}, []);
//	useEffect(() => {
//		root.addEventListener('mouseup', () => {
//			isDragging.current = false;
//		});
//		root.addEventListener('mousemove', (e) => {
//			if (!isDragging.current) return;
//			//setPos({ x: e.clientX - 50, y: e.clientY - 50 });
//		});
//	}, [root]);
//	return (
//		<>
//			<Image src="cover.png" />
//			<Rect
//				x={pos.x}
//				y={pos.y}
//				fill={color}
//				stroke={stroke}
//				lineWidth={5}
//				width={100}
//				height={100}
//				rotate={45}
//				//alpha={0.5}
//				onClick={(e) => {
//					e.stopPropagation();
//					const color = randomColor();
//					setColor(color);
//				}}
//				onMouseDown={(e) => {
//					isDragging.current = true;
//				}}
//				onMouseEnter={(e) => {
//					setStroke('black');
//				}}
//				onMouseLeave={() => {
//					setStroke(undefined);
//				}}
//			/>
//			<Circle
//				x={200}
//				y={200}
//				fill="green"
//				radius={40}
//				stroke={stroke2}
//				lineWidth={5}
//				onMouseEnter={(e) => {
//					setStroke2('black');
//				}}
//				onMouseLeave={() => {
//					setStroke2(undefined);
//				}}
//			/>
//			<Text
//				fill="black"
//				x={500}
//				y={200}
//				fontFamily="Comic Sans MS"
//				fontSize={34}
//			>
//				hello world
//			</Text>
//			<Path
//				x={400}
//				y={400}
//				width={47.94}
//				height={47.94}
//				d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
//        c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
//        c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
//        c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
//        c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
//        C22.602,0.567,25.338,0.567,26.285,2.486z"
//				//fill="#ED8A19"
//				rotate={rotation}
//				scaleX={5}
//				scaleY={5}
//				stroke={stroke3 || 'red' || stroke3}
//				lineWidth={3}
//				onMouseEnter={(e) => {
//					setStroke3('black');
//				}}
//				onMouseLeave={() => {
//					setStroke3(undefined);
//				}}
//			/>
//			<Group
//				x={500}
//				y={130}
//				width={100}
//				height={100}
//				rotate={-60}
//				scaleX={4}
//				scaleY={4}
//				onMouseEnter={() => {
//					console.log('group mouseenter');
//				}}
//			>
//				<Rect width={40} height={40} fill="purple" />
//				<Rect
//					width={40}
//					height={40}
//					x={50}
//					fill="gold"
//					onMouseEnter={(e) =>
//						console.log('gold mouseenter', e.layerX, e.layerY)
//					}
//				/>
//				<Rect width={40} height={40} y={50} fill="yellow" />
//				<Rect width={40} height={40} x={50} y={50} fill="blue" />
//				<Rect
//					width={40}
//					height={40}
//					x={25}
//					y={25}
//					fill="red"
//					rotate={45}
//				/>
//			</Group>
//		</>
//	);
//}

document.body.onclick = (e) => {
	console.log('body', e.offsetX, e.offsetY);
};

document.body.ontouchmove = (e) => {
	console.log(e.target);
};

document.getElementById('parent')!.ontouchstart = (e) => {
	console.log(e);
};

render(<App />, canvas);
