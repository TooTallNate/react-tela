import { TelaEventTarget } from './event-target.js';
import { parsePercent } from './util.js';
import type { Root } from './root.js';
import type { PercentageString, TelaMouseEvent } from './types.js';

export type EntityProps = {
	/**
	 * The x (horizontal) coordinate of the entity from the top-left corner of the context.
	 */
	x?: number | PercentageString;
	/**
	 * The y (vertical) coordinate of the entity from the top-left corner of the context.
	 */
	y?: number | PercentageString;
	/**
	 * The height of the entity in pixels.
	 */
	width?: number | PercentageString;
	/**
	 * The height of the entity in pixels.
	 */
	height?: number | PercentageString;
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
	x: number | PercentageString;
	y: number | PercentageString;
	width: number | PercentageString;
	height: number | PercentageString;
	alpha: number;
	rotate: number;
	scaleX?: number;
	scaleY?: number;
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
		this.x = opts.x ?? 0;
		this.y = opts.y ?? 0;
		this.width = opts.width ?? 0;
		this.height = opts.height ?? 0;
		this.alpha = opts.alpha ?? 1;
		this.rotate = opts.rotate ?? 0;
		this.scaleX = opts.scaleX;
		this.scaleY = opts.scaleY;
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
		let { x } = this;
		if (typeof x !== 'number') {
			x = this.root.ctx.canvas.width * parsePercent(x);
		}
		return x + this.calculatedWidth / 2;
	}

	get calculatedY() {
		let { y } = this;
		if (typeof y !== 'number') {
			y = this.root.ctx.canvas.height * parsePercent(y);
		}
		return y + this.calculatedHeight / 2;
	}

	get calculatedWidth() {
		if (typeof this.width === 'number') {
			return this.width;
		}
		return this.root.ctx.canvas.width * parsePercent(this.width);
	}

	get calculatedHeight() {
		if (typeof this.height === 'number') {
			return this.height;
		}
		return this.root.ctx.canvas.height * parsePercent(this.height);
	}

	get offsetX() {
		return -this.calculatedWidth / 2;
	}

	get offsetY() {
		return -this.calculatedHeight / 2;
	}

	get matrix() {
		// TODO: add caching
		const { DOMMatrix } = this.root;
		const m = new DOMMatrix();
		m.translateSelf(this.calculatedX, this.calculatedY);
		if (typeof this.rotate === 'number') {
			m.rotateSelf(this.rotate);
		}
		if (this.scaleX || this.scaleY) {
			m.scaleSelf(this.scaleX ?? 1, this.scaleY ?? 1);
		}
		m.translateSelf(this.offsetX, this.offsetY);
		return m;
	}

	get inverseMatrix() {
		// TODO: add caching
		return this.matrix.inverse();
	}

	isPointInPath(x: number, y: number) {
		const { ctx } = this.root;
		//const prevMatrix = ctx.getTransform();
		ctx.setTransform(this.matrix);
		const result = ctx.isPointInPath(this.path, x, y);
		//ctx.setTransform(prevMatrix);
		return result;
	}

	get path() {
		const p = new this.root.Path2D();
		p.rect(0, 0, this.calculatedWidth, this.calculatedHeight);
		return p;
	}

	render() {
		if (!this.root) {
			throw new Error(
				`${this.constructor.name} instance has not been added to a root context`,
			);
		}
		const { ctx } = this.root;
		ctx.globalAlpha = this.alpha;
		ctx.setTransform(this.matrix);
	}
}
