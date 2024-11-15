import { useMemo } from 'react';
import { useParent } from './use-parent.js';

export function useTextMetrics(
	text: string,
	fontFamily = 'sans-serif',
	fontSize = 24,
	fontWeight: string | number = '',
) {
	const { ctx } = useParent();
	return useMemo(() => {
		ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;
		return ctx.measureText(text);
	}, [ctx, text, fontWeight, fontSize, fontFamily]);
}
