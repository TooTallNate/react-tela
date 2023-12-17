import { Entity, EntityProps } from './entity';
import { type Context, Root } from './root';

export interface GroupProps extends EntityProps {}

export class Group extends Entity {
	subroot: Root;
	subcanvas: OffscreenCanvas;

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
		this.root?.ctx.drawImage(
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

	constructor(ctx: Context, group: Group) {
		super(ctx);
		this.#group = group;
	}

	queueRender(): void {
		this.dirty = true;
		this.#group.root?.queueRender();
	}
}
