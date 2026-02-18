import { Entity, type EntityProps } from './entity.js';
import type { Root } from './root.js';
import type { IImage } from './types.js';

export interface ImageProps extends EntityProps {
	src: string;
	sx?: number;
	sy?: number;
	sw?: number;
	sh?: number;
	/**
	 * Whether image smoothing is enabled when scaling. Set to `false` for pixel art or crisp scaling.
	 *
	 * @default true (browser default)
	 */
	imageSmoothing?: boolean;
	/**
	 * The quality of image smoothing. Only applies when `imageSmoothing` is not `false`.
	 *
	 * @default "low" (browser default)
	 */
	imageSmoothingQuality?: ImageSmoothingQuality;
}

export class Image extends Entity {
	#root: Root;
	#src: string;
	#image?: IImage;
	sx?: number;
	sy?: number;
	sw?: number;
	sh?: number;
	imageSmoothing?: boolean;
	imageSmoothingQuality?: ImageSmoothingQuality;

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
		this.imageSmoothing = opts.imageSmoothing;
		this.imageSmoothingQuality = opts.imageSmoothingQuality;
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
		const img = await this.#root.loadImage(this.#src);
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
		const { root } = this;
		const img = this.#image;
		if (!img) return;
		if (typeof this.imageSmoothing === 'boolean') {
			root.ctx.imageSmoothingEnabled = this.imageSmoothing;
		}
		if (this.imageSmoothingQuality) {
			root.ctx.imageSmoothingQuality = this.imageSmoothingQuality;
		}
		root.ctx.drawImage(
			img,
			this.sx ?? 0,
			this.sy ?? 0,
			this.sw ?? img.naturalWidth,
			this.sh ?? img.naturalHeight,
			0,
			0,
			this.width,
			this.height,
		);
	}
}
