import { Entity, type EntityProps } from './entity';
import type { Root } from './root';
import type { IImage, PercentageString } from './types';

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
	#root: Root;
	#src: string;
	#image?: IImage;
	sx?: number;
	sy?: number;
	sw?: number;
	sh?: number;

	constructor(opts: ImageProps, root: Root) {
		super({
			width: 0,
			height: 0,
			...opts,
		});
		this.sx = opts.sx;
		this.sy = opts.sy;
		this.sw = opts.sw;
		this.sh = opts.sh;
		this.#root = root;
		this.#src = opts.src;
		this.loadImage();
	}

	get src() {
		return this.#src;
	}

	set src(v: string) {
		this.#src = v;
		this.loadImage();
	}

	async loadImage() {
		let img: IImage | undefined;
		try {
			img = await this.#root.loadImage(this.#src);
		} catch (err) {
			throw err;
		}

		this.#image = img;
		if (this.width === 0) {
			this.width = img.naturalWidth;
		}
		if (this.height === 0) {
			this.height = img.naturalHeight;
		}
		this.root?.queueRender();
	}

	render(): void {
		super.render();
		let { root } = this;
		const img = this.#image;
		if (!img) return;
		root.ctx.drawImage(
			img,
			this.sx ?? 0,
			this.sy ?? 0,
			this.sw ?? img.naturalWidth,
			this.sh ?? img.naturalHeight,
			0,
			0,
			this.calculatedWidth,
			this.calculatedHeight,
		);
	}
}
