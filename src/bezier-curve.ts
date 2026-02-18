import { Shape, type ShapeProps } from './shape.js';
import type { IPath2D } from './types.js';

/**
 * Props for the {@link BezierCurve} component.
 *
 * Defines a cubic Bézier curve from point `(x0, y0)` to `(x1, y1)`
 * using two control points `(cp1x, cp1y)` and `(cp2x, cp2y)`.
 *
 * Inherits all shape styling props (fill, stroke, opacity, etc.)
 * except `width` and `height`, which are computed from the curve's bounding box.
 */
export type BezierCurveProps = Omit<ShapeProps, 'width' | 'height'> & {
	/** The x-coordinate of the start point. */
	x0: number;
	/** The y-coordinate of the start point. */
	y0: number;
	/** The x-coordinate of the first control point. */
	cp1x: number;
	/** The y-coordinate of the first control point. */
	cp1y: number;
	/** The x-coordinate of the second control point. */
	cp2x: number;
	/** The y-coordinate of the second control point. */
	cp2y: number;
	/** The x-coordinate of the end point. */
	x1: number;
	/** The y-coordinate of the end point. */
	y1: number;
};

/**
 * Renders a cubic Bézier curve on the canvas.
 *
 * A cubic Bézier curve is defined by a start point, an end point, and two
 * control points that determine the shape of the curve. This corresponds
 * to the Canvas 2D API's
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo | bezierCurveTo()} method.
 *
 * @example
 * ```tsx
 * <BezierCurve
 *   x0={10} y0={100}
 *   cp1x={30} cp1y={10}
 *   cp2x={70} cp2y={10}
 *   x1={90} y1={100}
 *   stroke="blue"
 *   lineWidth={2}
 * />
 * ```
 */
export class BezierCurve extends Shape {
	#x0: number;
	#y0: number;
	#cp1x: number;
	#cp1y: number;
	#cp2x: number;
	#cp2y: number;
	#x1: number;
	#y1: number;

	/** The x-coordinate of the start point. */
	get x0() { return this.#x0; }
	set x0(v: number) { if (this.#x0 !== v) { this.#x0 = v; this._pathDirty = true; } }

	/** The y-coordinate of the start point. */
	get y0() { return this.#y0; }
	set y0(v: number) { if (this.#y0 !== v) { this.#y0 = v; this._pathDirty = true; } }

	/** The x-coordinate of the first control point. */
	get cp1x() { return this.#cp1x; }
	set cp1x(v: number) { if (this.#cp1x !== v) { this.#cp1x = v; this._pathDirty = true; } }

	/** The y-coordinate of the first control point. */
	get cp1y() { return this.#cp1y; }
	set cp1y(v: number) { if (this.#cp1y !== v) { this.#cp1y = v; this._pathDirty = true; } }

	/** The x-coordinate of the second control point. */
	get cp2x() { return this.#cp2x; }
	set cp2x(v: number) { if (this.#cp2x !== v) { this.#cp2x = v; this._pathDirty = true; } }

	/** The y-coordinate of the second control point. */
	get cp2y() { return this.#cp2y; }
	set cp2y(v: number) { if (this.#cp2y !== v) { this.#cp2y = v; this._pathDirty = true; } }

	/** The x-coordinate of the end point. */
	get x1() { return this.#x1; }
	set x1(v: number) { if (this.#x1 !== v) { this.#x1 = v; this._pathDirty = true; } }

	/** The y-coordinate of the end point. */
	get y1() { return this.#y1; }
	set y1(v: number) { if (this.#y1 !== v) { this.#y1 = v; this._pathDirty = true; } }

	constructor(opts: BezierCurveProps) {
		const xs = [opts.x0, opts.cp1x, opts.cp2x, opts.x1];
		const ys = [opts.y0, opts.cp1y, opts.cp2y, opts.y1];
		const minX = Math.min(...xs);
		const minY = Math.min(...ys);
		const maxX = Math.max(...xs);
		const maxY = Math.max(...ys);
		super({
			...opts,
			width: maxX - minX,
			height: maxY - minY,
		});
		this.#x0 = opts.x0;
		this.#y0 = opts.y0;
		this.#cp1x = opts.cp1x;
		this.#cp1y = opts.cp1y;
		this.#cp2x = opts.cp2x;
		this.#cp2y = opts.cp2y;
		this.#x1 = opts.x1;
		this.#y1 = opts.y1;
	}

	_buildPath(): IPath2D {
		const p = new this.root.Path2D();
		p.moveTo(this.#x0, this.#y0);
		p.bezierCurveTo(
			this.#cp1x,
			this.#cp1y,
			this.#cp2x,
			this.#cp2y,
			this.#x1,
			this.#y1,
		);
		return p;
	}
}
