import { Entity, type EntityProps } from './entity.js';

export type FillStrokeStyle = string | CanvasGradient | CanvasPattern;

export type FillStrokeInput =
	| FillStrokeStyle
	| { current?: FillStrokeStyle | null };

/**
 * Resolve a fill/stroke value, unwrapping React ref objects if needed.
 * If the ref points to a Pattern instance, read its `.pattern` property.
 */
export function resolveFillStroke(
	v: FillStrokeInput | undefined,
): FillStrokeStyle | undefined {
	if (!v) return undefined;
	if (typeof v === 'object' && 'current' in v) {
		const c = v.current;
		if (c && typeof c === 'object' && 'pattern' in c) {
			return (c as { pattern: CanvasPattern | null }).pattern ?? undefined;
		}
		return c ?? undefined;
	}
	return v as FillStrokeStyle;
}

export interface ShapeProps extends EntityProps {
	clip?: boolean;
	clipRule?: CanvasFillRule;
	fill?: FillStrokeInput;
	fillRule?: CanvasFillRule;
	stroke?: FillStrokeInput;
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
	fill?: FillStrokeInput;
	fillRule?: CanvasFillRule;
	stroke?: FillStrokeInput;
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
		const { lineWidth, matrix, path } = this;
		const stroke = resolveFillStroke(this.stroke);
		const fill = resolveFillStroke(this.fill);
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
		const resolvedFill = resolveFillStroke(fill);
		const resolvedStroke = resolveFillStroke(stroke);
		if (resolvedFill) {
			ctx.fillStyle = resolvedFill;
			ctx.fill(path, fillRule);
		}
		if (resolvedStroke) {
			ctx.strokeStyle = resolvedStroke;
			ctx.stroke(path);
		}
	}
}
