import { Root } from './root.js';
import { Entity, EntityProps } from './entity.js';
import { proxyEvents } from './events.js';
import type { ICanvasRenderingContext2D } from './types.js';

export interface GroupProps extends EntityProps {}

export class Group extends Entity {
	subroot: Root;

	constructor(opts: GroupProps & { root: GroupRoot }) {
		super(opts);
		this.subroot = opts.root;
		proxyEvents(this, this.subroot, false);
	}

	render(): void {
		super.render();
		this.subroot.render();
		this.root.ctx.drawImage(
			this.subroot.ctx.canvas,
			0,
			0,
			this.width,
			this.height,
		);
	}
}

export class GroupRoot extends Root {
	parent: Root;

	constructor(ctx: ICanvasRenderingContext2D, parent: Root) {
		super(ctx, parent);
		this.parent = parent;
	}

	queueRender(): void {
		this.dirty = true;
		this.parent.queueRender();
	}
}
