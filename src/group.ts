import { Root, RootParams } from './root';
import { Entity, EntityProps } from './entity';
import type { ICanvas, ICanvasRenderingContext2D } from './types';
import { proxyEvents } from './events';

export interface GroupProps extends EntityProps {}

export class Group extends Entity {
	subroot: Root;
	subcanvas: ICanvas;

	constructor(opts: GroupProps, root: Root) {
		super(opts);
		this.subcanvas = new root.Canvas(
			this.calculatedWidth,
			this.calculatedHeight,
		);
		const ctx = this.subcanvas.getContext('2d');
		if (!ctx) {
			throw new TypeError(`canvas.getContext('2d') returned: ${ctx}`);
		}
		this.subroot = new GroupRoot(ctx, this, root);
		proxyEvents(this, this.subroot, false);
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

	constructor(ctx: ICanvasRenderingContext2D, group: Group, opts: RootParams) {
		super(ctx, opts);
		this.#group = group;
	}

	queueRender(): void {
		this.dirty = true;
		this.#group._root?.queueRender();
	}
}
