import { Shape, type ShapeProps } from './shape.js';
import type { IPath2D } from './types.js';

export type QuadraticCurveProps = Omit<ShapeProps, 'width' | 'height'> & {
	x0: number;
	y0: number;
	cpx: number;
	cpy: number;
	x1: number;
	y1: number;
};

export class QuadraticCurve extends Shape {
	#x0: number;
	#y0: number;
	#cpx: number;
	#cpy: number;
	#x1: number;
	#y1: number;

	get x0() { return this.#x0; }
	set x0(v: number) { if (this.#x0 !== v) { this.#x0 = v; this._pathDirty = true; } }

	get y0() { return this.#y0; }
	set y0(v: number) { if (this.#y0 !== v) { this.#y0 = v; this._pathDirty = true; } }

	get cpx() { return this.#cpx; }
	set cpx(v: number) { if (this.#cpx !== v) { this.#cpx = v; this._pathDirty = true; } }

	get cpy() { return this.#cpy; }
	set cpy(v: number) { if (this.#cpy !== v) { this.#cpy = v; this._pathDirty = true; } }

	get x1() { return this.#x1; }
	set x1(v: number) { if (this.#x1 !== v) { this.#x1 = v; this._pathDirty = true; } }

	get y1() { return this.#y1; }
	set y1(v: number) { if (this.#y1 !== v) { this.#y1 = v; this._pathDirty = true; } }

	constructor(opts: QuadraticCurveProps) {
		const xs = [opts.x0, opts.cpx, opts.x1];
		const ys = [opts.y0, opts.cpy, opts.y1];
		const minX = Math.min(...xs);
		const minY = Math.min(...ys);
		const maxX = Math.max(...xs);
		const maxY = Math.max(...ys);
		super({
			...opts,
			width: maxX - minX,
			height: maxY - minY,
		});
		this.#x0 = opts.x0;
		this.#y0 = opts.y0;
		this.#cpx = opts.cpx;
		this.#cpy = opts.cpy;
		this.#x1 = opts.x1;
		this.#y1 = opts.y1;
	}

	_buildPath(): IPath2D {
		const p = new this.root.Path2D();
		p.moveTo(this.#x0, this.#y0);
		p.quadraticCurveTo(this.#cpx, this.#cpy, this.#x1, this.#y1);
		return p;
	}
}
