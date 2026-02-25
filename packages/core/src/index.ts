export { Arc, type ArcProps } from './arc.js';
export { BezierCurve, type BezierCurveProps } from './bezier-curve.js';
export { Canvas, type CanvasProps } from './canvas.js';
export { Ellipse, type EllipseProps } from './ellipse.js';
export { Entity, type EntityProps } from './entity.js';
export { TelaEventTarget } from './event-target.js';
export { proxyEvents } from './events.js';
export { Group, type GroupProps, GroupRoot } from './group.js';
export { Image, type ImageProps } from './image.js';
export { Line, type LineProps } from './line.js';
export { Path, type PathProps } from './path.js';
export {
	Pattern,
	type PatternProps,
	type PatternRepetition,
} from './pattern.js';
export { QuadraticCurve, type QuadraticCurveProps } from './quadratic-curve.js';
export { Rect, type RectProps } from './rect.js';
export { Root, type RootParams } from './root.js';
/**
 * @deprecated Use `Rect` with `borderRadius` instead.
 */
export { Rect as RoundRect } from './rect.js';
/**
 * @deprecated Use `RectProps` with `borderRadius` instead.
 */
export type { RectProps as RoundRectProps } from './rect.js';
export {
	type FillStrokeInput,
	type FillStrokeStyle,
	resolveFillStroke,
	Shape,
	type ShapeProps,
} from './shape.js';
export {
	formatFontFamily,
	Text,
	type TextOverflow,
	type TextProps,
} from './text.js';
export type {
	ColorStop,
	ICanvas,
	ICanvasRenderingContext2D,
	IDOMMatrix,
	IImage,
	IPath2D,
	Point,
	TelaMouseEvent,
} from './types.js';
export {
	cloneMouseEvent,
	cloneTouchEvent,
	degreesToRadians,
	findTarget,
	getLayer,
} from './util.js';
