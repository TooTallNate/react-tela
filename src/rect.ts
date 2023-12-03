import { Shape, type ShapeProps } from './shape';

export interface RectProps extends ShapeProps {}

export class Rect extends Shape {
	renderShape(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.rect(
			this.offsetX,
			this.offsetY,
			this.calculatedWidth,
			this.calculatedHeight,
		);
	}
}
