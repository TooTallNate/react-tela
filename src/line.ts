import { Shape, type ShapeProps } from './shape.js';
import type { IPath2D, Point } from './types.js';

/**
 * Props for the {@link Line} component.
 *
 * Draws a polyline (series of connected line segments) through the given points.
 */
export type LineProps = Omit<ShapeProps, 'width' | 'height'> & {
	/** Array of points defining the polyline vertices. */
	points: Point[];
};

/**
 * Renders a polyline (connected line segments) on the canvas.
 *
 * @example
 * ```tsx
 * <Line
 *   points={[{ x: 0, y: 0 }, { x: 50, y: 100 }, { x: 100, y: 50 }]}
 *   stroke="black"
 *   lineWidth={2}
 * />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo | MDN lineTo()}
 */
export class Line extends Shape {
	#points: Point[];

	get points() {
		return this.#points;
	}

	set points(v: Point[]) {
		this.#points = v;
		this._pathDirty = true;
	}

	constructor(opts: LineProps) {
		const points = opts.points;
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const p of points) {
			if (p.x < minX) minX = p.x;
			if (p.y < minY) minY = p.y;
			if (p.x > maxX) maxX = p.x;
			if (p.y > maxY) maxY = p.y;
		}
		const width = maxX - minX;
		const height = maxY - minY;
		super({
			...opts,
			width,
			height,
		});
		this.#points = points;
	}

	_buildPath(): IPath2D {
		const p = new this.root.Path2D();
		const points = this.#points;
		if (points.length > 0) {
			p.moveTo(points[0].x, points[0].y);
			for (let i = 1; i < points.length; i++) {
				p.lineTo(points[i].x, points[i].y);
			}
		}
		return p;
	}
}
