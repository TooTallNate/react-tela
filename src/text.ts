import { Entity, EntityProps } from './entity';

export interface TextProps extends Omit<EntityProps, 'width' | 'height'> {
	value: string;
	fontFamily?: string;
	fontSize?: number;
	fill?: string;
	stroke?: string;
	lineWidth?: number;
	textAlign?: CanvasTextAlign;
	textBaseline?: CanvasTextBaseline;
}

export class Text extends Entity {
	fontFamily?: string;
	fontSize?: number;
	#value!: string;
	fill?: string;
	stroke?: string;
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
		this.fontSize = opts.fontSize;
		this.fill = opts.fill;
		this.stroke = opts.stroke;
		this.lineWidth = opts.lineWidth;
		this.textAlign = opts.textAlign || 'start';
		this.textBaseline = opts.textBaseline || 'top';
	}

	render(): void {
		let {
			value,
			fontFamily = 'sans-serif',
			fontSize = 24,
			lineWidth,
			textAlign,
			textBaseline,
			fill,
			stroke,
			root,
		} = this;
		const { ctx } = root;
		ctx.font = `${fontSize}px "${fontFamily}"`;
		const bounds = ctx.measureText(value);
		this.width = bounds.width;
		this.height = fontSize;
		super.render();
		ctx.textAlign = textAlign;
		ctx.textBaseline = textBaseline;
		if (typeof lineWidth === 'number') {
			ctx.lineWidth = lineWidth;
		}
		if (fill) {
			ctx.fillStyle = fill;
			ctx.fillText(value, 0, 0);
		}
		if (stroke) {
			ctx.strokeStyle = stroke;
			ctx.strokeText(value, 0, 0);
		}
	}
}
