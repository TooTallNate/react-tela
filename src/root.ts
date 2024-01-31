import { TelaEventTarget } from './event-target';
import type { Entity } from './entity';
import type {
	IDOMMatrix,
	ICanvas,
	IImage,
	IPath2D,
	ICanvasRenderingContext2D,
} from './types';

export interface RootParams {
	createCanvas?: (w: number, h: number) => ICanvas;
	DOMMatrix?: new (init?: string | number[]) => IDOMMatrix;
	Image?: new () => IImage;
	Path2D?: new (path?: string) => IPath2D;
}

export class Root extends TelaEventTarget {
	ctx: ICanvasRenderingContext2D;
	dirty: boolean;
	entities: Entity[];
	renderCount: number;
	renderQueued: boolean;
	DOMMatrix: new (init?: string | number[]) => IDOMMatrix;
	Image: new () => IImage;
	Path2D: new (path?: string) => IPath2D;

	constructor(ctx: ICanvasRenderingContext2D, opts: RootParams = {}) {
		super();
		this.ctx = ctx;
		this.dirty = false;
		this.entities = [];
		this.render = this.render.bind(this);
		this.renderCount = 0;
		this.renderQueued = false;
		this.DOMMatrix = opts.DOMMatrix || DOMMatrix;
		this.Path2D = opts.Path2D || Path2D;
		this.Image = opts.Image || Image;
		if (opts.createCanvas) this.createCanvas = opts.createCanvas;
	}

	then(r?: (value: Event) => void) {
		if (r) {
			this.addEventListener('render', r, { once: true });
		}
	}

	createCanvas(width: number, height: number): ICanvas {
		return new OffscreenCanvas(width, height);
	}

	clear() {
		for (const e of this.entities) {
			e._root = null;
		}
		this.entities.length === 0;
		this.queueRender();
	}

	add(entity: Entity) {
		if (entity._root) entity._root.remove(entity);
		entity._root = this;
		this.entities.push(entity);
		this.queueRender();
	}

	remove(entity: Entity) {
		const i = this.entities.indexOf(entity);
		if (i !== -1) {
			entity._root = null;
			this.entities.splice(i, 1);
			this.queueRender();
		}
	}

	insertBefore(child: Entity, beforeChild: Entity) {
		const i = this.entities.indexOf(beforeChild);
		if (i === -1) {
			throw new Error(
				'Entity to insert before is not a child of this Root',
			);
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
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (const entity of this.entities) {
			ctx.save();
			entity.render();
			ctx.restore();
		}
		this.dirty = false;
		this.dispatchEvent(new Event('render'));
	}

	queueRender() {
		if (this.renderQueued) return;
		this.dirty = true;
		this.renderQueued = true;
		queueMicrotask(this.render);
	}
}
