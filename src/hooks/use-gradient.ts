import { useMemo } from 'react';
import {
	linearGradient,
	radialGradient,
	conicGradient,
	type ColorStop,
	type LinearGradientDescriptor,
	type RadialGradientDescriptor,
	type ConicGradientDescriptor,
} from '../gradient.js';

/**
 * Create a memoized linear gradient descriptor. The returned object is
 * referentially stable across re-renders as long as the parameters don't
 * change, enabling efficient caching in the render pipeline.
 */
export function useLinearGradient(
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	stops: ColorStop[],
): LinearGradientDescriptor {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => linearGradient(x0, y0, x1, y1, stops), [x0, y0, x1, y1, stops]);
}

/**
 * Create a memoized radial gradient descriptor.
 */
export function useRadialGradient(
	x0: number,
	y0: number,
	r0: number,
	x1: number,
	y1: number,
	r1: number,
	stops: ColorStop[],
): RadialGradientDescriptor {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => radialGradient(x0, y0, r0, x1, y1, r1, stops), [x0, y0, r0, x1, y1, r1, stops]);
}

/**
 * Create a memoized conic gradient descriptor.
 */
export function useConicGradient(
	startAngle: number,
	x: number,
	y: number,
	stops: ColorStop[],
): ConicGradientDescriptor {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => conicGradient(startAngle, x, y, stops), [startAngle, x, y, stops]);
}
