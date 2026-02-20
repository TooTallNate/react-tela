import { Shape, type ShapeProps } from './shape.js';

/**
 * Props for the {@link Rect} component. Identical to {@link ShapeProps}.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect | MDN rect()}
 */
export type RectProps = ShapeProps;

/**
 * Renders a rectangle on the canvas.
 *
 * @example
 * ```tsx
 * <Rect x={10} y={10} width={100} height={60} fill="blue" stroke="black" />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect | MDN rect()}
 */
export class Rect extends Shape {}
