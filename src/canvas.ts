import { Root } from './root.js';
import { Entity, EntityProps } from './entity.js';
import type { ICanvas, ICanvasRenderingContext2D } from './types.js';

export interface CanvasProps extends EntityProps {}

export class Canvas extends Entity {
	subcanvas: ICanvas;

	constructor(opts: CanvasProps, root: Root) {
		super(opts);
		this.subcanvas = new root.Canvas(this.width, this.height);
	}

	getContext(...args: Parameters<ICanvas['getContext']>): ICanvasRenderingContext2D | null {
		return this.subcanvas.getContext(...args);
	}

	render(): void {
		// Resize the sub-canvas if dimensions changed
		if (this.subcanvas.width !== this.width) {
			this.subcanvas.width = this.width;
		}
		if (this.subcanvas.height !== this.height) {
			this.subcanvas.height = this.height;
		}
		super.render();
		this.root.ctx.drawImage(this.subcanvas, 0, 0, this.width, this.height);
	}
}
