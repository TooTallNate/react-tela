import { Entity, type EntityProps } from './entity';
import { Context } from './root';

export interface ShapeProps extends EntityProps {
	fill?: string;
	stroke?: string;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineCap) */
	lineCap?: CanvasLineCap;
	lineDash?: number[];
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineDashOffset) */
	lineDashOffset?: number;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineJoin) */
	lineJoin?: CanvasLineJoin;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineWidth) */
	lineWidth?: number;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/miterLimit) */
	miterLimit?: number;
}

export abstract class Shape extends Entity implements ShapeProps {
	fill?: string;
	stroke?: string;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineCap) */
	lineCap?: CanvasLineCap;
	lineDash?: number[];
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineDashOffset) */
	lineDashOffset?: number;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineJoin) */
	lineJoin?: CanvasLineJoin;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineWidth) */
	lineWidth?: number;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/miterLimit) */
	miterLimit?: number;

	constructor(opts: ShapeProps) {
		super(opts);
		this.fill = opts.fill;
		this.stroke = opts.stroke;
		this.lineWidth = opts.lineWidth;
	}

	render(): void {
		super.render();
		const ctx = this.root?.ctx!;
		if (typeof this.lineWidth === 'number') {
			ctx.lineWidth = this.lineWidth;
		}
		this.renderShape(ctx);
		if (typeof this.fill === 'string') {
			ctx.fillStyle = this.fill;
			ctx.fill();
		}
		if (typeof this.stroke === 'string') {
			ctx.strokeStyle = this.stroke;
			ctx.stroke();
		}
	}

	abstract renderShape(ctx: Context): void;
}
