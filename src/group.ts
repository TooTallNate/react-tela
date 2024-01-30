import { Entity, EntityProps } from './entity';
import { Root } from './root';
import type { ICanvas, ICanvasRenderingContext2D } from './types';

export interface GroupProps extends EntityProps {}

export class Group extends Entity {
	subroot: Root;
	subcanvas: ICanvas;

	constructor(opts: GroupProps) {
		super(opts);
		this.subcanvas = new OffscreenCanvas(
			this.calculatedWidth,
			this.calculatedHeight,
		);
		this.subroot = new GroupRoot(this.subcanvas.getContext('2d')!, this);
	}

	render(): void {
		super.render();
		this.subroot.render();
		this.root.ctx.drawImage(
			this.subcanvas,
			0,
			0,
			this.calculatedWidth,
			this.calculatedHeight,
		);
	}
}

class GroupRoot extends Root {
	#group: Group;

	constructor(ctx: ICanvasRenderingContext2D, group: Group) {
		super(ctx);
		this.#group = group;
	}

	queueRender(): void {
		this.dirty = true;
		this.#group._root?.queueRender();
	}
}
