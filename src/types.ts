export type PercentageString = `${string}%`;

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
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arc) */
	arc(
		x: number,
		y: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterclockwise?: boolean,
	): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arcTo) */
	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) */
	bezierCurveTo(
		cp1x: number,
		cp1y: number,
		cp2x: number,
		cp2y: number,
		x: number,
		y: number,
	): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/closePath) */
	closePath(): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/ellipse) */
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
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineTo) */
	lineTo(x: number, y: number): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/moveTo) */
	moveTo(x: number, y: number): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) */
	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
	rect(x: number, y: number, w: number, h: number): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
	roundRect(
		x: number,
		y: number,
		w: number,
		h: number,
		radii?: number | DOMPointInit | (number | DOMPointInit)[],
	): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/beginPath) */
	beginPath(): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/clip) */
	clip(fillRule?: CanvasFillRule): void;
	clip(path: Path2D, fillRule?: CanvasFillRule): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fill) */
	fill(fillRule?: CanvasFillRule): void;
	fill(path: Path2D, fillRule?: CanvasFillRule): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/isPointInPath) */
	isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
	isPointInPath(
		path: Path2D,
		x: number,
		y: number,
		fillRule?: CanvasFillRule,
	): boolean;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/isPointInStroke) */
	isPointInStroke(x: number, y: number): boolean;
	isPointInStroke(path: Path2D, x: number, y: number): boolean;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/stroke) */
	stroke(): void;
	stroke(path: Path2D): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineCap) */
	lineCap: CanvasLineCap;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineDashOffset) */
	lineDashOffset: number;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineJoin) */
	lineJoin: CanvasLineJoin;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineWidth) */
	lineWidth: number;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/miterLimit) */
	miterLimit: number;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/getLineDash) */
	getLineDash(): number[];
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash) */
	setLineDash(segments: number[]): void;

	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillText) */
	fillText(text: string, x: number, y: number, maxWidth?: number): void;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/measureText) */
	measureText(text: string): TextMetrics;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/strokeText) */
	strokeText(text: string, x: number, y: number, maxWidth?: number): void;

	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/direction) */
	direction: CanvasDirection;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/font) */
	font: string;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fontKerning) */
	fontKerning: CanvasFontKerning;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/textAlign) */
	textAlign: CanvasTextAlign;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/textBaseline) */
	textBaseline: CanvasTextBaseline;

	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillStyle) */
	fillStyle: string | CanvasGradient | CanvasPattern;
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/strokeStyle) */
	strokeStyle: string | CanvasGradient | CanvasPattern;
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

export type InstanceProperties<T> = {
	[K in keyof T]: T[K];
};

export interface Point {
	x: number;
	y: number;
}

export interface TelaMouseEvent extends MouseEvent {
	layerX: number;
	layerY: number;
}
