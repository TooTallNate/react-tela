import type { Entity } from './entity';
import { TelaEventTarget } from './event-target';

export type Context = Omit<
	CanvasRenderingContext2D,
	'getContextAttributes' | 'drawFocusIfNeeded' | 'canvas'
> & {
	canvas: { width: number; height: number };
};

export class Root extends TelaEventTarget {
	ctx: Context;
	dirty: boolean;
	entities: Entity[];
	renderCount: number;
	#rerenderId?: ReturnType<typeof requestAnimationFrame>;

	constructor(ctx: Context) {
		super();
		this.ctx = ctx;
		this.dirty = false;
		this.entities = [];
		this.render = this.render.bind(this);
		this.renderCount = 0;
	}

	clear() {
		for (const e of this.entities) {
			e._root = null;
		}
		this.entities.length === 0;
		this.queueRender();
	}

	add(entity: Entity) {
		if (entity._root) entity.root.remove(entity);
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
		this.#rerenderId = undefined;
		if (!this.dirty) return;
		this.renderCount++;
		//console.log(`${this.constructor.name} Render Start`);
		const { ctx } = this;
		const { canvas } = ctx;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (const entity of this.entities) {
			ctx.save();
			entity.render();
			ctx.restore();
		}
		this.dirty = false;
		//console.log(`${this.constructor.name} Render End`);
	}

	queueRender() {
		if (!this.#rerenderId) {
			this.dirty = true;
			this.#rerenderId = requestAnimationFrame(this.render);
		}
	}

	createCanvas() {
		return new OffscreenCanvas(0, 0);
	}

	createImage() {
		return new Image();
	}
}
