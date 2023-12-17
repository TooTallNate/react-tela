import { Entity, EntityProps } from './entity';
import type { PercentageString } from './types';

export interface ImageProps extends Omit<EntityProps, 'width' | 'height'> {
	src: string;
	sx?: number;
	sy?: number;
	sw?: number;
	sh?: number;
	width?: number | PercentageString;
	height?: number | PercentageString;
}

export class Image extends Entity {
	#src: string;
	image?: HTMLImageElement;
	sx?: number;
	sy?: number;
	sw?: number;
	sh?: number;

	constructor(opts: ImageProps) {
		super({
			width: 0,
			height: 0,
			...opts,
		});
		this.#src = opts.src;
		this.sx = opts.sx;
		this.sy = opts.sy;
		this.sw = opts.sw;
		this.sh = opts.sh;
	}

	get src() {
		return this.#src;
	}

	set src(v: string) {
		this.#src = v;
		if (this.image) {
			this.image.src = v;
		}
	}

	render(): void {
		super.render();
		let { image, root } = this;
		if (!root) {
			throw new Error(
				`${this.constructor.name} instance has not been added to a root context`,
			);
		}
		if (!image) {
			image = this.image = root.createImage();
			image.onload = this.#onload.bind(this);
			image.src = this.src;
		}
		root.ctx.drawImage(
			image,
			this.sx ?? 0,
			this.sy ?? 0,
			this.sw ?? image.naturalWidth,
			this.sh ?? image.naturalHeight,
			0,
			0,
			this.calculatedWidth,
			this.calculatedHeight,
		);
	}

	#onload() {
		const { image, root } = this;
		if (!image) return;
		if (this.width === 0) {
			this.width = image.naturalWidth;
		}
		if (this.height === 0) {
			this.height = image.naturalHeight;
		}
		if (root) {
			root.queueRender();
		}
	}
}
