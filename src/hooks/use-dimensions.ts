import { useMemo } from 'react';
import { useParent } from './use-parent.js';

export function useDimensions() {
	const { width, height } = useParent().ctx.canvas;
	return useMemo(() => {
		return { width, height };
	}, [width, height]);
}
