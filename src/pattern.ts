import { Entity } from './entity.js';
import { Group, GroupRoot, type GroupProps } from './group.js';

/**
 * How a pattern image is repeated when tiling.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createPattern | MDN createPattern()}
 */
export type PatternRepetition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

/**
 * Props for the {@link Pattern} component.
 *
 * A `<Pattern>` renders its children to an offscreen canvas and creates a
 * `CanvasPattern` from it. Use the pattern's ref as a fill or stroke on other shapes.
 */
export interface PatternProps extends GroupProps {
	/** The width of the pattern tile. */
	width: number;
	/** The height of the pattern tile. */
	height: number;
	/** How the pattern repeats. @default "repeat" */
	repetition?: PatternRepetition;
}

/**
 * Renders its children to an offscreen canvas and creates a `CanvasPattern`.
 *
 * Access the pattern via a ref and use it as a `fill` or `stroke` on shapes.
 *
 * @example
 * ```tsx
 * const patternRef = useRef(null);
 * <Pattern ref={patternRef} width={20} height={20}>
 *   <Rect width={10} height={10} fill="red" />
 *   <Rect x={10} y={10} width={10} height={10} fill="blue" />
 * </Pattern>
 * <Rect width={200} height={200} fill={patternRef} />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createPattern | MDN createPattern()}
 */
export class Pattern extends Group {
	pattern: CanvasPattern | null = null;
	repetition: PatternRepetition;

	constructor(opts: PatternProps & { root: GroupRoot }) {
		super(opts);
		this.repetition = opts.repetition ?? 'repeat';
	}

	render(): void {
		// Call Entity.render() for transforms/alpha
		Entity.prototype.render.call(this);
		// Render children to sub-canvas
		this.subroot.render();
		// Create pattern from the sub-canvas instead of drawImage
		this.pattern = this.root.ctx.createPattern(
			this.subroot.ctx.canvas,
			this.repetition,
		);
	}
}
