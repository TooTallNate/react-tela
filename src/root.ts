import type { Entity } from './entity';

export type Context = Omit<
	CanvasRenderingContext2D,
	'getContextAttributes' | 'drawFocusIfNeeded' | 'canvas'
> & {
	canvas: { width: number; height: number };
};

export class Root {
	ctx: Context;
	entities: Entity[];
	#rerenderId?: ReturnType<typeof requestAnimationFrame>;

	constructor(ctx: Context) {
		this.ctx = ctx;
		this.entities = [];
		this.render = this.render.bind(this);
	}

	clear() {
		for (const e of this.entities) {
			e.root = undefined;
		}
		this.entities.length === 0;
	}

	add(entity: Entity) {
		entity.root = this;
		this.entities.push(entity);
	}

	remove(entity: Entity) {
		const i = this.entities.indexOf(entity);
		if (i !== -1) {
			entity.root = undefined;
			this.entities.splice(i, 1);
		}
	}

	insertBefore(child: Entity, beforeChild: Entity) {
		const i = this.entities.indexOf(beforeChild);
		if (i === -1) {
			throw new Error(
				'Entity to insert before is not a child of this Root',
			);
		}
		child.root = this;
		this.entities.splice(i, 0, child);
	}

	render() {
		this.#rerenderId = undefined;
		const { ctx } = this;
		const { canvas } = ctx;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (const entity of this.entities) {
			ctx.save();
			entity.render();
			ctx.restore();
		}
	}

	queueRender() {
		if (!this.#rerenderId) {
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
