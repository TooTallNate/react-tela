// @ts-expect-error No types for "parse-svg-path"
import parseSvgPath from 'parse-svg-path';
import { Shape, type ShapeProps } from './shape.js';
import { IPath2D } from './types.js';

export type PathProps = ShapeProps & {
	d: string;
};

export class Path extends Shape {
	#d!: string;
	#path!: IPath2D;

	constructor(opts: PathProps) {
		super(opts);
		this.d = opts.d;
	}

	get d() {
		return this.#d;
	}

	set d(v: string) {
		const parsed: [string, ...number[]][] = parseSvgPath(v);
		let modified = parsed
			.map((c) => `${c[0]}${c.slice(1).join(',')}`)
			.join('');
		// TODO: map absolute coordinates to relative
		//console.log({ parsed, v, modified });
		this.#d = modified;
		this.#path = new this.root.Path2D(modified);
	}

	get path() {
		return this.#path;
	}
}
