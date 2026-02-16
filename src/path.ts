// @ts-expect-error No types for "parse-svg-path"
import parseSvgPath from 'parse-svg-path';
import { Shape, type ShapeProps } from './shape.js';
import type { IPath2D } from './types.js';

export type PathProps = ShapeProps & {
	width: number;
	height: number;
	d: string;
};

export class Path extends Shape {
	#d: string;

	get d() {
		return this.#d;
	}

	set d(v: string) {
		if (this.#d !== v) {
			this.#d = v;
			this._pathDirty = true;
		}
	}

	constructor(opts: PathProps) {
		super(opts);
		this.#d = opts.d;
	}

	_buildPath(): IPath2D {
		const parsed: [string, ...number[]][] = parseSvgPath(this.#d);
		const modified = parsed
			.map((c) => `${c[0]}${c.slice(1).join(',')}`)
			.join('');
		return new this.root.Path2D(modified);
	}
}
