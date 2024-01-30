import { Shape, type ShapeProps } from './shape';

export type RoundRectProps = ShapeProps & {
	radii?: number | DOMPointInit | (number | DOMPointInit)[];
};

export class RoundRect extends Shape {
	radii?: number | DOMPointInit | (number | DOMPointInit)[];

	constructor(opts: RoundRectProps) {
		super(opts);
		this.radii = opts.radii;
	}

	get path() {
		const p = new this.root.Path2D();
		p.roundRect(
			0,
			0,
			this.calculatedWidth,
			this.calculatedHeight,
			this.radii,
		);
		return p;
	}
}
