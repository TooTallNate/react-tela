import { Root } from './root.js';
import { Entity, EntityProps } from './entity.js';
import { proxyEvents } from './events.js';
import type { ICanvasRenderingContext2D } from './types.js';

/**
 * Props for the {@link Group} component.
 *
 * A `<Group>` renders its children into a separate offscreen canvas,
 * then draws the result into the parent context. This enables isolated
 * transforms, opacity, and event handling for a subtree.
 */
export interface GroupProps extends EntityProps {
	/**
	 * Border radius for clipping the composited group output.
	 * A single number applies a uniform radius to all corners;
	 * an array `[tl, tr, br, bl]` specifies per-corner radii.
	 *
	 * When set, the group's composited image is clipped to a
	 * rounded rectangle before being drawn onto the parent canvas.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect | MDN roundRect()}
	 */
	borderRadius?: number | DOMPointInit | (number | DOMPointInit)[];
}

/**
 * Groups child entities into a separate offscreen canvas that is composited
 * back into the parent. This allows group-level transforms and opacity.
 *
 * @example
 * ```tsx
 * <Group x={50} y={50} alpha={0.5}>
 *   <Rect width={40} height={40} fill="red" />
 *   <Rect x={20} y={20} width={40} height={40} fill="blue" />
 * </Group>
 * ```
 */
export class Group extends Entity {
	subroot: Root;
	#borderRadius?: number | DOMPointInit | (number | DOMPointInit)[];

	get borderRadius() {
		return this.#borderRadius;
	}

	set borderRadius(v: number | DOMPointInit | (number | DOMPointInit)[] | undefined) {
		this.#borderRadius = v;
		this.root?.queueRender();
	}

	constructor(opts: GroupProps & { root: GroupRoot }) {
		super(opts);
		this.subroot = opts.root;
		this.#borderRadius = opts.borderRadius;
		proxyEvents(this, this.subroot, false);
	}

	render(): void {
		super.render();
		this.subroot.render();
		const { ctx } = this.root;
		const borderRadius = this.#borderRadius;
		if (borderRadius != null) {
			ctx.save();
			ctx.beginPath();
			ctx.roundRect(0, 0, this.width, this.height, borderRadius);
			ctx.clip();
			ctx.drawImage(
				this.subroot.ctx.canvas,
				0,
				0,
				this.width,
				this.height,
			);
			ctx.restore();
		} else {
			ctx.drawImage(
				this.subroot.ctx.canvas,
				0,
				0,
				this.width,
				this.height,
			);
		}
	}
}

/**
 * A {@link Root} used internally by {@link Group} and {@link Pattern} components
 * to manage a subtree of entities rendered to an offscreen canvas.
 */
export class GroupRoot extends Root {
	parent: Root;

	constructor(ctx: ICanvasRenderingContext2D, parent: Root) {
		super(ctx, parent);
		this.parent = parent;
	}

	queueRender(): void {
		this.dirty = true;
		this.parent.queueRender();
	}
}
