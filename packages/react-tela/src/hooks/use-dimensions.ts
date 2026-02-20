import { useMemo } from 'react';
import { useParent } from './use-parent.js';

/**
 * Returns the current `{ width, height }` of the parent canvas.
 *
 * The returned object is memoized and only changes when the canvas dimensions change.
 *
 * @returns An object with `width` and `height` in pixels.
 */
export function useDimensions() {
	const { width, height } = useParent().ctx.canvas;
	return useMemo(() => {
		return { width, height };
	}, [width, height]);
}
