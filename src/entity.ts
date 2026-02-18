import { TelaEventTarget } from './event-target.js';
import type { Root } from './root.js';
import type { IDOMMatrix, IPath2D, TelaMouseEvent } from './types.js';

export type EntityProps = {
	/**
	 * The x (horizontal) coordinate of the entity from the top-left corner of the context.
	 */
	x?: number;
	/**
	 * The y (vertical) coordinate of the entity from the top-left corner of the context.
	 */
	y?: number;
	/**
	 * The width of the entity in pixels.
	 */
	width?: number;
	/**
	 * The height of the entity in pixels.
	 */
	height?: number;
	/**
	 * The alpha transparency value of the entity. The value `0` is fully transparent. The value `1` is fully opaque.
	 *
	 * @default 1.0
	 */
	alpha?: number;
	/**
	 * The rotation of the entity in degrees.
	 *
	 * @default 0
	 */
	rotate?: number;
	/**
	 * Scale of the entity along the x-axis.
	 *
	 * @default 1.0
	 */
	scaleX?: number;
	/**
	 * Scale of the entity along the y-axis.
	 *
	 * @default 1.0
	 */
	scaleY?: number;
	/**
	 * The color of the shadow. A CSS color string.
	 */
	shadowColor?: string;
	/**
	 * The amount of blur applied to shadows.
	 *
	 * @default 0
	 */
	shadowBlur?: number;
	/**
	 * The horizontal distance of the shadow.
	 *
	 * @default 0
	 */
	shadowOffsetX?: number;
	/**
	 * The vertical distance of the shadow.
	 *
	 * @default 0
	 */
	shadowOffsetY?: number;
	/**
	 * The composite operation to apply when drawing this entity.
	 * Maps to `ctx.globalCompositeOperation`.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
	 */
	blendMode?: GlobalCompositeOperation;
	pointerEvents?: boolean;
	/**
	 * Fires when the user clicks the left mouse button on the entity.
	 *
	 * @param ev The mouse event.
	 */
	onClick?: (ev: TelaMouseEvent) => any;
	onMouseDown?: (ev: TelaMouseEvent) => any;
	onMouseUp?: (ev: TelaMouseEvent) => any;
	onMouseMove?: (ev: TelaMouseEvent) => any;
	onMouseEnter?: (ev: TelaMouseEvent) => any;
	onMouseLeave?: (ev: TelaMouseEvent) => any;
	onTouchStart?: (ev: TouchEvent) => any;
	onTouchMove?: (ev: TouchEvent) => any;
	onTouchEnd?: (ev: TouchEvent) => any;
};

export class Entity extends TelaEventTarget {
	// Backing fields for cached properties
	#x: number;
	#y: number;
	#width: number;
	#height: number;
	#rotate: number;
	#scaleX?: number;
	#scaleY?: number;

	// Matrix caching
	#matrixDirty = true;
	#cachedMatrix: IDOMMatrix | null = null;
	#inverseMatrixDirty = true;
	#cachedInverseMatrix: IDOMMatrix | null = null;

	// Path caching (underscore for subclass access)
	_pathDirty = true;
	_cachedPath: IPath2D | null = null;

	alpha: number;
	shadowColor?: string;
	shadowBlur?: number;
	shadowOffsetX?: number;
	shadowOffsetY?: number;
	blendMode?: GlobalCompositeOperation;
	pointerEvents: boolean;
	_root: Root | null;
	_hidden: boolean;

	onclick: ((ev: TelaMouseEvent) => any) | null;
	onmousedown: ((ev: TelaMouseEvent) => any) | null;
	onmouseup: ((ev: TelaMouseEvent) => any) | null;
	onmousemove: ((ev: TelaMouseEvent) => any) | null;
	onmouseenter: ((ev: TelaMouseEvent) => any) | null;
	onmouseleave: ((ev: TelaMouseEvent) => any) | null;
	ontouchstart: ((ev: TouchEvent) => any) | null;
	ontouchmove: ((ev: TouchEvent) => any) | null;
	ontouchend: ((ev: TouchEvent) => any) | null;

	constructor(opts: EntityProps = {}) {
		super();
		this._root = null;
		this._hidden = false;
		this.#x = opts.x ?? 0;
		this.#y = opts.y ?? 0;
		this.#width = opts.width ?? 0;
		this.#height = opts.height ?? 0;
		this.alpha = opts.alpha ?? 1;
		this.#rotate = opts.rotate ?? 0;
		this.#scaleX = opts.scaleX;
		this.#scaleY = opts.scaleY;
		this.shadowColor = opts.shadowColor;
		this.shadowBlur = opts.shadowBlur;
		this.shadowOffsetX = opts.shadowOffsetX;
		this.shadowOffsetY = opts.shadowOffsetY;
		this.blendMode = opts.blendMode;
		this.pointerEvents = opts.pointerEvents !== false;
		this.onclick = opts.onClick ?? null;
		this.onmousemove = opts.onMouseMove ?? null;
		this.onmouseenter = opts.onMouseEnter ?? null;
		this.onmouseleave = opts.onMouseLeave ?? null;
		this.onmousedown = opts.onMouseDown ?? null;
		this.onmouseup = opts.onMouseUp ?? null;
		this.ontouchstart = opts.onTouchStart ?? null;
		this.ontouchmove = opts.onTouchMove ?? null;
		this.ontouchend = opts.onTouchEnd ?? null;
	}

	// --- Getter/setter pairs for matrix- and path-affecting properties ---

	get x() {
		return this.#x;
	}

	set x(v: number) {
		if (this.#x !== v) {
			this.#x = v;
			this.#matrixDirty = true;
			this.#inverseMatrixDirty = true;
		}
	}

	get y() {
		return this.#y;
	}

	set y(v: number) {
		if (this.#y !== v) {
			this.#y = v;
			this.#matrixDirty = true;
			this.#inverseMatrixDirty = true;
		}
	}

	get width() {
		return this.#width;
	}

	set width(v: number) {
		if (this.#width !== v) {
			this.#width = v;
			this.#matrixDirty = true;
			this.#inverseMatrixDirty = true;
			this._pathDirty = true;
		}
	}

	get height() {
		return this.#height;
	}

	set height(v: number) {
		if (this.#height !== v) {
			this.#height = v;
			this.#matrixDirty = true;
			this.#inverseMatrixDirty = true;
			this._pathDirty = true;
		}
	}

	get rotate() {
		return this.#rotate;
	}

	set rotate(v: number) {
		if (this.#rotate !== v) {
			this.#rotate = v;
			this.#matrixDirty = true;
			this.#inverseMatrixDirty = true;
		}
	}

	get scaleX() {
		return this.#scaleX;
	}

	set scaleX(v: number | undefined) {
		if (this.#scaleX !== v) {
			this.#scaleX = v;
			this.#matrixDirty = true;
			this.#inverseMatrixDirty = true;
		}
	}

	get scaleY() {
		return this.#scaleY;
	}

	set scaleY(v: number | undefined) {
		if (this.#scaleY !== v) {
			this.#scaleY = v;
			this.#matrixDirty = true;
			this.#inverseMatrixDirty = true;
		}
	}

	get parentNode() {
		return this._root;
	}

	get root() {
		const r = this._root;
		if (!r) {
			throw new Error(
				`Entity "${this.constructor.name}" has not been added to a \`Root\` context`,
			);
		}
		return r;
	}

	get calculatedX() {
		return this.#x + this.#width / 2;
	}

	get calculatedY() {
		return this.#y + this.#height / 2;
	}

	get offsetX() {
		return -this.#width / 2;
	}

	get offsetY() {
		return -this.#height / 2;
	}

	get matrix() {
		if (this.#matrixDirty || !this.#cachedMatrix) {
			const m = new this.root.DOMMatrix();
			m.translateSelf(this.calculatedX, this.calculatedY);
			if (typeof this.#rotate === 'number') {
				m.rotateSelf(this.#rotate);
			}
			if (this.#scaleX || this.#scaleY) {
				m.scaleSelf(this.#scaleX ?? 1, this.#scaleY ?? 1);
			}
			m.translateSelf(this.offsetX, this.offsetY);
			this.#cachedMatrix = m;
			this.#matrixDirty = false;
		}
		return this.#cachedMatrix;
	}

	get inverseMatrix() {
		if (this.#inverseMatrixDirty || !this.#cachedInverseMatrix) {
			this.#cachedInverseMatrix = this.matrix.inverse();
			this.#inverseMatrixDirty = false;
		}
		return this.#cachedInverseMatrix;
	}

	isPointInPath(x: number, y: number) {
		const { ctx } = this.root;
		ctx.setTransform(this.matrix);
		const result = ctx.isPointInPath(this.path, x, y);
		return result;
	}

	/**
	 * Override in subclasses to build the Path2D for this entity.
	 * Called by the cached `path` getter when the path is dirty.
	 */
	_buildPath(): IPath2D {
		const p = new this.root.Path2D();
		p.rect(0, 0, this.#width, this.#height);
		return p;
	}

	get path(): IPath2D {
		if (this._pathDirty || !this._cachedPath) {
			this._cachedPath = this._buildPath();
			this._pathDirty = false;
		}
		return this._cachedPath;
	}

	render() {
		if (!this.root) {
			throw new Error(
				`${this.constructor.name} instance has not been added to a root context`,
			);
		}
		const { ctx } = this.root;
		ctx.globalAlpha = this.alpha;
		if (this.blendMode) {
			ctx.globalCompositeOperation = this.blendMode;
		}
		if (this.shadowColor) {
			ctx.shadowColor = this.shadowColor;
		}
		if (typeof this.shadowBlur === 'number') {
			ctx.shadowBlur = this.shadowBlur;
		}
		if (typeof this.shadowOffsetX === 'number') {
			ctx.shadowOffsetX = this.shadowOffsetX;
		}
		if (typeof this.shadowOffsetY === 'number') {
			ctx.shadowOffsetY = this.shadowOffsetY;
		}
		ctx.setTransform(this.matrix);
	}
}
