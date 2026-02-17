import { Entity, EntityProps } from './entity.js';
import { resolveFillStroke, type FillStrokeInput } from './shape.js';

export interface TextProps extends Omit<EntityProps, 'width' | 'height'> {
	value: string;
	fontFamily?: string;
	fontWeight?: string;
	fontSize?: number;
	fill?: FillStrokeInput;
	stroke?: FillStrokeInput;
	lineWidth?: number;
	textAlign?: CanvasTextAlign;
	textBaseline?: CanvasTextBaseline;
}

export class Text extends Entity {
	fontFamily?: string;
	fontWeight?: string;
	fontSize?: number;
	#value!: string;
	fill?: FillStrokeInput;
	stroke?: FillStrokeInput;
	lineWidth?: number;
	textAlign: CanvasTextAlign;
	textBaseline: CanvasTextBaseline;

	get value() {
		return this.#value;
	}

	set value(v: string) {
		this.#value = v;
	}

	constructor(opts: TextProps) {
		super({
			width: 0,
			height: 0,
			...opts,
		});
		this.value = opts.value;
		this.fontFamily = opts.fontFamily;
		this.fontWeight = opts.fontWeight;
		this.fontSize = opts.fontSize;
		this.fill = opts.fill;
		this.stroke = opts.stroke;
		this.lineWidth = opts.lineWidth;
		this.textAlign = opts.textAlign || 'start';
		this.textBaseline = opts.textBaseline || 'top';
	}

	render(): void {
		const {
			value,
			fontFamily = 'sans-serif',
			fontWeight = '',
			fontSize = 24,
			lineWidth,
			textAlign,
			textBaseline,
			fill,
			stroke,
			root,
		} = this;
		const { ctx } = root;
		ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;
		const bounds = ctx.measureText(value);
		this.width = bounds.width;
		this.height = fontSize;
		super.render();
		ctx.textAlign = textAlign;
		ctx.textBaseline = textBaseline;
		if (typeof lineWidth === 'number') {
			ctx.lineWidth = lineWidth;
		}
		const resolvedFill = resolveFillStroke(fill);
		const resolvedStroke = resolveFillStroke(stroke);
		if (resolvedFill) {
			ctx.fillStyle = resolvedFill;
			ctx.fillText(value, 0, 0);
		}
		if (resolvedStroke) {
			ctx.strokeStyle = resolvedStroke;
			ctx.strokeText(value, 0, 0);
		}
	}
}
