/**
 * Minimal interface for a Canvas 2D rendering context.
 *
 * This abstraction allows react-tela to work with any Canvas 2D-compatible
 * implementation (browser `CanvasRenderingContext2D`, node-canvas, skia-canvas, etc.).
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D | MDN CanvasRenderingContext2D}
 */
export interface ICanvasRenderingContext2D {
	globalAlpha: number;
	canvas: ICanvas;
	restore(): void;
	save(): void;
	drawImage(image: any, dx: number, dy: number): void;
	drawImage(image: any, dx: number, dy: number, dw: number, dh: number): void;
	drawImage(
		image: any,
		sx: number,
		sy: number,
		sw: number,
		sh: number,
		dx: number,
		dy: number,
		dw: number,
		dh: number,
	): void;
	clearRect(x: number, y: number, w: number, h: number): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillRect) */
	fillRect(x: number, y: number, w: number, h: number): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/strokeRect) */
	strokeRect(x: number, y: number, w: number, h: number): void;
	transform(
		a: number,
		b: number,
		c: number,
		d: number,
		e: number,
		f: number,
	): void;
	resetTransform(): void;
	getTransform(): IDOMMatrix;
	setTransform(
		a: number,
		b: number,
		c: number,
		d: number,
		e: number,
		f: number,
	): void;
	setTransform(transform?: IDOMMatrix): void;
	arc(
		x: number,
		y: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterclockwise?: boolean,
	): void;
	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
	bezierCurveTo(
		cp1x: number,
		cp1y: number,
		cp2x: number,
		cp2y: number,
		x: number,
		y: number,
	): void;
	closePath(): void;
	ellipse(
		x: number,
		y: number,
		radiusX: number,
		radiusY: number,
		rotation: number,
		startAngle: number,
		endAngle: number,
		counterclockwise?: boolean,
	): void;
	lineTo(x: number, y: number): void;
	moveTo(x: number, y: number): void;
	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
	rect(x: number, y: number, w: number, h: number): void;
	roundRect(
		x: number,
		y: number,
		w: number,
		h: number,
		radii?: number | DOMPointInit | (number | DOMPointInit)[],
	): void;
	beginPath(): void;
	clip(fillRule?: CanvasFillRule): void;
	clip(path: Path2D, fillRule?: CanvasFillRule): void;
	fill(fillRule?: CanvasFillRule): void;
	fill(path: Path2D, fillRule?: CanvasFillRule): void;
	isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
	isPointInPath(
		path: Path2D,
		x: number,
		y: number,
		fillRule?: CanvasFillRule,
	): boolean;
	isPointInStroke(x: number, y: number): boolean;
	isPointInStroke(path: Path2D, x: number, y: number): boolean;
	stroke(): void;
	stroke(path: Path2D): void;
	lineCap: CanvasLineCap;
	lineDashOffset: number;
	lineJoin: CanvasLineJoin;
	lineWidth: number;
	miterLimit: number;
	getLineDash(): number[];
	setLineDash(segments: number[]): void;

	fillText(text: string, x: number, y: number, maxWidth?: number): void;
	measureText(text: string): TextMetrics;
	strokeText(text: string, x: number, y: number, maxWidth?: number): void;

	direction: CanvasDirection;
	font: string;
	fontKerning: CanvasFontKerning;
	textAlign: CanvasTextAlign;
	textBaseline: CanvasTextBaseline;

	fillStyle: string | CanvasGradient | CanvasPattern;
	strokeStyle: string | CanvasGradient | CanvasPattern;

	createLinearGradient(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
	): CanvasGradient;
	createRadialGradient(
		x0: number,
		y0: number,
		r0: number,
		x1: number,
		y1: number,
		r1: number,
	): CanvasGradient;
	createConicGradient(startAngle: number, x: number, y: number): CanvasGradient;

	createPattern(
		image: ICanvas | IImage | CanvasImageSource,
		repetition: string | null,
	): CanvasPattern | null;

	shadowColor: string;
	shadowBlur: number;
	shadowOffsetX: number;
	shadowOffsetY: number;

	filter: string;
	globalCompositeOperation: GlobalCompositeOperation;
	imageSmoothingEnabled: boolean;
	imageSmoothingQuality: ImageSmoothingQuality;
	letterSpacing: string;
	wordSpacing: string;
	fontStretch: string;
	fontVariantCaps: string;
}

/**
 * Minimal interface for a DOMMatrix, used for 2D transformations.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix | MDN DOMMatrix}
 */
export interface IDOMMatrix {
	a?: number;
	b?: number;
	c?: number;
	d?: number;
	e?: number;
	f?: number;
	m11?: number;
	m12?: number;
	m21?: number;
	m22?: number;
	m41?: number;
	m42?: number;
	inverse(): IDOMMatrix;
	transformPoint(point: Point): Point;
	invertSelf(): IDOMMatrix;
	//multiplySelf(other?: DOMMatrixInit): IDOMMatrix;
	//preMultiplySelf(other?: DOMMatrixInit): IDOMMatrix;
	rotateAxisAngleSelf(
		x?: number,
		y?: number,
		z?: number,
		angle?: number,
	): IDOMMatrix;
	rotateFromVectorSelf(x?: number, y?: number): IDOMMatrix;
	rotateSelf(rotX?: number, rotY?: number, rotZ?: number): IDOMMatrix;
	scale3dSelf(
		scale?: number,
		originX?: number,
		originY?: number,
		originZ?: number,
	): IDOMMatrix;
	scaleSelf(
		scaleX?: number,
		scaleY?: number,
		scaleZ?: number,
		originX?: number,
		originY?: number,
		originZ?: number,
	): IDOMMatrix;
	setMatrixValue(transformList: string): IDOMMatrix;
	skewXSelf(sx?: number): IDOMMatrix;
	skewYSelf(sy?: number): IDOMMatrix;
	translateSelf(tx?: number, ty?: number, tz?: number): IDOMMatrix;
}

/**
 * Minimal interface for an HTML Canvas element or equivalent offscreen canvas.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement | MDN HTMLCanvasElement}
 */
export type ICanvas = Partial<EventTarget> & {
	width: number;
	height: number;
	clientWidth?: number;
	clientHeight?: number;
	getContext: (type: '2d') => ICanvasRenderingContext2D | null;
};

/**
 * Minimal interface for an image that can be drawn on a canvas.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement | MDN HTMLImageElement}
 */
export interface IImage {
	src: any;
	onload?: any;
	naturalWidth: number;
	naturalHeight: number;
}

/**
 * Minimal interface for a Path2D object used to declare paths for later drawing.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Path2D | MDN Path2D}
 */
export interface IPath2D {
	addPath(path: IPath2D, transform?: DOMMatrix2DInit): void;
	arc(
		x: number,
		y: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterclockwise?: boolean,
	): void;
	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
	bezierCurveTo(
		cp1x: number,
		cp1y: number,
		cp2x: number,
		cp2y: number,
		x: number,
		y: number,
	): void;
	closePath(): void;
	ellipse(
		x: number,
		y: number,
		radiusX: number,
		radiusY: number,
		rotation: number,
		startAngle: number,
		endAngle: number,
		counterclockwise?: boolean,
	): void;
	lineTo(x: number, y: number): void;
	moveTo(x: number, y: number): void;
	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
	rect(x: number, y: number, w: number, h: number): void;
	roundRect(
		x: number,
		y: number,
		w: number,
		h: number,
		radii?: number | DOMPointInit | (number | DOMPointInit)[],
	): void;
}

/**
 * A 2D point with x and y coordinates.
 */
export interface Point {
	x: number;
	y: number;
}

/**
 * Extended mouse event that includes `layerX` and `layerY` coordinates
 * relative to the canvas element.
 */
export interface TelaMouseEvent extends MouseEvent {
	layerX: number;
	layerY: number;
}

/**
 * A color stop for use with gradient hooks.
 *
 * The first element is the offset (0–1) and the second is a CSS color string.
 *
 * @example
 * ```ts
 * const stops: ColorStop[] = [
 *   [0, 'red'],
 *   [0.5, 'green'],
 *   [1, 'blue'],
 * ];
 * ```
 */
export type ColorStop = [offset: number, color: string];
