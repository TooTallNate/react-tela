import { Root } from './root.js';
import { Entity, EntityProps } from './entity.js';
import type { ICanvas } from './types.js';

export interface CanvasProps extends EntityProps {}

export class Canvas extends Entity {
	subcanvas: ICanvas;

	constructor(opts: CanvasProps, root: Root) {
		super(opts);
		this.subcanvas = new root.Canvas(this.width, this.height);
	}

	getContext(...args: Parameters<ICanvas['getContext']>) {
		return this.subcanvas.getContext(...args);
	}

	render(): void {
		super.render();
		this.root.ctx.drawImage(this.subcanvas, 0, 0, this.width, this.height);
	}
}
