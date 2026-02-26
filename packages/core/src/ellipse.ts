import { Shape, type ShapeProps } from './shape.js';
import type { IPath2D } from './types.js';
import { degreesToRadians } from './util.js';

/**
 * Props for the {@link Ellipse} component.
 *
 * Defines an ellipse with separate x and y radii. Angles are in **degrees**.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/ellipse | MDN ellipse()}
 */
export type EllipseProps = Omit<ShapeProps, 'width' | 'height'> & {
	/** The horizontal radius. */
	radiusX: number;
	/** The vertical radius. */
	radiusY: number;
	/** Rotation of the ellipse in degrees. Named to avoid collision with Entity's `rotate`. */
	ellipseRotation?: number;
	/** The start angle in degrees. @default 0 */
	startAngle?: number;
	/** The end angle in degrees. @default 360 */
	endAngle?: number;
	/** If `true`, draw counterclockwise. @default false */
	counterclockwise?: boolean;
};

/**
 * Renders an ellipse on the canvas.
 *
 * @example
 * ```tsx
 * <Ellipse x={100} y={75} radiusX={50} radiusY={30} fill="purple" />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/ellipse | MDN ellipse()}
 */
export class Ellipse extends Shape {
	#radiusX: number;
	#radiusY: number;
	#ellipseRotation: number;
	#startAngle: number;
	#endAngle: number;
	#counterclockwise?: boolean;

	get radiusX() {
		return this.#radiusX;
	}

	set radiusX(v: number) {
		if (this.#radiusX !== v) {
			this.width = v * 2;
			this.#radiusX = v;
			this._pathDirty = true;
		}
	}

	get radiusY() {
		return this.#radiusY;
	}

	set radiusY(v: number) {
		if (this.#radiusY !== v) {
			this.height = v * 2;
			this.#radiusY = v;
			this._pathDirty = true;
		}
	}

	get ellipseRotation() {
		return this.#ellipseRotation;
	}

	set ellipseRotation(v: number) {
		if (this.#ellipseRotation !== v) {
			this.#ellipseRotation = v;
			this._pathDirty = true;
		}
	}

	get startAngle() {
		return this.#startAngle;
	}

	set startAngle(v: number) {
		if (this.#startAngle !== v) {
			this.#startAngle = v;
			this._pathDirty = true;
		}
	}

	get endAngle() {
		return this.#endAngle;
	}

	set endAngle(v: number) {
		if (this.#endAngle !== v) {
			this.#endAngle = v;
			this._pathDirty = true;
		}
	}

	get counterclockwise() {
		return this.#counterclockwise;
	}

	set counterclockwise(v: boolean | undefined) {
		if (this.#counterclockwise !== v) {
			this.#counterclockwise = v;
			this._pathDirty = true;
		}
	}

	constructor(opts: EllipseProps) {
		super({
			...opts,
			width: opts.radiusX * 2,
			height: opts.radiusY * 2,
		});
		this.#radiusX = opts.radiusX;
		this.#radiusY = opts.radiusY;
		this.#ellipseRotation = opts.ellipseRotation ?? 0;
		this.#startAngle = opts.startAngle ?? 0;
		this.#endAngle = opts.endAngle ?? 360;
		this.#counterclockwise = opts.counterclockwise;
	}

	_buildPath(): IPath2D {
		const p = new this.root.Path2D();
		p.ellipse(
			this.#radiusX,
			this.#radiusY,
			this.#radiusX,
			this.#radiusY,
			degreesToRadians(this.#ellipseRotation),
			degreesToRadians(this.#startAngle),
			degreesToRadians(this.#endAngle),
			this.#counterclockwise,
		);
		return p;
	}
}
