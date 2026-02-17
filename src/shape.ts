import { Entity, type EntityProps } from './entity.js';
import {
	type FillStrokeStyle,
	isGradientDescriptor,
	resolveGradient,
} from './gradient.js';

export interface ShapeProps extends EntityProps {
	clip?: boolean;
	clipRule?: CanvasFillRule;
	fill?: FillStrokeStyle;
	fillRule?: CanvasFillRule;
	stroke?: FillStrokeStyle;
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
	fill?: FillStrokeStyle;
	fillRule?: CanvasFillRule;
	stroke?: FillStrokeStyle;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineCap) */
	lineCap?: CanvasLineCap;
	lineDash?: number[];
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineDashOffset) */
	lineDashOffset?: number;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineJoin) */
	lineJoin?: CanvasLineJoin;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineWidth) */
	lineWidth: number;
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
		this.lineWidth = opts.lineWidth ?? 1;
		this.miterLimit = opts.miterLimit;
	}

	isPointInPath(x: number, y: number): boolean {
		const { ctx } = this.root;
		const { lineWidth, stroke, fill, matrix, path } = this;
		ctx.setTransform(matrix);
		if (stroke) {
			ctx.lineWidth = lineWidth;
		}
		const result =
			(stroke && ctx.isPointInStroke(path, x, y)) ||
			(fill && ctx.isPointInPath(path, x, y)) ||
			false;
		return result;
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
			ctx.fillStyle = isGradientDescriptor(fill)
				? resolveGradient(ctx, fill)
				: fill;
			ctx.fill(path, fillRule);
		}
		if (stroke) {
			ctx.strokeStyle = isGradientDescriptor(stroke)
				? resolveGradient(ctx, stroke)
				: stroke;
			ctx.stroke(path);
		}
	}
}
