import { Entity, type EntityProps } from './entity';

export interface ShapeProps extends EntityProps {
	clip?: boolean;
	clipRule?: CanvasFillRule;
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
}

export abstract class Shape extends Entity {
	clip?: boolean;
	clipRule?: CanvasFillRule;
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
		this.clip = opts.clip;
		this.clipRule = opts.clipRule;
		this.fill = opts.fill;
		this.stroke = opts.stroke;
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
			clip,
			clipRule,
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
		const { ctx } = root;
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
		const path = this.path;
		if (clip || clipRule) {
			ctx.clip(path, clipRule);
		}
		if (fill) {
			ctx.fillStyle = fill;
			ctx.fill(path, fillRule);
		}
		if (stroke) {
			ctx.strokeStyle = stroke;
			ctx.stroke(path);
		}
	}
}
