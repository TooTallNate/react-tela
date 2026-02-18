// @ts-expect-error No types for "parse-svg-path"
import parseSvgPath from 'parse-svg-path';
import { Shape, type ShapeProps } from './shape.js';
import type { IPath2D } from './types.js';

/**
 * Props for the {@link Path} component.
 *
 * Renders an SVG path string (`d` attribute) on the canvas.
 */
export type PathProps = ShapeProps & {
	/** The width of the path's bounding box. */
	width: number;
	/** The height of the path's bounding box. */
	height: number;
	/**
	 * An SVG path data string (e.g. `"M10 80 C 40 10, 65 10, 95 80"`).
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d | MDN SVG d attribute}
	 */
	d: string;
};

/**
 * Renders an SVG path on the canvas using a `d` (path data) string.
 *
 * @example
 * ```tsx
 * <Path
 *   width={100} height={100}
 *   d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
 *   stroke="navy"
 *   lineWidth={2}
 * />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Path2D/Path2D | MDN Path2D}
 */
export class Path extends Shape {
	#d: string;

	get d() {
		return this.#d;
	}

	set d(v: string) {
		if (this.#d !== v) {
			this.#d = v;
			this._pathDirty = true;
		}
	}

	constructor(opts: PathProps) {
		super(opts);
		this.#d = opts.d;
	}

	_buildPath(): IPath2D {
		const parsed: [string, ...number[]][] = parseSvgPath(this.#d);
		const modified = parsed
			.map((c) => `${c[0]}${c.slice(1).join(',')}`)
			.join('');
		return new this.root.Path2D(modified);
	}
}
