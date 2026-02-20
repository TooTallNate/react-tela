export { Entity, type EntityProps } from './entity.js';
export { TelaEventTarget } from './event-target.js';
export { proxyEvents } from './events.js';
export { Root, type RootParams } from './root.js';
export { Canvas, type CanvasProps } from './canvas.js';
export { Shape, type ShapeProps, resolveFillStroke, type FillStrokeStyle, type FillStrokeInput } from './shape.js';
export { Rect, type RectProps } from './rect.js';
export { RoundRect, type RoundRectProps } from './round-rect.js';
export { Arc, type ArcProps } from './arc.js';
export { Ellipse, type EllipseProps } from './ellipse.js';
export { Path, type PathProps } from './path.js';
export { Image, type ImageProps } from './image.js';
export { Text, type TextProps, type TextOverflow } from './text.js';
export { Group, GroupRoot, type GroupProps } from './group.js';
export { Line, type LineProps } from './line.js';
export { BezierCurve, type BezierCurveProps } from './bezier-curve.js';
export { QuadraticCurve, type QuadraticCurveProps } from './quadratic-curve.js';
export { Pattern, type PatternProps, type PatternRepetition } from './pattern.js';
export { cloneMouseEvent, cloneTouchEvent, degreesToRadians, findTarget, getLayer } from './util.js';
export type {
	ICanvas,
	ICanvasRenderingContext2D,
	IDOMMatrix,
	IPath2D,
	IImage,
	Point,
	TelaMouseEvent,
	ColorStop,
} from './types.js';
