import { useMemo } from 'react';
import { useParent } from './use-parent.js';
import type { ColorStop } from '@react-tela/core';

/**
 * Create a memoized `CanvasGradient` for a linear gradient.
 *
 * The gradient is created via the parent canvas context and only recreated
 * when the parameters change.
 *
 * @param x0 - The x-coordinate of the gradient start point.
 * @param y0 - The y-coordinate of the gradient start point.
 * @param x1 - The x-coordinate of the gradient end point.
 * @param y1 - The y-coordinate of the gradient end point.
 * @param stops - Array of `[offset, color]` color stops.
 * @returns A `CanvasGradient` to use as a `fill` or `stroke`.
 *
 * @example
 * ```tsx
 * const gradient = useLinearGradient(0, 0, 200, 0, [
 *   [0, 'red'],
 *   [1, 'blue'],
 * ]);
 * <Rect width={200} height={100} fill={gradient} />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient | MDN createLinearGradient()}
 */
export function useLinearGradient(
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	stops: ColorStop[],
): CanvasGradient {
	const { ctx } = useParent();
	return useMemo(() => {
		const g = ctx.createLinearGradient(x0, y0, x1, y1);
		for (const [offset, color] of stops) {
			g.addColorStop(offset, color);
		}
		return g;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ctx, x0, y0, x1, y1, stops]);
}

/**
 * Create a memoized `CanvasGradient` for a radial gradient.
 *
 * @param x0 - The x-coordinate of the start circle center.
 * @param y0 - The y-coordinate of the start circle center.
 * @param r0 - The radius of the start circle.
 * @param x1 - The x-coordinate of the end circle center.
 * @param y1 - The y-coordinate of the end circle center.
 * @param r1 - The radius of the end circle.
 * @param stops - Array of `[offset, color]` color stops.
 * @returns A `CanvasGradient` to use as a `fill` or `stroke`.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient | MDN createRadialGradient()}
 */
export function useRadialGradient(
	x0: number,
	y0: number,
	r0: number,
	x1: number,
	y1: number,
	r1: number,
	stops: ColorStop[],
): CanvasGradient {
	const { ctx } = useParent();
	return useMemo(() => {
		const g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		for (const [offset, color] of stops) {
			g.addColorStop(offset, color);
		}
		return g;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ctx, x0, y0, r0, x1, y1, r1, stops]);
}

/**
 * Create a memoized `CanvasGradient` for a conic gradient.
 *
 * @param startAngle - The angle (in radians) at which to begin the gradient.
 * @param x - The x-coordinate of the center of the gradient.
 * @param y - The y-coordinate of the center of the gradient.
 * @param stops - Array of `[offset, color]` color stops.
 * @returns A `CanvasGradient` to use as a `fill` or `stroke`.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createConicGradient | MDN createConicGradient()}
 */
export function useConicGradient(
	startAngle: number,
	x: number,
	y: number,
	stops: ColorStop[],
): CanvasGradient {
	const { ctx } = useParent();
	return useMemo(() => {
		const g = ctx.createConicGradient(startAngle, x, y);
		for (const [offset, color] of stops) {
			g.addColorStop(offset, color);
		}
		return g;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ctx, startAngle, x, y, stops]);
}
