import { Shape, type ShapeProps } from './shape.js';
import type { IPath2D } from './types.js';

/**
 * Props for the {@link RoundRect} component.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect | MDN roundRect()}
 */
export type RoundRectProps = ShapeProps & {
	/**
	 * Corner radii. A single number applies to all corners; an array specifies
	 * individual corners (top-left, top-right, bottom-right, bottom-left).
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect | MDN roundRect()}
	 */
	radii?: number | DOMPointInit | (number | DOMPointInit)[];
};

/**
 * Renders a rectangle with rounded corners on the canvas.
 *
 * @example
 * ```tsx
 * <RoundRect x={10} y={10} width={100} height={60} radii={10} fill="green" />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect | MDN roundRect()}
 */
export class RoundRect extends Shape {
	#radii?: number | DOMPointInit | (number | DOMPointInit)[];

	get radii() {
		return this.#radii;
	}

	set radii(v: number | DOMPointInit | (number | DOMPointInit)[] | undefined) {
		this.#radii = v;
		this._pathDirty = true;
	}

	constructor(opts: RoundRectProps) {
		super(opts);
		this.#radii = opts.radii;
	}

	_buildPath(): IPath2D {
		const p = new this.root.Path2D();
		p.roundRect(0, 0, this.width, this.height, this.#radii);
		return p;
	}
}
