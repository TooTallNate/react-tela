import React, {
	createContext,
	useContext,
	useLayoutEffect,
	useRef,
	useState,
	type PropsWithChildren,
} from 'react';
import type { TextProps as _TextProps } from './text.js';
import { LayoutContext, type Layout } from './hooks/use-layout.js';
import { useTextMetrics } from './hooks/use-text-metrics.js';
import { useDimensions } from './hooks/use-dimensions.js';
import { Text } from './index.js';

export type { Layout };

// ─── Yoga types (minimal interface to avoid hard dependency) ───

interface YogaNode {
	setFlexDirection(dir: number): void;
	setJustifyContent(jc: number): void;
	setAlignItems(ai: number): void;
	setAlignSelf(as_: number): void;
	setDisplay(d: number): void;
	setPositionType(pt: number): void;
	setFlexWrap(fw: number): void;
	setFlex(f: number): void;
	setFlexGrow(fg: number): void;
	setFlexShrink(fs: number): void;
	setFlexBasis(fb: number): void;
	setFlexBasisPercent(fb: number): void;
	setWidth(w: number): void;
	setWidthPercent(w: number): void;
	setWidthAuto(): void;
	setHeight(h: number): void;
	setHeightPercent(h: number): void;
	setHeightAuto(): void;
	setMinWidth(w: number): void;
	setMinWidthPercent(w: number): void;
	setMaxWidth(w: number): void;
	setMaxWidthPercent(w: number): void;
	setMinHeight(h: number): void;
	setMinHeightPercent(h: number): void;
	setMaxHeight(h: number): void;
	setMaxHeightPercent(h: number): void;
	setMargin(edge: number, value: number): void;
	setPadding(edge: number, value: number): void;
	setGap(gutter: number, value: number): void;
	setPosition(edge: number, value: number): void;
	setOverflow(o: number): void;
	setAspectRatio(ar: number): void;
	insertChild(child: YogaNode, index: number): void;
	removeChild(child: YogaNode): void;
	getChildCount(): number;
	getComputedLayout(): { left: number; top: number; width: number; height: number };
	getComputedLeft(): number;
	getComputedTop(): number;
	getParent(): YogaNode | null;
	calculateLayout(width: number | undefined, height: number | undefined, direction: number): void;
	free(): void;
}

interface YogaConfig {
	setPointScaleFactor(factor: number): void;
}

interface Yoga {
	Node: { createWithConfig(config: YogaConfig): YogaNode };
	Config: { create(): YogaConfig };
}

// ─── Yoga constant values ───

const ALIGN = { auto: 0, 'flex-start': 1, center: 2, 'flex-end': 3, stretch: 4, baseline: 5, 'space-between': 6, 'space-around': 7 } as const;
const JUSTIFY = { 'flex-start': 0, center: 1, 'flex-end': 2, 'space-between': 3, 'space-around': 4, 'space-evenly': 5 } as const;
const POSITION = { static: 2, relative: 0, absolute: 1 } as const;
const FLEX_DIRECTION = { column: 0, 'column-reverse': 1, row: 2, 'row-reverse': 3 } as const;
const DISPLAY = { flex: 0, none: 1 } as const;
const WRAP = { 'no-wrap': 0, wrap: 1, 'wrap-reverse': 2 } as const;
const OVERFLOW = { visible: 0, hidden: 1, scroll: 2 } as const;

const DIRECTION_LTR = 0;
const EDGE_LEFT = 0;
const EDGE_TOP = 1;
const EDGE_RIGHT = 2;
const EDGE_BOTTOM = 3;
const EDGE_ALL = 6;
const GUTTER_ALL = 2;

// ─── Props ───

export interface FlexProps {
	flexDirection?: keyof typeof FLEX_DIRECTION;
	flexWrap?: keyof typeof WRAP;
	justifyContent?: keyof typeof JUSTIFY;
	alignItems?: keyof typeof ALIGN;
	alignSelf?: keyof typeof ALIGN;
	flex?: number;
	flexGrow?: number;
	flexShrink?: number;
	flexBasis?: number | string;
	width?: number | string;
	height?: number | string;
	minWidth?: number | string;
	maxWidth?: number | string;
	minHeight?: number | string;
	maxHeight?: number | string;
	gap?: number;
	margin?: number;
	marginTop?: number;
	marginBottom?: number;
	marginLeft?: number;
	marginRight?: number;
	padding?: number;
	paddingTop?: number;
	paddingBottom?: number;
	paddingLeft?: number;
	paddingRight?: number;
	position?: keyof typeof POSITION;
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
	display?: keyof typeof DISPLAY;
	overflow?: keyof typeof OVERFLOW;
	aspectRatio?: number;
}

// ─── Context ───

interface FlexTreeManager {
	yoga: Yoga;
	yogaConfig: YogaConfig;
	rootNode: YogaNode;
	subscribers: Set<() => void>;
	subscribe(cb: () => void): () => void;
	recalculate(width: number, height: number): void;
}

const FlexTreeContext = createContext<FlexTreeManager | null>(null);
FlexTreeContext.displayName = 'FlexTreeContext';

const FlexNodeContext = createContext<YogaNode | null>(null);
FlexNodeContext.displayName = 'FlexNodeContext';

// ─── Helpers ───

function setDimension(
	node: YogaNode,
	prop: 'width' | 'height' | 'minWidth' | 'maxWidth' | 'minHeight' | 'maxHeight',
	value: number | string | undefined,
) {
	if (value === undefined) return;
	if (typeof value === 'number') {
		switch (prop) {
			case 'width': node.setWidth(value); break;
			case 'height': node.setHeight(value); break;
			case 'minWidth': node.setMinWidth(value); break;
			case 'maxWidth': node.setMaxWidth(value); break;
			case 'minHeight': node.setMinHeight(value); break;
			case 'maxHeight': node.setMaxHeight(value); break;
		}
	} else {
		if (value === 'auto') {
			if (prop === 'width') node.setWidthAuto();
			else if (prop === 'height') node.setHeightAuto();
			return;
		}
		const pct = parseFloat(value);
		if (!isNaN(pct)) {
			switch (prop) {
				case 'width': node.setWidthPercent(pct); break;
				case 'height': node.setHeightPercent(pct); break;
				case 'minWidth': node.setMinWidthPercent(pct); break;
				case 'maxWidth': node.setMaxWidthPercent(pct); break;
				case 'minHeight': node.setMinHeightPercent(pct); break;
				case 'maxHeight': node.setMaxHeightPercent(pct); break;
			}
		}
	}
}

function setEdge(
	node: YogaNode,
	fn: 'setMargin' | 'setPadding' | 'setPosition',
	edge: number,
	value: number | undefined,
) {
	if (typeof value === 'number') node[fn](edge, value);
}

function applyYogaProps(node: YogaNode, props: FlexProps) {
	if (props.flexDirection !== undefined) { const v = FLEX_DIRECTION[props.flexDirection]; if (v !== undefined) node.setFlexDirection(v); }
	if (props.flexWrap !== undefined) { const v = WRAP[props.flexWrap]; if (v !== undefined) node.setFlexWrap(v); }
	if (props.justifyContent !== undefined) { const v = JUSTIFY[props.justifyContent]; if (v !== undefined) node.setJustifyContent(v); }
	if (props.alignItems !== undefined) { const v = ALIGN[props.alignItems]; if (v !== undefined) node.setAlignItems(v); }
	if (props.alignSelf !== undefined) { const v = ALIGN[props.alignSelf]; if (v !== undefined) node.setAlignSelf(v); }
	if (typeof props.flex === 'number') node.setFlex(props.flex);
	if (typeof props.flexGrow === 'number') node.setFlexGrow(props.flexGrow);
	if (typeof props.flexShrink === 'number') node.setFlexShrink(props.flexShrink);
	if (props.flexBasis !== undefined) {
		if (typeof props.flexBasis === 'number') node.setFlexBasis(props.flexBasis);
		else { const pct = parseFloat(props.flexBasis); if (!isNaN(pct)) node.setFlexBasisPercent(pct); }
	}
	setDimension(node, 'width', props.width);
	setDimension(node, 'height', props.height);
	setDimension(node, 'minWidth', props.minWidth);
	setDimension(node, 'maxWidth', props.maxWidth);
	setDimension(node, 'minHeight', props.minHeight);
	setDimension(node, 'maxHeight', props.maxHeight);
	if (typeof props.gap === 'number') node.setGap(GUTTER_ALL, props.gap);
	if (typeof props.margin === 'number') node.setMargin(EDGE_ALL, props.margin);
	setEdge(node, 'setMargin', EDGE_TOP, props.marginTop);
	setEdge(node, 'setMargin', EDGE_BOTTOM, props.marginBottom);
	setEdge(node, 'setMargin', EDGE_LEFT, props.marginLeft);
	setEdge(node, 'setMargin', EDGE_RIGHT, props.marginRight);
	if (typeof props.padding === 'number') node.setPadding(EDGE_ALL, props.padding);
	setEdge(node, 'setPadding', EDGE_TOP, props.paddingTop);
	setEdge(node, 'setPadding', EDGE_BOTTOM, props.paddingBottom);
	setEdge(node, 'setPadding', EDGE_LEFT, props.paddingLeft);
	setEdge(node, 'setPadding', EDGE_RIGHT, props.paddingRight);
	if (props.position !== undefined) { const v = POSITION[props.position]; if (v !== undefined) node.setPositionType(v); }
	setEdge(node, 'setPosition', EDGE_TOP, props.top);
	setEdge(node, 'setPosition', EDGE_BOTTOM, props.bottom);
	setEdge(node, 'setPosition', EDGE_LEFT, props.left);
	setEdge(node, 'setPosition', EDGE_RIGHT, props.right);
	if (props.display !== undefined) { const v = DISPLAY[props.display]; if (v !== undefined) node.setDisplay(v); }
	if (props.overflow !== undefined) { const v = OVERFLOW[props.overflow]; if (v !== undefined) node.setOverflow(v); }
	if (typeof props.aspectRatio === 'number') node.setAspectRatio(props.aspectRatio);
}

function computeAbsoluteLayout(node: YogaNode): Layout {
	const computed = node.getComputedLayout();
	if (computed.width == null || computed.height == null || isNaN(computed.width) || isNaN(computed.height)) {
		return { x: 0, y: 0, width: 0, height: 0 };
	}
	let left = computed.left ?? 0;
	let top = computed.top ?? 0;
	let parent = node.getParent();
	while (parent) {
		left += parent.getComputedLeft() ?? 0;
		top += parent.getComputedTop() ?? 0;
		parent = parent.getParent();
	}
	return { x: left, y: top, width: computed.width, height: computed.height };
}

function layoutsEqual(a: Layout, b: Layout): boolean {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// ─── Components ───

/**
 * Internal component: provides the FlexTreeManager for a Flex tree.
 */
function FlexTreeProvider({
	yoga,
	yogaConfig,
	children,
}: PropsWithChildren<{ yoga: Yoga; yogaConfig: YogaConfig }>) {
	const managerRef = useRef<FlexTreeManager | null>(null);
	if (!managerRef.current) {
		const rootNode = yoga.Node.createWithConfig(yogaConfig);
		const subscribers = new Set<() => void>();
		managerRef.current = {
			yoga,
			yogaConfig,
			rootNode,
			subscribers,
			subscribe(cb: () => void) {
				subscribers.add(cb);
				return () => { subscribers.delete(cb); };
			},
			recalculate(width: number, height: number) {
				rootNode.calculateLayout(width, height, DIRECTION_LTR);
				for (const cb of subscribers) cb();
			},
		};
	}

	// Cleanup root node on unmount
	useLayoutEffect(() => {
		const manager = managerRef.current!;
		return () => {
			manager.rootNode.free();
		};
	}, []);

	return (
		<FlexTreeContext.Provider value={managerRef.current}>
			{children}
		</FlexTreeContext.Provider>
	);
}

/**
 * Internal: renders a single Flex node (root or child).
 */
function FlexNode({
	children,
	isRoot,
	...flexProps
}: PropsWithChildren<FlexProps & { isRoot: boolean }>) {
	const treeManager = useContext(FlexTreeContext)!;
	const parentYogaNode = useContext(FlexNodeContext);
	const dims = useDimensions();
	const nodeRef = useRef<YogaNode | null>(null);
	const [layout, setLayout] = useState<Layout>({ x: 0, y: 0, width: 0, height: 0 });

	// For root nodes, use the tree manager's root node.
	// For child nodes, create a new yoga node.
	if (isRoot) {
		nodeRef.current = treeManager.rootNode;
	} else if (!nodeRef.current) {
		nodeRef.current = treeManager.yoga.Node.createWithConfig(treeManager.yogaConfig);
	}
	const node = nodeRef.current!;

	// Apply yoga properties every render
	applyYogaProps(node, flexProps);

	// Child: insert into parent yoga node on mount
	useLayoutEffect(() => {
		if (isRoot || !parentYogaNode) return;
		parentYogaNode.insertChild(node, parentYogaNode.getChildCount());
		return () => {
			parentYogaNode.removeChild(node);
		};
	}, [isRoot, parentYogaNode, node]);

	// Root: calculate layout (runs after children have inserted their nodes)
	useLayoutEffect(() => {
		if (!isRoot) return;
		treeManager.recalculate(dims.width, dims.height);
	});

	// Subscribe to layout recalculations
	useLayoutEffect(() => {
		const updateLayout = () => {
			if (!nodeRef.current) return;
			const newLayout = computeAbsoluteLayout(nodeRef.current);
			setLayout((prev) => (layoutsEqual(prev, newLayout) ? prev : newLayout));
		};

		// Read layout immediately
		updateLayout();

		// Subscribe to future recalculations
		return treeManager.subscribe(updateLayout);
	}, [treeManager]);

	// Cleanup child yoga node on unmount
	useLayoutEffect(() => {
		if (isRoot) return; // Root node is managed by FlexTreeProvider
		return () => {
			if (nodeRef.current) {
				nodeRef.current.free();
				nodeRef.current = null;
			}
		};
	}, [isRoot]);

	return (
		<FlexNodeContext.Provider value={node}>
			<LayoutContext.Provider value={layout}>
				{children}
			</LayoutContext.Provider>
		</FlexNodeContext.Provider>
	);
}

// ─── Public API ───

export interface FlexComponent {
	(props: PropsWithChildren<FlexProps>): React.JSX.Element;
	Text: (props: FlexTextProps) => React.JSX.Element;
	displayName: string;
}

export type FlexTextProps = Omit<_TextProps, 'value'> & {
	children?: string | number | (string | number)[];
	fontFamily?: string;
	fontWeight?: string | number;
	fontSize?: number;
	fill?: string;
	stroke?: string;
};

/**
 * Create a `<Flex>` component powered by Yoga layout.
 *
 * @param yogaInstance - An initialized yoga-wasm-web instance
 * @returns A `Flex` component with a `Flex.Text` subcomponent
 *
 * @example
 * ```tsx
 * import initYoga from 'yoga-wasm-web/asm';
 * import { createFlex } from 'react-tela/flex';
 *
 * const yoga = initYoga();
 * const Flex = createFlex(yoga);
 * ```
 */
export function createFlex(yogaInstance: any): FlexComponent {
	const y = yogaInstance as Yoga;
	const config = y.Config.create();
	config.setPointScaleFactor(0);

	const FlexImpl = ({ children, ...flexProps }: PropsWithChildren<FlexProps>) => {
		const existingTree = useContext(FlexTreeContext);
		const isRoot = !existingTree;

		if (isRoot) {
			return (
				<FlexTreeProvider yoga={y} yogaConfig={config}>
					<FlexNode isRoot={true} {...flexProps}>
						{children}
					</FlexNode>
				</FlexTreeProvider>
			);
		}

		return (
			<FlexNode isRoot={false} {...flexProps}>
				{children}
			</FlexNode>
		);
	};
	FlexImpl.displayName = 'Flex';

	const FlexText = ({ children, fontFamily, fontWeight, fontSize, ...rest }: FlexTextProps) => {
		const text = children == null ? '' : Array.isArray(children) ? children.map(String).join('') : String(children);
		const metrics = useTextMetrics(text, fontFamily, fontSize, fontWeight ?? '');
		return (
			<FlexImpl width={metrics.width} height={fontSize ?? 24}>
				<Text fontFamily={fontFamily} fontWeight={typeof fontWeight === 'string' ? fontWeight : undefined} fontSize={fontSize} {...rest}>
					{text}
				</Text>
			</FlexImpl>
		);
	};
	FlexText.displayName = 'Flex.Text';

	const Flex = FlexImpl as FlexComponent;
	Flex.Text = FlexText;
	Flex.displayName = 'Flex';
	return Flex;
}
