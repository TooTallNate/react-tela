import { Shape, type ShapeProps } from './shape.js';
import { degreesToRadians } from './util.js';
import type { IPath2D } from './types.js';

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
