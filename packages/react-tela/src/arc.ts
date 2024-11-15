import { Shape, type ShapeProps } from './shape.js';
import { degreesToRadians } from './util.js';

export type ArcProps = Omit<ShapeProps, 'width' | 'height'> & {
	startAngle: number;
	endAngle: number;
	radius: number;
	counterclockwise?: boolean;
};

export class Arc extends Shape {
	startAngle: number;
	endAngle: number;
	counterclockwise?: boolean;
	#radius: number;

	get radius() {
		return this.#radius;
	}

	set radius(v: number) {
		this.width = this.height = v * 2;
		this.#radius = v;
	}

	constructor(opts: ArcProps) {
		const r2 = opts.radius * 2;
		super({
			...opts,
			width: r2,
			height: r2,
		});
		this.startAngle = opts.startAngle;
		this.endAngle = opts.endAngle;
		this.counterclockwise = opts.counterclockwise;
		this.#radius = opts.radius;
	}

	get path() {
		const p = new this.root.Path2D();
		p.arc(
			this.#radius,
			this.#radius,
			this.radius,
			degreesToRadians(this.startAngle),
			degreesToRadians(this.endAngle),
			this.counterclockwise,
		);
		return p;
	}
}
