import { Shape, type ShapeProps } from './shape.js';
import type { IPath2D } from './types.js';

/**
 * Props for the {@link QuadraticCurve} component.
 *
 * Defines a quadratic Bézier curve from point `(x0, y0)` to `(x1, y1)`
 * using a single control point `(cpx, cpy)`.
 *
 * Inherits all shape styling props (fill, stroke, opacity, etc.)
 * except `width` and `height`, which are computed from the curve's bounding box.
 */
export type QuadraticCurveProps = Omit<ShapeProps, 'width' | 'height'> & {
	/** The x-coordinate of the start point. */
	x0: number;
	/** The y-coordinate of the start point. */
	y0: number;
	/** The x-coordinate of the control point. */
	cpx: number;
	/** The y-coordinate of the control point. */
	cpy: number;
	/** The x-coordinate of the end point. */
	x1: number;
	/** The y-coordinate of the end point. */
	y1: number;
};

/**
 * Renders a quadratic Bézier curve on the canvas.
 *
 * A quadratic Bézier curve is defined by a start point, an end point, and a
 * single control point that determines the shape of the curve. This corresponds
 * to the Canvas 2D API's
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo | quadraticCurveTo()} method.
 *
 * @example
 * ```tsx
 * <QuadraticCurve
 *   x0={10} y0={100}
 *   cpx={50} cpy={10}
 *   x1={90} y1={100}
 *   stroke="red"
 *   lineWidth={2}
 * />
 * ```
 */
export class QuadraticCurve extends Shape {
	#x0: number;
	#y0: number;
	#cpx: number;
	#cpy: number;
	#x1: number;
	#y1: number;

	/** The x-coordinate of the start point. */
	get x0() {
		return this.#x0;
	}
	set x0(v: number) {
		if (this.#x0 !== v) {
			this.#x0 = v;
			this._pathDirty = true;
		}
	}

	/** The y-coordinate of the start point. */
	get y0() {
		return this.#y0;
	}
	set y0(v: number) {
		if (this.#y0 !== v) {
			this.#y0 = v;
			this._pathDirty = true;
		}
	}

	/** The x-coordinate of the control point. */
	get cpx() {
		return this.#cpx;
	}
	set cpx(v: number) {
		if (this.#cpx !== v) {
			this.#cpx = v;
			this._pathDirty = true;
		}
	}

	/** The y-coordinate of the control point. */
	get cpy() {
		return this.#cpy;
	}
	set cpy(v: number) {
		if (this.#cpy !== v) {
			this.#cpy = v;
			this._pathDirty = true;
		}
	}

	/** The x-coordinate of the end point. */
	get x1() {
		return this.#x1;
	}
	set x1(v: number) {
		if (this.#x1 !== v) {
			this.#x1 = v;
			this._pathDirty = true;
		}
	}

	/** The y-coordinate of the end point. */
	get y1() {
		return this.#y1;
	}
	set y1(v: number) {
		if (this.#y1 !== v) {
			this.#y1 = v;
			this._pathDirty = true;
		}
	}

	constructor(opts: QuadraticCurveProps) {
		const xs = [opts.x0, opts.cpx, opts.x1];
		const ys = [opts.y0, opts.cpy, opts.y1];
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
		this.#cpx = opts.cpx;
		this.#cpy = opts.cpy;
		this.#x1 = opts.x1;
		this.#y1 = opts.y1;
	}

	_buildPath(): IPath2D {
		const p = new this.root.Path2D();
		p.moveTo(this.#x0, this.#y0);
		p.quadraticCurveTo(this.#cpx, this.#cpy, this.#x1, this.#y1);
		return p;
	}
}
