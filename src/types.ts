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
	createConicGradient(
		startAngle: number,
		x: number,
		y: number,
	): CanvasGradient;

	createPattern(
		image: ICanvas | IImage | CanvasImageSource,
		repetition: string | null,
	): CanvasPattern | null;

	shadowColor: string;
	shadowBlur: number;
	shadowOffsetX: number;
	shadowOffsetY: number;

	letterSpacing: string;
	wordSpacing: string;
	fontStretch: string;
	fontVariantCaps: string;
}

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

export type ICanvas = Partial<EventTarget> & {
	width: number;
	height: number;
	clientWidth?: number;
	clientHeight?: number;
	getContext: (type: '2d') => ICanvasRenderingContext2D | null;
};

export interface IImage {
	src: any;
	onload?: any;
	naturalWidth: number;
	naturalHeight: number;
}

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

export interface Point {
	x: number;
	y: number;
}

export interface TelaMouseEvent extends MouseEvent {
	layerX: number;
	layerY: number;
}

export type ColorStop = [offset: number, color: string];
