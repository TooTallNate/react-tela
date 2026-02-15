import { Shape, type ShapeProps } from './shape.js';
import { degreesToRadians } from './util.js';

export type EllipseProps = Omit<ShapeProps, 'width' | 'height'> & {
	radiusX: number;
	radiusY: number;
	/** Rotation of the ellipse in degrees. Named to avoid collision with Entity's `rotate`. */
	ellipseRotation?: number;
	startAngle?: number;
	endAngle?: number;
	counterclockwise?: boolean;
};

export class Ellipse extends Shape {
	#radiusX: number;
	#radiusY: number;
	ellipseRotation: number;
	startAngle: number;
	endAngle: number;
	counterclockwise?: boolean;

	get radiusX() {
		return this.#radiusX;
	}

	set radiusX(v: number) {
		this.width = v * 2;
		this.#radiusX = v;
	}

	get radiusY() {
		return this.#radiusY;
	}

	set radiusY(v: number) {
		this.height = v * 2;
		this.#radiusY = v;
	}

	constructor(opts: EllipseProps) {
		super({
			...opts,
			width: opts.radiusX * 2,
			height: opts.radiusY * 2,
		});
		this.#radiusX = opts.radiusX;
		this.#radiusY = opts.radiusY;
		this.ellipseRotation = opts.ellipseRotation ?? 0;
		this.startAngle = opts.startAngle ?? 0;
		this.endAngle = opts.endAngle ?? 360;
		this.counterclockwise = opts.counterclockwise;
	}

	get path() {
		const p = new this.root.Path2D();
		p.ellipse(
			this.#radiusX,
			this.#radiusY,
			this.#radiusX,
			this.#radiusY,
			degreesToRadians(this.ellipseRotation),
			degreesToRadians(this.startAngle),
			degreesToRadians(this.endAngle),
			this.counterclockwise,
		);
		return p;
	}
}
