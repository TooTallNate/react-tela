import { Shape, type ShapeProps } from './shape';

export interface ArcProps extends Omit<ShapeProps, 'width' | 'height'> {
	startAngle: number;
	endAngle: number;
	radius: number;
	counterclockwise?: boolean;
}

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

	renderShape(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		const x = this.offsetX + this.#radius;
		const y = this.offsetY + this.#radius;
		ctx.arc(
			x,
			y,
			this.radius,
			this.startAngle,
			this.endAngle,
			this.counterclockwise,
		);
	}
}
