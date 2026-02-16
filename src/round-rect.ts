import { Shape, type ShapeProps } from './shape.js';
import type { IPath2D } from './types.js';

export type RoundRectProps = ShapeProps & {
	radii?: number | DOMPointInit | (number | DOMPointInit)[];
};

export class RoundRect extends Shape {
	#radii?: number | DOMPointInit | (number | DOMPointInit)[];

	get radii() {
		return this.#radii;
	}

	set radii(v: number | DOMPointInit | (number | DOMPointInit)[] | undefined) {
		this.#radii = v;
		this._pathDirty = true;
	}

	constructor(opts: RoundRectProps) {
		super(opts);
		this.#radii = opts.radii;
	}

	_buildPath(): IPath2D {
		const p = new this.root.Path2D();
		p.roundRect(0, 0, this.width, this.height, this.#radii);
		return p;
	}
}
