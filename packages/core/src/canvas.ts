import { Entity, EntityProps } from './entity.js';
import { Root } from './root.js';
import type { ICanvas, ICanvasRenderingContext2D } from './types.js';

/**
 * Props for the {@link Canvas} component.
 *
 * A `<Canvas>` creates an offscreen sub-canvas that you can draw to via
 * its 2D rendering context, then composites the result into the parent canvas.
 */
export interface CanvasProps extends EntityProps {}

/**
 * An entity that manages its own offscreen sub-canvas and composites
 * it into the parent rendering context during render.
 *
 * Use the ref to access `getContext('2d')` for imperative drawing.
 *
 * @example
 * ```tsx
 * const canvasRef = useRef<CanvasRef>(null);
 * // Draw imperatively via canvasRef.current.getContext('2d')
 * <Canvas ref={canvasRef} x={0} y={0} width={200} height={200} />
 * ```
 */
export class Canvas extends Entity {
	subcanvas: ICanvas;

	constructor(opts: CanvasProps, root: Root) {
		super(opts);
		this.subcanvas = new root.Canvas(this.width, this.height);
	}

	getContext(
		...args: Parameters<ICanvas['getContext']>
	): ICanvasRenderingContext2D | null {
		return this.subcanvas.getContext(...args);
	}

	render(): void {
		// Resize the sub-canvas if dimensions changed
		if (this.subcanvas.width !== this.width) {
			this.subcanvas.width = this.width;
		}
		if (this.subcanvas.height !== this.height) {
			this.subcanvas.height = this.height;
		}
		super.render();
		this.root.ctx.drawImage(this.subcanvas, 0, 0, this.width, this.height);
	}
}
