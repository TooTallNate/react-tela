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
	 * The width of the inner (backing) content canvas. When larger than
	 * `width`, the Group acts as a viewport window into a larger content area.
	 */
	contentWidth?: number;
	/**
	 * The height of the inner (backing) content canvas. When larger than
	 * `height`, the Group acts as a viewport window into a larger content area.
	 */
	contentHeight?: number;
	/**
	 * Vertical scroll offset into the content. Positive values scroll
	 * content upward. Clamped to `[0, max(0, contentHeight - height)]`.
	 *
	 * @default 0
	 */
	scrollTop?: number;
	/**
	 * Horizontal scroll offset into the content. Positive values scroll
	 * content leftward. Clamped to `[0, max(0, contentWidth - width)]`.
	 *
	 * @default 0
	 */
	scrollLeft?: number;
	/**
	 * Overflow behavior. `'hidden'` clips content at the viewport bounds.
	 * `'scroll'` behaves identically but semantically indicates scrollable content.
	 *
	 * @default 'hidden'
	 */
	overflow?: 'hidden' | 'scroll';
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
	contentWidth?: number;
	contentHeight?: number;
	scrollTop: number;
	scrollLeft: number;
	overflow: 'hidden' | 'scroll';

	constructor(opts: GroupProps & { root: GroupRoot }) {
		super(opts);
		this.subroot = opts.root;
		this.contentWidth = opts.contentWidth;
		this.contentHeight = opts.contentHeight;
		this.scrollTop = opts.scrollTop ?? 0;
		this.scrollLeft = opts.scrollLeft ?? 0;
		this.overflow = opts.overflow ?? 'hidden';
		proxyEvents(this, this.subroot, false);
	}

	render(): void {
		super.render();
		this.subroot.render();

		const cw = this.contentWidth;
		const ch = this.contentHeight;

		if (cw !== undefined || ch !== undefined) {
			// Viewport mode: draw a sub-region of the content canvas
			const maxScrollLeft = Math.max(0, (cw ?? this.width) - this.width);
			const maxScrollTop = Math.max(0, (ch ?? this.height) - this.height);
			const sx = Math.max(0, Math.min(this.scrollLeft, maxScrollLeft));
			const sy = Math.max(0, Math.min(this.scrollTop, maxScrollTop));
			this.root.ctx.drawImage(
				this.subroot.ctx.canvas,
				sx,
				sy,
				this.width,
				this.height,
				0,
				0,
				this.width,
				this.height,
			);
		} else {
			this.root.ctx.drawImage(
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
