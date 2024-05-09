import React, { useEffect, useRef, useState, Suspense } from 'react';
import { render } from './render.js';
import {
	Await,
	RouteObject,
	RouterProvider,
	createBrowserRouter,
	defer,
	useAsyncError,
	useAsyncValue,
	useLoaderData,
	useNavigate,
	useRouteError,
} from 'react-router-dom';
import {
	Canvas,
	Group,
	Rect,
	Text,
	useParent,
	RoundRectProps,
	RoundRect,
	CanvasRef,
	useTextMetrics,
	TextProps,
	useDimensions,
} from './index.js';
const canvas = document.getElementById('c') as HTMLCanvasElement;

//const randomColor = () =>
//	`#${((Math.random() * 255) | 0).toString(16).padStart(2, '0')}${(
//		(Math.random() * 255) |
//		0
//	)
//		.toString(16)
//		.padStart(2, '0')}${((Math.random() * 255) | 0)
//		.toString(16)
//		.padStart(2, '0')}`;

function Button({ children, ...props }: RoundRectProps & { children: string }) {
	const root = useParent();
	const rectRef = useRef();
	const [hover, setHover] = useState(false);
	const [textPos, setTextPos] = useState({ x: 0, y: 0 });
	useEffect(() => {
		return () => {
			// @ts-ignore
			root.ctx.canvas.style.cursor = 'unset';
		};
	}, [root]);
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
				//onClick={() => {
				//	console.log('click!');
				//}}
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

function Link({ to, children }: React.PropsWithChildren<{ to: string }>) {
	const navigate = useNavigate();
	return React.Children.map(children, (child) => {
		if (child == null || typeof child !== 'object') return child;
		return React.cloneElement(child, {
			onClick() {
				navigate(to);
			},
		});
	});
}

function App() {
	const [pos, setPos] = useState({ x: 0, y: 0 });
	return (
		<>
			<Rect
				x={pos.x}
				y={pos.y}
				width={800}
				height={600}
				fill='#222'
				onTouchMove={(e) => {
					e.preventDefault();
					const touch = e.changedTouches[0];
					setPos({ x: touch.clientX - 200, y: touch.clientY - 150 });
				}}
			></Rect>
			<Link to='/page2'>
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
			</Link>
		</>
	);
}

//function App() {
//	const root = useParent();
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

//document.body.onclick = (e) => {
//	console.log('body', e.offsetX, e.offsetY);
//};
//
//document.body.ontouchmove = (e) => {
//	console.log(e.target);
//};
//
//document.getElementById('parent')!.ontouchstart = (e) => {
//	console.log(e);
//};

function Page2() {
	const root = useParent();
	const canvasRef = useRef<CanvasRef | null>(null);
	useEffect(() => {
		if (!canvasRef.current) return;
		const ctx = canvasRef.current.getContext('2d');
		if (!ctx) return;
		ctx.fillStyle = 'blue';
		ctx.fillRect(0, 0, 50, 50);
		root.queueRender();
	}, [canvasRef, root]);
	return <Canvas ref={canvasRef} width={100} height={100} rotate={30} />;
}

function CenteredText({ children, ...props }: TextProps) {
	const dims = useDimensions();
	const metrics = useTextMetrics(
		children,
		props.fontFamily,
		props.fontSize,
		props.fontWeight,
	);
	return (
		<Text
			x={dims.width / 2 - metrics.width / 2}
			y={dims.height / 2 - (props.fontSize || 24) / 2}
			{...props}
		>
			{children}
		</Text>
	);
}

function Page1() {
	const data = useLoaderData();
	return (
		<>
			<Link to='/test?bar'>
				<Rect
					fill='red'
					width={100}
					height={100}
					onMouseEnter={console.log}
				></Rect>
			</Link>
			<Rect x={1280 / 2} width={1} height='100%' fill='red' />
			<CenteredText
				fill='green'
				fontWeight='bold'
				fontFamily='Geist'
				fontSize={40}
			>
				hello world
			</CenteredText>
			<Group width={300} height={100} x={50} y={200}>
				<Rect width='100%' height='100%' fill='yellow' />
				<CenteredText fill='green' fontFamily='Comic Sans MS'>
					hello world
				</CenteredText>
			</Group>
			<Page2 />
			<Suspense
				fallback={
					<Text x={100} y={100} fill='black'>
						Loading...
					</Text>
				}
			>
				<Await resolve={data.sleep} errorElement={<ErrorBoundary />}>
					<Async />
				</Await>
			</Suspense>
		</>
	);
}

function ErrorBoundary() {
	const error = useAsyncError();
	console.error(error);
	return (
		<Text x={100} y={100} fill='black'>
			{error.message}
		</Text>
	);
}

function Async() {
	const data = useAsyncValue();
	console.log(data);
	return (
		<Text x={100} y={100} fill='green'>
			Loaded!
		</Text>
	);
}

const routes: RouteObject[] = [
	{
		path: '/',
		element: <App />,
		//loader: () => FAKE_EVENT,
	},
	{
		path: '/test',
		element: <Page1 />,
		errorElement: <Text fill='black'>There was an error</Text>,
		loader: () =>
			defer({
				sleep: new Promise((r) => setTimeout(r, 1000)).then(() => {
					throw new Error('bad');
					return 'data';
				}),
			}),
	},
	{
		path: '/page2',
		element: <Page2 />,
		//loader: () => FAKE_EVENT,
	},
];

const router = createBrowserRouter(routes, {
	//initialEntries: ['/', '/page2'],
	//initialIndex: 0,
});

render(<RouterProvider router={router} />, canvas);
