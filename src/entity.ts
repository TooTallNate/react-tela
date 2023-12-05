import type { Root } from './root';
import type { PercentageString } from './types';
import { parsePercent } from './util';

export type EntityProps = {
	x?: number | PercentageString;
	y?: number | PercentageString;
	width?: number | PercentageString;
	height?: number | PercentageString;
	alpha?: number;
	rotate?: number;
	scaleX?: number;
	scaleY?: number;
};

export class Entity {
	x: number | PercentageString;
	y: number | PercentageString;
	width: number | PercentageString;
	height: number | PercentageString;
	alpha: number;
	rotate: number;
	scaleX?: number;
	scaleY?: number;
	root?: Root;

	constructor(opts: EntityProps = {}) {
		this.x = opts.x ?? 0;
		this.y = opts.y ?? 0;
		this.width = opts.width ?? 0;
		this.height = opts.height ?? 0;
		this.alpha = opts.alpha ?? 1;
		this.rotate = opts.rotate ?? 0;
		this.scaleX = opts.scaleX;
		this.scaleY = opts.scaleY;
	}

	get calculatedX() {
		let { x } = this;
		if (typeof x !== 'number') {
			if (!this.root) {
				throw new Error('No "root"');
			}
			x = this.root.ctx.canvas.width * parsePercent(x);
		}
		return x + this.calculatedWidth / 2;
	}

	get calculatedY() {
		let { y } = this;
		if (typeof y !== 'number') {
			if (!this.root) {
				throw new Error('No "root"');
			}
			y = this.root.ctx.canvas.height * parsePercent(y);
		}
		return y + this.calculatedHeight / 2;
	}

	get calculatedWidth() {
		if (typeof this.width === 'number') {
			return this.width;
		}
		if (!this.root) {
			throw new Error('No "root"');
		}
		return this.root.ctx.canvas.width * parsePercent(this.width);
	}

	get calculatedHeight() {
		if (typeof this.height === 'number') {
			return this.height;
		}
		if (!this.root) {
			throw new Error('No "root"');
		}
		return this.root.ctx.canvas.height * parsePercent(this.height);
	}

	get offsetX() {
		return -this.calculatedWidth / 2;
	}

	get offsetY() {
		return -this.calculatedHeight / 2;
	}

	render() {
		if (!this.root) {
			throw new Error(
				`${this.constructor.name} instance has not been added to a root context`,
			);
		}
		const { ctx } = this.root;
		ctx.globalAlpha = this.alpha;
		ctx.translate(this.calculatedX, this.calculatedY);
		if (typeof this.rotate === 'number') {
			ctx.rotate(this.rotate);
		}
		if (this.scaleX || this.scaleY) {
			ctx.scale(this.scaleX ?? 1, this.scaleY ?? 1);
		}
		ctx.translate(this.offsetX, this.offsetY);
	}
}
