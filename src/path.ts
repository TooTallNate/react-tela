// @ts-expect-error No types for "parse-svg-path"
import parseSvgPath from 'parse-svg-path';
import { Shape, type ShapeProps } from './shape.js';

export type PathProps = ShapeProps & {
	d: string;
};

export class Path extends Shape {
	#d!: string;
	#path!: Path2D;

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
		this.#path = new Path2D(modified);
	}

	constructor(opts: PathProps) {
		super(opts);
		this.d = opts.d;
	}

	renderShape(): Path2D {
		return this.#path;
	}
}
