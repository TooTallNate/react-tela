import { useMemo } from 'react';
import { useParent } from './use-parent.js';

export function useTextMetrics(
	text: string,
	fontFamily = 'sans-serif',
	fontSize = 24,
	fontWeight: string | number = '',
) {
	const root = useParent();
	return useMemo(() => {
		root.ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;
		return root.ctx.measureText(text);
	}, [root, text, fontWeight, fontSize, fontFamily]);
}
