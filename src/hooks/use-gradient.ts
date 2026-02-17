import { useMemo } from 'react';
import { useParent } from './use-parent.js';
import type { ColorStop } from '../gradient.js';

/**
 * Create a memoized `CanvasGradient` for a linear gradient.
 * The gradient is created once via `useMemo` and only recreated
 * when the parameters change.
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
