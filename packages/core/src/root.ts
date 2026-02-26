import type { Entity } from './entity.js';
import { TelaEventTarget } from './event-target.js';
import { proxyEvents } from './events.js';
import type {
	ICanvas,
	ICanvasRenderingContext2D,
	IDOMMatrix,
	IImage,
	IPath2D,
} from './types.js';

/**
 * Configuration options for creating a {@link Root}.
 *
 * Provide custom implementations of Canvas, DOMMatrix, Path2D, and image loading
 * to support non-browser environments (e.g. node-canvas, skia-canvas).
 */
/**
 * Options for {@link Root.loadImage}.
 */
export interface LoadImageOptions {
	/** An `AbortSignal` to cancel the image load. */
	signal?: AbortSignal;
}

export interface RootParams {
	Canvas?: new (w: number, h: number) => ICanvas;
	DOMMatrix?: new (init?: string | number[]) => IDOMMatrix;
	Path2D?: new (path?: string) => IPath2D;
	loadImage?: (src: string) => Promise<IImage>;
}

function createOffscreenCanvas(doc: Document) {
	return (w: number, h: number) => {
		const c = doc.createElement('canvas');
		c.width = w;
		c.height = h;
		return c;
	};
}

/**
 * The root rendering context for a react-tela canvas.
 *
 * Manages the entity tree, batches renders via microtasks, proxies DOM events
 * to entities, and provides factory constructors (`Canvas`, `DOMMatrix`, `Path2D`)
 * for platform-agnostic rendering.
 */
export class Root extends TelaEventTarget {
	ctx: ICanvasRenderingContext2D;
	dirty: boolean;
	entities: Entity[];
	renderCount: number;
	renderQueued: boolean;
	Canvas: new (
		w: number,
		h: number,
	) => ICanvas;
	DOMMatrix: new (
		init?: string | number[],
	) => IDOMMatrix;
	Path2D: new (
		path?: string,
	) => IPath2D;

	#loadImageImpl: (src: string) => Promise<IImage>;

	constructor(ctx: ICanvasRenderingContext2D, opts: RootParams = {}) {
		super();
		this.ctx = ctx;
		this.dirty = false;
		this.entities = [];
		this.render = this.render.bind(this);
		this.renderCount = 0;
		this.renderQueued = false;
		this.Canvas =
			opts.Canvas ||
			globalThis.OffscreenCanvas ||
			createOffscreenCanvas((ctx.canvas as HTMLCanvasElement).ownerDocument);
		this.DOMMatrix = opts.DOMMatrix || globalThis.DOMMatrix;
		this.Path2D = opts.Path2D || globalThis.Path2D;
		this.#loadImageImpl = opts.loadImage ?? Root.#defaultLoadImage;
		this.proxyEvents();
	}

	static async #defaultLoadImage(src: string): Promise<IImage> {
		const img = new Image();
		await new Promise((res, rej) => {
			img.onload = res;
			img.onerror = rej;
			img.src = src;
		});
		return img;
	}

	async loadImage(src: string, opts?: LoadImageOptions): Promise<IImage> {
		const signal = opts?.signal;
		if (signal?.aborted) {
			throw (
				signal.reason ??
				new DOMException('The operation was aborted.', 'AbortError')
			);
		}
		return new Promise<IImage>((resolve, reject) => {
			let settled = false;
			const onAbort = () => {
				if (settled) return;
				settled = true;
				reject(
					signal!.reason ??
						new DOMException('The operation was aborted.', 'AbortError'),
				);
			};
			signal?.addEventListener('abort', onAbort, { once: true });
			this.#loadImageImpl(src).then(
				(img) => {
					if (settled) return;
					settled = true;
					signal?.removeEventListener('abort', onAbort);
					resolve(img);
				},
				(err) => {
					if (settled) return;
					settled = true;
					signal?.removeEventListener('abort', onAbort);
					reject(err);
				},
			);
		});
	}

	then(r?: (value: Event) => void) {
		if (r) {
			this.addEventListener('render', r, { once: true });
		}
	}

	proxyEvents() {
		proxyEvents(this.ctx.canvas as EventTarget, this, true);
	}

	clear() {
		for (const e of this.entities) {
			e._root = null;
		}
		this.entities.length = 0;
		this.queueRender();
	}

	add(entity: Entity) {
		if (entity._root) entity._root.remove(entity);
		entity._root = this;
		this.entities.push(entity);
		entity.dispatchEvent(new Event('add'));
		this.queueRender();
	}

	remove(entity: Entity) {
		const i = this.entities.indexOf(entity);
		if (i !== -1) {
			entity._root = null;
			this.entities.splice(i, 1);
			entity.dispatchEvent(new Event('remove'));
			this.queueRender();
		}
	}

	insertBefore(child: Entity, beforeChild: Entity) {
		const i = this.entities.indexOf(beforeChild);
		if (i === -1) {
			throw new Error('Entity to insert before is not a child of this Root');
		}
		if (child._root) child._root.remove(child);
		child._root = this;
		this.entities.splice(i, 0, child);
		this.queueRender();
	}

	render() {
		this.renderQueued = false;
		if (!this.dirty) return;
		this.renderCount++;
		const { ctx } = this;
		const { canvas } = ctx;
		ctx.resetTransform();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (const entity of this.entities) {
			if (entity._hidden) continue;
			ctx.save();
			entity.render();
			ctx.restore();
		}
		this.dirty = false;
		this.dispatchEvent(new Event('render'));
	}

	get width() {
		return this.ctx.canvas.width;
	}

	get height() {
		return this.ctx.canvas.height;
	}

	queueRender() {
		if (this.renderQueued) return;
		this.dirty = true;
		this.renderQueued = true;
		queueMicrotask(this.render);
	}
}
