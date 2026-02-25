import { Shape, type ShapeProps } from './shape.js';
import type { IPath2D } from './types.js';

/**
 * Props for the {@link Rect} component.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect | MDN rect()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect | MDN roundRect()}
 */
export type RectProps = ShapeProps & {
	/**
	 * Corner radii. When set, the rectangle is rendered with rounded corners
	 * via `ctx.roundRect()`. A single number applies to all corners; an array
	 * specifies individual corners (top-left, top-right, bottom-right, bottom-left).
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect | MDN roundRect()}
	 */
	borderRadius?: number | DOMPointInit | (number | DOMPointInit)[];
};

/**
 * Renders a rectangle on the canvas, optionally with rounded corners.
 *
 * @example
 * ```tsx
 * <Rect x={10} y={10} width={100} height={60} fill="blue" stroke="black" />
 * ```
 *
 * @example
 * ```tsx
 * <Rect x={10} y={10} width={100} height={60} borderRadius={10} fill="green" />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect | MDN rect()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect | MDN roundRect()}
 */
export class Rect extends Shape {
	#borderRadius?: number | DOMPointInit | (number | DOMPointInit)[];

	get borderRadius() {
		return this.#borderRadius;
	}

	set borderRadius(
		v: number | DOMPointInit | (number | DOMPointInit)[] | undefined,
	) {
		this.#borderRadius = v;
		this._pathDirty = true;
	}

	constructor(opts: RectProps) {
		super(opts);
		this.#borderRadius = opts.borderRadius;
	}

	_buildPath(): IPath2D {
		const p = new this.root.Path2D();
		if (this.#borderRadius !== undefined) {
			p.roundRect(0, 0, this.width, this.height, this.#borderRadius);
		} else {
			p.rect(0, 0, this.width, this.height);
		}
		return p;
	}
}
