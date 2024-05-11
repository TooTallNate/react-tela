import React, {
	useEffect,
	useRef,
	useState,
	Suspense,
	createContext,
	useContext,
	useLayoutEffect,
} from 'react';
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
import initYoga, {
	ALIGN_CENTER,
	ALIGN_FLEX_START,
	ALIGN_FLEX_END,
	FLEX_DIRECTION_COLUMN,
	FLEX_DIRECTION_ROW,
	EDGE_LEFT,
	EDGE_RIGHT,
	EDGE_TOP,
	EDGE_BOTTOM,
	EDGE_ALL,
	DIRECTION_LTR,
	GUTTER_ALL,
	POSITION_TYPE_ABSOLUTE,
	POSITION_TYPE_RELATIVE,
	POSITION_TYPE_STATIC,
	FLEX_DIRECTION_COLUMN_REVERSE,
	FLEX_DIRECTION_ROW_REVERSE,
	JUSTIFY_CENTER,
	JUSTIFY_FLEX_END,
	JUSTIFY_FLEX_START,
	JUSTIFY_SPACE_AROUND,
	JUSTIFY_SPACE_BETWEEN,
	JUSTIFY_SPACE_EVENLY,
	ALIGN_AUTO,
	ALIGN_BASELINE,
	ALIGN_SPACE_AROUND,
	ALIGN_SPACE_BETWEEN,
	ALIGN_STRETCH,
	type Node as YogaNode,
} from 'yoga-wasm-web/asm';
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

const yoga = initYoga();

// const root = yoga.Node.create();
// root.setFlexDirection(FLEX_DIRECTION_ROW);
// root.setWidth(400);
// root.setHeight(300);
// root.setPosition(EDGE_TOP, 10);
// root.setPosition(EDGE_LEFT, 10);

// const child0 = yoga.Node.create();
// child0.setFlexGrow(1);
// child0.setMargin(EDGE_RIGHT, 10);
// child0.setPadding(EDGE_LEFT, 10);
// root.insertChild(child0, 0);

// const child1 = yoga.Node.create();
// child1.setFlexGrow(1);
// root.insertChild(child1, 1);

// const child2 = yoga.Node.create();
// child2.setFlexGrow(1);
// root.insertChild(child2, 2);

// root.calculateLayout(undefined, undefined, DIRECTION_LTR);

// console.log(root.getComputedLayout());
// console.log(child0.getComputedLayout());
// console.log(child1.getComputedLayout());
// console.log(child2.getComputedLayout());

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
			/>
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
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return React.cloneElement(child as any, {
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
			/>
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

const ALIGN = {
	auto: ALIGN_AUTO,
	'flex-start': ALIGN_FLEX_START,
	center: ALIGN_CENTER,
	'flex-end': ALIGN_FLEX_END,
	stretch: ALIGN_STRETCH,
	baseline: ALIGN_BASELINE,
	'space-between': ALIGN_SPACE_BETWEEN,
	'space-around': ALIGN_SPACE_AROUND,
} as const;

const JUSTIFY = {
	'flex-start': JUSTIFY_FLEX_START,
	center: JUSTIFY_CENTER,
	'flex-end': JUSTIFY_FLEX_END,
	'space-between': JUSTIFY_SPACE_BETWEEN,
	'space-around': JUSTIFY_SPACE_AROUND,
	'space-evenly': JUSTIFY_SPACE_EVENLY,
} as const;

const POSITION = {
	static: POSITION_TYPE_STATIC,
	relative: POSITION_TYPE_RELATIVE,
	absolute: POSITION_TYPE_ABSOLUTE,
} as const;

const FLEX_DIRECTION = {
	column: FLEX_DIRECTION_COLUMN,
	row: FLEX_DIRECTION_ROW,
	'column-reverse': FLEX_DIRECTION_COLUMN_REVERSE,
	'row-reverse': FLEX_DIRECTION_ROW_REVERSE,
} as const;

interface FlexProps {
	flexDirection?: keyof typeof FLEX_DIRECTION;
	gap?: number;
	margin?: number;
	marginInline?: number;
	padding?: number;
	width?: number | string;
	height?: number | string;
	flex?: number;
	flexGrow?: number;
	rowGap?: number;
	x?: number;
	y?: number;
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
	position?: keyof typeof POSITION;
	alignItems?: keyof typeof ALIGN;
	justifyContent?: keyof typeof JUSTIFY;
}

const FlexContext = createContext<YogaNode | null>(null);

function Flex({
	alignItems,
	flex,
	flexDirection,
	flexGrow,
	gap,
	justifyContent,
	margin,
	padding,
	position,
	children,
	x,
	y,
	top,
	left,
	right,
	bottom,
	width,
	height,
}: React.PropsWithChildren<FlexProps>) {
	const [layout, setLayout] =
		useState<ReturnType<YogaNode['getComputedLayout']>>();
	//console.log({ children })
	const dims = useDimensions();
	const parentNode = useContext(FlexContext);
	const nodeRef = useRef<YogaNode | null>(null);
	let node = nodeRef.current;
	//console.log({ node })
	if (!node) {
		nodeRef.current = node = yoga.Node.create();
		if (parentNode) {
			parentNode.insertChild(node, parentNode.getChildCount());
		}
	}

	if (flexDirection) {
		const v = FLEX_DIRECTION[flexDirection];
		if (typeof v !== 'undefined') {
			node.setFlexDirection(v);
		}
	}

	if (typeof gap === 'number') {
		node.setGap(GUTTER_ALL, gap);
	}

	if (typeof margin === 'number') {
		node.setMargin(EDGE_ALL, margin);
	}

	if (typeof padding === 'number') {
		node.setPadding(EDGE_ALL, padding);
	}

	if (typeof flex === 'number') {
		node.setFlex(flex);
	}

	if (typeof flexGrow === 'number') {
		node.setFlexGrow(flexGrow);
	}

	if (typeof justifyContent === 'string') {
		const v = JUSTIFY[justifyContent];
		if (typeof v !== 'undefined') {
			node.setJustifyContent(v);
		}
	}

	if (typeof alignItems === 'string') {
		const v = ALIGN[alignItems];
		if (typeof v !== 'undefined') {
			node.setAlignItems(v);
		}
	}

	if (typeof position === 'string') {
		const v = POSITION[position];
		if (typeof v !== 'undefined') {
			node.setPositionType(v);
		}
	}

	if (x) node.setPosition(EDGE_LEFT, x);
	if (y) node.setPosition(EDGE_TOP, y);

	if (typeof width === 'number') {
		node.setWidth(width);
	} else if (typeof width === 'string') {
		const p = parseInt(width, 10);
		node.setWidthPercent(p);
	}

	if (typeof height === 'number') {
		node.setHeight(height);
	} else if (typeof height === 'string') {
		const p = parseInt(height, 10);
		node.setHeightPercent(p);
	}

	if (typeof top === 'number') {
		node.setPosition(EDGE_TOP, top);
	}

	if (typeof left === 'number') {
		node.setPosition(EDGE_LEFT, left);
	}

	if (typeof right === 'number') {
		node.setPosition(EDGE_RIGHT, right);
	}

	if (typeof bottom === 'number') {
		node.setPosition(EDGE_BOTTOM, bottom);
	}

	useEffect(() => {
		return () => {
			if (parentNode) {
				parentNode.removeChild(node);
			}
			node.free();
		};
	}, [parentNode, node]);

	useLayoutEffect(() => {
		//console.log('layout effect')
		let rootNode = node;
		while (true) {
			const p = rootNode.getParent();
			if (!p) break;
			rootNode = p;
		}

		rootNode.calculateLayout(dims.width, dims.height, DIRECTION_LTR);

		const l = node.getComputedLayout();
		let p: YogaNode | null = node;
		while ((p = p.getParent())) {
			l.left += p.getComputedLeft();
			l.top += p.getComputedTop();
		}
		//console.log(l);
		setLayout(l);
	}, [node, dims]);

	//console.log('here')

	return (
		<FlexContext.Provider value={node}>
			{React.Children.map(children, (child) => {
				if (child.type === Flex) return child;
				if (!layout) return child;
				return React.cloneElement(child, {
					width: layout.width,
					height: layout.height,
					x: layout.left,
					y: layout.top,
				});
			})}
		</FlexContext.Provider>
	);
}

Flex.Text = (props: TextProps) => {
	const { children, fontFamily, fontWeight, fontSize } = props;
	const dims = useTextMetrics(children, fontFamily, fontSize, fontWeight);
	return (
		<Flex width={dims.width} height={fontSize}>
			<Text {...props} />
		</Flex>
	);
};

function FlexTest() {
	return (
		<Flex
			width='100%'
			height='100%'
			justifyContent='center'
			alignItems='center'
		>
			<Rect fill='rgb(42, 117, 100)' />
			<Flex width={250} height={475}>
				<Rect fill='rgb(21, 23, 25)' stroke='rgb(52, 57, 62)' />
				<Flex flex={1} margin={10} gap={10}>
					<Flex height={60} flexGrow={1}>
						<Rect fill='red' alpha={0.8} />
					</Flex>
					<Flex flex={1}>
						<Rect fill='orange' alpha={0.8} />
					</Flex>
					<Flex flex={2} justifyContent='center' alignItems='center'>
						<Rect fill='yellow' alpha={0.8} />
						<Flex.Text
							fill='black'
							fontFamily='Geist'
							onClick={() => {
								console.log('hello world');
							}}
						>
							Hello World 👍
						</Flex.Text>
					</Flex>
					<Flex
						position='absolute'
						width='100%'
						bottom={0}
						height={64}
						flexDirection='row'
						alignItems='center'
						justifyContent='space-around'
					>
						<Rect fill='rgb(77, 84, 93)' stroke='rgb(122, 130, 140)' />
						<Flex width={40} height={40}>
							<Rect fill='rgb(122, 130, 140)' stroke='rgb(177, 182, 189)' />
						</Flex>
						<Flex width={40} height={40}>
							<Rect fill='rgb(122, 130, 140)' stroke='rgb(177, 182, 189)' />
						</Flex>
						<Flex width={40} height={40}>
							<Rect fill='rgb(122, 130, 140)' stroke='rgb(177, 182, 189)' />
						</Flex>
						<Flex width={40} height={40}>
							<Rect fill='rgb(122, 130, 140)' stroke='rgb(177, 182, 189)' />
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}

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
	}, [root]);
	return <Canvas ref={canvasRef} width={100} height={100} rotate={30} />;
}

function CenteredText({ children, ...props }: TextProps) {
	const dims = useDimensions();
	const metrics = useTextMetrics(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		children as any,
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
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const data = useLoaderData() as any;
	return (
		<>
			<Link to='/test?bar'>
				<Rect fill='red' width={100} height={100} onMouseEnter={console.log} />
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
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const error = useAsyncError() as any;
	console.error(error);
	return (
		<Text x={100} y={100} fill='red'>
			Async Error: {String(error)}
		</Text>
	);
}

function RouteErrorBoundary() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const error = useRouteError() as any;
	console.error(error);
	return (
		<Text x={100} y={100} fill='red'>
			Route Error: {String(error)}
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
		//element: <FlexTest />,
		errorElement: <RouteErrorBoundary />,
		loader: () =>
			defer({
				sleep: new Promise((r) => setTimeout(r, 1000)).then(() => {
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

const router = createBrowserRouter(routes);

render(<RouterProvider router={router} />, canvas);
