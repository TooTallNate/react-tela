import { Entity, type EntityProps } from './entity.js';
import type { Root } from './root.js';
import type { IImage } from './types.js';

/**
 * Props for the {@link Image} component.
 *
 * Supports loading an image from a URL and drawing it (or a sub-rectangle of it)
 * on the canvas. Width and height default to the image's natural dimensions.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage | MDN drawImage()}
 */
export interface ImageProps extends EntityProps {
	/** The image URL to load and display. */
	src: string;
	/** The x-coordinate of the source sub-rectangle. */
	sx?: number;
	/** The y-coordinate of the source sub-rectangle. */
	sy?: number;
	/** The width of the source sub-rectangle. */
	sw?: number;
	/** The height of the source sub-rectangle. */
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

/**
 * Renders an image loaded from a URL on the canvas.
 *
 * The image is loaded asynchronously. If `width`/`height` are not specified,
 * they default to the image's natural dimensions once loaded.
 *
 * @example
 * ```tsx
 * <Image src="https://example.com/photo.png" x={10} y={10} width={200} height={150} />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage | MDN drawImage()}
 */
export class Image extends Entity {
	#root: Root;
	#src: string;
	#image?: IImage;
	#abortController?: AbortController;
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
		this.addEventListener('remove', () => this.abort(), { once: true });
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
		// Abort any in-flight load
		this.#abortController?.abort();
		const controller = new AbortController();
		this.#abortController = controller;
		try {
			const img = await this.#root.loadImage(this.#src, {
				signal: controller.signal,
			});
			this.#image = img;
			if (this.width === 0) {
				this.width = img.naturalWidth;
			}
			if (this.height === 0) {
				this.height = img.naturalHeight;
			}
			this.root?.queueRender();
		} catch (err: unknown) {
			// Ignore abort errors — they are expected during cleanup
			if (err instanceof DOMException && err.name === 'AbortError') return;
			throw err;
		}
	}

	/**
	 * Cancel any in-flight image load. Called when the entity is removed from the tree.
	 */
	abort() {
		this.#abortController?.abort();
		this.#abortController = undefined;
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
