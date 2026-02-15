import { Shape, type ShapeProps } from './shape.js';
import type { Point } from './types.js';

export type LineProps = Omit<ShapeProps, 'width' | 'height'> & {
	points: Point[];
};

export class Line extends Shape {
	points: Point[];

	constructor(opts: LineProps) {
		const points = opts.points;
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const p of points) {
			if (p.x < minX) minX = p.x;
			if (p.y < minY) minY = p.y;
			if (p.x > maxX) maxX = p.x;
			if (p.y > maxY) maxY = p.y;
		}
		const width = maxX - minX;
		const height = maxY - minY;
		super({
			...opts,
			width,
			height,
		});
		this.points = points;
	}

	get path() {
		const p = new this.root.Path2D();
		const points = this.points;
		if (points.length > 0) {
			p.moveTo(points[0].x, points[0].y);
			for (let i = 1; i < points.length; i++) {
				p.lineTo(points[i].x, points[i].y);
			}
		}
		return p;
	}
}
