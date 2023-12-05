import { Entity, type EntityProps } from './entity';
import { Context } from './root';

export interface CommonShapeProps extends EntityProps {
	fillRule?: CanvasFillRule;
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

export interface ClipShapeProps extends CommonShapeProps {
	clip?: boolean;
}

export interface FillShapeProps extends CommonShapeProps {
	fill?: string;
	stroke?: string;
}

export type ShapeProps = ClipShapeProps | FillShapeProps;

export abstract class Shape extends Entity {
	clip?: boolean;
	fill?: string;
	fillRule?: CanvasFillRule;
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
		this.clip = (opts as ClipShapeProps).clip;
		this.fill = (opts as FillShapeProps).fill;
		this.stroke = (opts as FillShapeProps).stroke;
		this.lineCap = opts.lineCap;
		this.lineDash = opts.lineDash;
		this.lineDashOffset = opts.lineDashOffset;
		this.lineJoin = opts.lineJoin;
		this.lineWidth = opts.lineWidth;
		this.miterLimit = opts.miterLimit;
	}

	render(): void {
		super.render();
		const {
			root,
			fill,
			fillRule,
			stroke,
			lineWidth,
			lineDash,
			lineDashOffset,
			lineCap,
			lineJoin,
			miterLimit,
		} = this;
		const ctx = root!.ctx;
		if (typeof lineWidth === 'number') {
			ctx.lineWidth = lineWidth;
		}
		if (lineDash) {
			ctx.setLineDash(lineDash);
		}
		if (typeof lineDashOffset === 'number') {
			ctx.lineDashOffset = lineDashOffset;
		}
		if (lineCap) {
			ctx.lineCap = lineCap;
		}
		if (lineJoin) {
			ctx.lineJoin = lineJoin;
		}
		if (typeof miterLimit === 'number') {
			ctx.miterLimit = miterLimit;
		}
		ctx.beginPath();
		const shape = this.renderShape(ctx);
		if (this.clip) {
			shape ? ctx.clip(shape, fillRule) : ctx.clip(fillRule);
		} else {
			if (fill) {
				ctx.fillStyle = fill;
				shape ? ctx.fill(shape, fillRule) : ctx.fill(fillRule);
			}
			if (stroke) {
				ctx.strokeStyle = stroke;
				shape ? ctx.stroke(shape) : ctx.stroke();
			}
		}
	}

	abstract renderShape(ctx: Context): Path2D | undefined;
}
