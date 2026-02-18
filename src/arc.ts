import { Shape, type ShapeProps } from './shape.js';
import { degreesToRadians } from './util.js';
import type { IPath2D } from './types.js';

/**
 * Props for the {@link Arc} component.
 *
 * Defines a circular arc with a center point, radius, and angular range.
 * Angles are specified in **degrees** (converted internally to radians).
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc | MDN arc()}
 */
export type ArcProps = Omit<ShapeProps, 'width' | 'height'> & {
	/** The start angle of the arc in degrees. */
	startAngle: number;
	/** The end angle of the arc in degrees. */
	endAngle: number;
	/** The radius of the arc in pixels. */
	radius: number;
	/** If `true`, the arc is drawn counterclockwise. @default false */
	counterclockwise?: boolean;
};

/**
 * Renders a circular arc on the canvas.
 *
 * @example
 * ```tsx
 * // Draw a semicircle
 * <Arc x={50} y={50} radius={40} startAngle={0} endAngle={180} fill="red" />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc | MDN arc()}
 */
export class Arc extends Shape {
	#startAngle: number;
	#endAngle: number;
	#counterclockwise?: boolean;
	#radius: number;

	get radius() {
		return this.#radius;
	}

	set radius(v: number) {
		if (this.#radius !== v) {
			this.width = this.height = v * 2;
			this.#radius = v;
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

	constructor(opts: ArcProps) {
		const r2 = opts.radius * 2;
		super({
			...opts,
			width: r2,
			height: r2,
		});
		this.#startAngle = opts.startAngle;
		this.#endAngle = opts.endAngle;
		this.#counterclockwise = opts.counterclockwise;
		this.#radius = opts.radius;
	}

	_buildPath(): IPath2D {
		const p = new this.root.Path2D();
		p.arc(
			this.#radius,
			this.#radius,
			this.#radius,
			degreesToRadians(this.#startAngle),
			degreesToRadians(this.#endAngle),
			this.#counterclockwise,
		);
		return p;
	}
}
