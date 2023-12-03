import type { Root } from './root';
import type { PercentageString } from './types';
import { parsePercent } from './util';

export type EntityProps = {
	x: number | PercentageString;
	y: number | PercentageString;
	width: number | PercentageString;
	height: number | PercentageString;
	alpha?: number;
	rotate?: number;
	originX?: number | 'center';
	originY?: number | 'center';
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
	originX: number | 'center';
	originY: number | 'center';
	scaleX?: number;
	scaleY?: number;
	root?: Root;

	constructor(opts: EntityProps) {
		this.x = opts.x;
		this.y = opts.y;
		this.width = opts.width;
		this.height = opts.height;
		this.alpha = opts.alpha ?? 1;
		this.rotate = opts.rotate ?? 0;
		this.originX = opts.originX ?? 0;
		this.originY = opts.originY ?? 0;
		this.scaleX = opts.scaleX;
		this.scaleY = opts.scaleY;
	}

	get calculatedX() {
		if (typeof this.x === 'number') {
			return this.x;
		}
		if (!this.root) {
			throw new Error('No "root"');
		}
		return this.root.ctx.canvas.width * parsePercent(this.x);
	}

	get calculatedY() {
		if (typeof this.y === 'number') {
			return this.y;
		}
		if (!this.root) {
			throw new Error('No "root"');
		}
		return this.root.ctx.canvas.height * parsePercent(this.y);
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
		if (typeof this.originX === 'number') {
			return -this.originX;
		}
		// center
		return -this.calculatedWidth / 2;
	}

	get offsetY() {
		if (typeof this.originY === 'number') {
			return -this.originY;
		}
		// center
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
	}
}
