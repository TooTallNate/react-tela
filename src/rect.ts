import { Shape, type ShapeProps } from './shape';

export type RectProps = ShapeProps;

export class Rect extends Shape {
	renderShape(ctx: CanvasRenderingContext2D): undefined {
		ctx.rect(0, 0, this.calculatedWidth, this.calculatedHeight);
	}
}
