import { Entity, EntityProps } from './entity';
import type { PercentageString } from './types';

export interface ImageProps extends Omit<EntityProps, 'width' | 'height'> {
	src: string;
	width?: number | PercentageString;
	height?: number | PercentageString;
}

export class Image extends Entity {
	#src: string;
	image?: HTMLImageElement;

	constructor(opts: ImageProps) {
		super({
			width: 0,
			height: 0,
			...opts,
		});
		this.#src = opts.src;
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
			image.src = this.src;
			image.onload = this.#onload.bind(this);
		}
		root.ctx.drawImage(
			image,
			this.offsetX,
			this.offsetY,
			this.calculatedWidth,
			this.calculatedHeight,
		);
	}

	#onload() {
		const { image } = this;
		if (!image) return;
		this.width = image.naturalWidth;
		this.height = image.naturalHeight;
	}
}
