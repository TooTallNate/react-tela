import { Entity, EntityProps } from './entity';
import { Root } from './root';

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
		this.subroot = new Root(this.subcanvas.getContext('2d')!);
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
