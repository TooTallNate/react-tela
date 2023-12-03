import { Shape, type ShapeProps } from './shape';

export interface RoundRectProps extends ShapeProps {
	radii?: number | DOMPointInit | (number | DOMPointInit)[];
}

export class RoundRect extends Shape {
	radii?: number | DOMPointInit | (number | DOMPointInit)[];

	constructor(opts: RoundRectProps) {
		super(opts);
		this.radii = opts.radii;
	}

	renderShape(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.roundRect(
			this.offsetX,
			this.offsetY,
			this.calculatedWidth,
			this.calculatedHeight,
			this.radii,
		);
	}
}
