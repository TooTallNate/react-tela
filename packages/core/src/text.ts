import { Entity, EntityProps } from './entity.js';
import { type FillStrokeInput, resolveFillStroke } from './shape.js';

function quoteFamilyName(name: string): string {
	if (name.includes(' ')) {
		return `"${name}"`;
	}
	return name;
}

/**
 * Formats a `fontFamily` value for use in the CSS `font` shorthand.
 *
 * Accepts a single font family name, a comma-separated CSS `font-family`
 * string, or an array of family names:
 *
 * - **Array** — each entry is quoted if it contains spaces, then joined
 *   with `", "` (e.g. `['Geist Sans', 'sans-serif']` → `'"Geist Sans", sans-serif'`).
 * - **String with comma** — assumed to be a complete CSS `font-family`
 *   value and used as-is (e.g. `"'Geist Sans', sans-serif"`).
 * - **String without comma** — quoted only when it contains spaces
 *   (e.g. `"Geist Sans"` → `'"Geist Sans"'`, `"Arial"` → `'Arial'`).
 *
 * @param fontFamily - A font family name, comma-separated list, or array.
 * @returns A properly formatted font-family string.
 */
export function formatFontFamily(fontFamily: string | string[]): string {
	if (Array.isArray(fontFamily)) {
		return fontFamily.map(quoteFamilyName).join(', ');
	}
	if (fontFamily.includes(',')) {
		return fontFamily;
	}
	return quoteFamilyName(fontFamily);
}

/**
 * Controls how text overflows when it exceeds `maxWidth`.
 *
 * - `'wrap'` — word-wrap to multiple lines (default)
 * - `'ellipsis'` — truncate with "…"
 * - `'clip'` — hard clip at `maxWidth`
 */
export type TextOverflow = 'wrap' | 'ellipsis' | 'clip';

/**
 * Props for the {@link Text} component.
 *
 * Supports font styling, multiline text with word wrapping, ellipsis truncation,
 * and all Canvas 2D text rendering options.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText | MDN fillText()}
 */
export interface TextProps extends Omit<EntityProps, 'width' | 'height'> {
	/** The text content to render. */
	value: string;
	/** The font family name or an array of font family names. @default "sans-serif" */
	fontFamily?: string | string[];
	/** The font weight (e.g. `"bold"`, `"700"`). */
	fontWeight?: string;
	/** The font size in pixels. @default 24 */
	fontSize?: number;
	/** The fill color, gradient, or pattern for the text. */
	fill?: FillStrokeInput;
	/** The stroke color, gradient, or pattern for the text outline. */
	stroke?: FillStrokeInput;
	/** The stroke width for text outline. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth | MDN lineWidth} */
	lineWidth?: number;
	/** Horizontal text alignment. @default "start" @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign | MDN textAlign} */
	textAlign?: CanvasTextAlign;
	/** Vertical text baseline. @default "top" @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline | MDN textBaseline} */
	textBaseline?: CanvasTextBaseline;
	/** Extra spacing between characters in pixels. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing | MDN letterSpacing} */
	letterSpacing?: number;
	/** Extra spacing between words in pixels. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/wordSpacing | MDN wordSpacing} */
	wordSpacing?: number;
	/** Text direction. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/direction | MDN direction} */
	direction?: CanvasDirection;
	/** Font kerning behavior. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fontKerning | MDN fontKerning} */
	fontKerning?: CanvasFontKerning;
	/** Font stretch value. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fontStretch | MDN fontStretch} */
	fontStretch?: CanvasFontStretch;
	/** Font variant caps. @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fontVariantCaps | MDN fontVariantCaps} */
	fontVariantCaps?: CanvasFontVariantCaps;
	/**
	 * Maximum width (in pixels) before text wraps or is truncated.
	 * When set, enables multiline text layout.
	 */
	maxWidth?: number;
	/**
	 * Line height as a multiplier of `fontSize`. Default is `1.2`.
	 */
	lineHeight?: number;
	/**
	 * Controls what happens when text exceeds `maxWidth`.
	 * - `'wrap'` — word-wrap to multiple lines (default when `maxWidth` is set)
	 * - `'ellipsis'` — truncate with "…"
	 * - `'clip'` — hard clip at `maxWidth`
	 * @default 'wrap'
	 */
	overflow?: TextOverflow;
}

/**
 * Renders text on the canvas with support for font styling, multiline wrapping,
 * ellipsis truncation, and clipping.
 *
 * @example
 * ```tsx
 * <Text x={10} y={10} fontSize={32} fontFamily="Arial" fill="black">
 *   Hello, World!
 * </Text>
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText | MDN fillText()}
 */
export class Text extends Entity {
	fontFamily?: string | string[];
	fontWeight?: string;
	fontSize?: number;
	#value!: string;
	fill?: FillStrokeInput;
	stroke?: FillStrokeInput;
	lineWidth?: number;
	textAlign: CanvasTextAlign;
	textBaseline: CanvasTextBaseline;
	letterSpacing?: number;
	wordSpacing?: number;
	direction?: CanvasDirection;
	fontKerning?: CanvasFontKerning;
	fontStretch?: CanvasFontStretch;
	fontVariantCaps?: CanvasFontVariantCaps;
	maxWidth?: number;
	lineHeight?: number;
	overflow?: TextOverflow;

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
		this.letterSpacing = opts.letterSpacing;
		this.wordSpacing = opts.wordSpacing;
		this.direction = opts.direction;
		this.fontKerning = opts.fontKerning;
		this.fontStretch = opts.fontStretch;
		this.fontVariantCaps = opts.fontVariantCaps;
		this.maxWidth = opts.maxWidth;
		this.lineHeight = opts.lineHeight;
		this.overflow = opts.overflow;
	}

	/**
	 * Split text into lines that fit within `maxWidth` using word wrapping.
	 */
	#wrapText(
		ctx: { measureText(text: string): TextMetrics },
		text: string,
		maxWidth: number,
	): string[] {
		const lines: string[] = [];
		const paragraphs = text.split('\n');
		for (const paragraph of paragraphs) {
			const words = paragraph.split(/\s+/);
			if (words.length === 0 || (words.length === 1 && words[0] === '')) {
				lines.push('');
				continue;
			}
			let currentLine = words[0];
			for (let i = 1; i < words.length; i++) {
				const testLine = `${currentLine} ${words[i]}`;
				const metrics = ctx.measureText(testLine);
				if (metrics.width > maxWidth) {
					lines.push(currentLine);
					currentLine = words[i];
				} else {
					currentLine = testLine;
				}
			}
			lines.push(currentLine);
		}
		return lines;
	}

	/**
	 * Truncate text to fit within `maxWidth`, appending "…" if truncated.
	 */
	#ellipsisText(
		ctx: { measureText(text: string): TextMetrics },
		text: string,
		maxWidth: number,
	): string {
		if (ctx.measureText(text).width <= maxWidth) return text;
		const ellipsis = '…';
		let truncated = text;
		while (truncated.length > 0) {
			truncated = truncated.slice(0, -1);
			if (ctx.measureText(truncated + ellipsis).width <= maxWidth) {
				return truncated + ellipsis;
			}
		}
		return ellipsis;
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
			letterSpacing,
			wordSpacing,
			direction,
			fontKerning,
			fontStretch,
			fontVariantCaps,
			root,
			maxWidth,
			lineHeight = 1.2,
			overflow = 'wrap',
		} = this;
		const { ctx } = root;
		ctx.font =
			`${fontWeight} ${fontSize}px ${formatFontFamily(fontFamily)}`.trim();
		if (typeof letterSpacing === 'number') {
			ctx.letterSpacing = `${letterSpacing}px`;
		}
		if (typeof wordSpacing === 'number') {
			ctx.wordSpacing = `${wordSpacing}px`;
		}
		if (direction) {
			ctx.direction = direction;
		}
		if (fontKerning) {
			ctx.fontKerning = fontKerning;
		}
		if (fontStretch) {
			ctx.fontStretch = fontStretch;
		}
		if (fontVariantCaps) {
			ctx.fontVariantCaps = fontVariantCaps;
		}

		const lineHeightPx = fontSize * lineHeight;
		let lines: string[];

		if (maxWidth != null) {
			switch (overflow) {
				case 'ellipsis':
					lines = [this.#ellipsisText(ctx, value, maxWidth)];
					break;
				case 'clip':
					lines = [value];
					break;
				case 'wrap':
				default:
					lines = this.#wrapText(ctx, value, maxWidth);
					break;
			}
		} else {
			lines = value.split('\n');
		}

		// Compute dimensions
		let maxLineWidth = 0;
		for (const line of lines) {
			const w = ctx.measureText(line).width;
			if (w > maxLineWidth) maxLineWidth = w;
		}
		this.width =
			maxWidth != null ? Math.min(maxLineWidth, maxWidth) : maxLineWidth;
		this.height =
			lines.length === 1
				? fontSize
				: lineHeightPx * (lines.length - 1) + fontSize;

		super.render();

		ctx.textAlign = textAlign;
		ctx.textBaseline = textBaseline;
		if (typeof lineWidth === 'number') {
			ctx.lineWidth = lineWidth;
		}

		// For 'clip' mode, set up a clipping region
		if (overflow === 'clip' && maxWidth != null) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(0, 0, maxWidth, this.height);
			ctx.clip();
		}

		const resolvedFill = resolveFillStroke(fill);
		const resolvedStroke = resolveFillStroke(stroke);

		for (let i = 0; i < lines.length; i++) {
			const y = i * lineHeightPx;
			if (resolvedFill) {
				ctx.fillStyle = resolvedFill;
				ctx.fillText(lines[i], 0, y);
			}
			if (resolvedStroke) {
				ctx.strokeStyle = resolvedStroke;
				ctx.strokeText(lines[i], 0, y);
			}
		}

		if (overflow === 'clip' && maxWidth != null) {
			ctx.restore();
		}
	}
}
