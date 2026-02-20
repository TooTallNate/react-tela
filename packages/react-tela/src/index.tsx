import React, {
	createElement,
	forwardRef,
	useRef,
	type PropsWithChildren,
} from 'react';
import { ParentContext, useParent } from './hooks/use-parent.js';
import { Canvas as _Canvas, type CanvasProps } from './canvas.js';
import {
	GroupRoot,
	Group as _Group,
	type GroupProps as _GroupProps,
} from './group.js';
import {
	Pattern as _Pattern,
	type PatternProps as _PatternProps,
} from './pattern.js';
import { Rect as _Rect, type RectProps } from './rect.js';
import { RoundRect as _RoundRect, type RoundRectProps } from './round-rect.js';
import { Arc as _Arc, type ArcProps } from './arc.js';
import { Ellipse as _Ellipse, type EllipseProps } from './ellipse.js';
import { Path as _Path, type PathProps } from './path.js';
import { Image as _Image, type ImageProps } from './image.js';
import { BezierCurve as _BezierCurve, type BezierCurveProps } from './bezier-curve.js';
import { Line as _Line, type LineProps } from './line.js';
import { QuadraticCurve as _QuadraticCurve, type QuadraticCurveProps } from './quadratic-curve.js';
import { Text as _Text, type TextProps as _TextProps } from './text.js';
import { ICanvas } from './types.js';
import {
	DEFAULT_LAYOUT,
	LayoutContext,
	useLayout,
} from './hooks/use-layout.js';
import { EntityProps } from './entity.js';

type MaybeArray<T> = T | T[];

function useAdjustedLayout(props: any) {
	const layout = useLayout();
	// Fast path: when no Flex layout is active, the context is the
	// default frozen singleton. Skip the object spread entirely.
	if (layout === DEFAULT_LAYOUT) {
		return props;
	}
	return {
		...props,
		x: layout.x + (props.x ?? 0),
		y: layout.y + (props.y ?? 0),
		width: layout.width + (props.width ?? 0),
		height: layout.height + (props.height ?? 0),
	};
}

const factory = <Ref, Props extends EntityProps>(type: string) => {
	const c = forwardRef<Ref, Props>((props, ref) => {
		const adjusted = useAdjustedLayout(props);
		return createElement(type, adjusted === props ? { ...props, ref } : { ...adjusted, ref });
	});
	c.displayName = type;
	return c;
};

/** Props for the `<Group>` component. Extends {@link EntityProps} and accepts children. */
export type GroupProps = PropsWithChildren<_GroupProps>;
/** Props for the `<Pattern>` component. Extends {@link GroupProps} with pattern-specific properties. */
export type PatternProps = PropsWithChildren<_PatternProps>;
export {
	ArcProps,
	BezierCurveProps,
	CanvasProps,
	EllipseProps,
	RectProps,
	RoundRectProps,
	PathProps,
	ImageProps,
	LineProps,
	QuadraticCurveProps,
};
export type { _Canvas as CanvasRef };

/** Renders a cubic Bézier curve. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo | MDN bezierCurveTo()} */
export const BezierCurve = factory<_BezierCurve, BezierCurveProps>('BezierCurve');
/** An offscreen sub-canvas entity for imperative 2D drawing. */
export const Canvas = factory<_Canvas, CanvasProps>('Canvas');
/** Renders an ellipse. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/ellipse | MDN ellipse()} */
export const Ellipse = factory<_Ellipse, EllipseProps>('Ellipse');
/** Renders an image from a URL. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage | MDN drawImage()} */
export const Image = factory<_Image, ImageProps>('Image');
/** Renders a polyline through a series of points. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo | MDN lineTo()} */
export const Line = factory<_Line, LineProps>('Line');
/** Renders an SVG path. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Path2D | MDN Path2D} */
export const Path = factory<_Path, PathProps>('Path');
/** Renders a quadratic Bézier curve. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo | MDN quadraticCurveTo()} */
export const QuadraticCurve = factory<_QuadraticCurve, QuadraticCurveProps>('QuadraticCurve');
/** Renders a rectangle. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect | MDN rect()} */
export const Rect = factory<_Rect, RectProps>('Rect');
/** Renders a rectangle with rounded corners. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect | MDN roundRect()} */
export const RoundRect = factory<_RoundRect, RoundRectProps>('RoundRect');

/**
 * Props for the `<Text>` component.
 *
 * Accepts children (strings/numbers) instead of a `value` prop.
 *
 * @example
 * ```tsx
 * <Text fontSize={32} fill="black">Hello, World!</Text>
 * ```
 */
export type TextProps = Omit<_TextProps, 'value'> & {
	children?: MaybeArray<string | number>;
};
/** Renders text on the canvas. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText | MDN fillText()} */
export const Text = factory<_Text, TextProps>('Text');

/**
 * Renders a circular arc. When used inside a Flex layout, the radius is
 * derived from the layout dimensions if not explicitly set.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc | MDN arc()}
 */
export const Arc = forwardRef<_Arc, ArcProps>((props, ref) => {
	const adjusted = useAdjustedLayout(props);
	const x = adjusted === props ? (props.x ?? 0) : adjusted.x;
	const y = adjusted === props ? (props.y ?? 0) : adjusted.y;
	const w = adjusted === props ? 0 : adjusted.width;
	const h = adjusted === props ? 0 : adjusted.height;
	const radius = props.radius ?? Math.min(w, h) / 2;
	return createElement('Arc', {
		...props,
		x,
		y,
		radius,
		ref,
	});
});
Arc.displayName = 'Arc';

/**
 * Props for the `<Circle>` component.
 *
 * A Circle is an Arc with `startAngle=0` and `endAngle=360`.
 */
export type CircleProps = Omit<
	ArcProps,
	'startAngle' | 'endAngle' | 'counterclockwise'
>;

/**
 * Renders a full circle (a complete arc from 0° to 360°).
 *
 * @example
 * ```tsx
 * <Circle x={100} y={100} radius={50} fill="red" />
 * ```
 */
export const Circle = forwardRef<_Arc, CircleProps>((props, ref) => {
	return <Arc {...props} ref={ref} startAngle={0} endAngle={360} />;
});
Circle.displayName = 'Circle';

/**
 * Groups child entities into an isolated offscreen canvas with its own
 * coordinate system, then composites the result into the parent.
 *
 * @example
 * ```tsx
 * <Group x={50} y={50} alpha={0.8}>
 *   <Rect width={40} height={40} fill="red" />
 * </Group>
 * ```
 */
export const Group = forwardRef<_Group, GroupProps>((props, ref) => {
	const root = useParent();
	const rootRef = useRef<GroupRoot>();
	let canvas: ICanvas;
	const adjusted = useAdjustedLayout(props);
	const w = adjusted === props ? (props.width ?? 0) : adjusted.width;
	const h = adjusted === props ? (props.height ?? 0) : adjusted.height;
	if (rootRef.current) {
		canvas = rootRef.current.ctx.canvas;
	} else {
		canvas = new root.Canvas(w || 300, h || 150);
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Could not get "2d" canvas context');
		}
		rootRef.current = new GroupRoot(ctx, root);
	}
	if (w > 0 && w !== canvas.width) {
		canvas.width = w;
	}
	if (h > 0 && h !== canvas.height) {
		canvas.height = h;
	}
	return (
		<ParentContext.Provider value={rootRef.current}>
			<LayoutContext.Provider value={DEFAULT_LAYOUT}>
				{createElement('Group', {
					...(adjusted === props ? props : adjusted),
					root: rootRef.current,
					ref,
				})}
			</LayoutContext.Provider>
		</ParentContext.Provider>
	);
});
Group.displayName = 'Group';

/**
 * Renders children to an offscreen canvas and creates a `CanvasPattern`.
 * Use the ref as a `fill` or `stroke` on other shapes.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createPattern | MDN createPattern()}
 */
export const Pattern = forwardRef<_Pattern, PatternProps>(
	(props, ref) => {
		const root = useParent();
		const rootRef = useRef<GroupRoot>();
		let canvas: ICanvas;
		const adjusted = useAdjustedLayout(props);
		const w = adjusted === props ? props.width : adjusted.width;
		const h = adjusted === props ? props.height : adjusted.height;
		if (rootRef.current) {
			canvas = rootRef.current.ctx.canvas;
		} else {
			canvas = new root.Canvas(w, h);
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				throw new Error('Could not get "2d" canvas context');
			}
			rootRef.current = new GroupRoot(ctx, root);
		}
		if (w > 0 && w !== canvas.width) {
			canvas.width = w;
		}
		if (h > 0 && h !== canvas.height) {
			canvas.height = h;
		}
		return (
			<ParentContext.Provider value={rootRef.current}>
				<LayoutContext.Provider value={DEFAULT_LAYOUT}>
					{createElement('Pattern', {
						...(adjusted === props ? props : adjusted),
						root: rootRef.current,
						ref,
					})}
				</LayoutContext.Provider>
			</ParentContext.Provider>
		);
	},
);
Pattern.displayName = 'Pattern';

export { type ColorStop } from './types.js';
export { type FillStrokeStyle, type FillStrokeInput } from './shape.js';
export { type PatternRepetition } from './pattern.js';
export { type TextOverflow } from './text.js';
export {
	useLinearGradient,
	useRadialGradient,
	useConicGradient,
} from './hooks/use-gradient.js';
export { useParent } from './hooks/use-parent.js';
export { useLayout, LayoutContext, type Layout } from './hooks/use-layout.js';
export { useDimensions } from './hooks/use-dimensions.js';
export { useTextMetrics } from './hooks/use-text-metrics.js';
export { usePattern } from './hooks/use-pattern.js';
