import { useMemo } from 'react';
import { useParent } from './use-parent.js';

export function useDimensions() {
	const root = useParent();
	const { width, height } = root.ctx.canvas;
	return useMemo(() => {
		return { width, height };
	}, [width, height]);
}
