import { useMemo } from 'react';
import { useParent } from './use-parent.js';

/**
 * Measure text dimensions using the parent canvas context.
 *
 * Returns a memoized `TextMetrics` object that updates when the text or font parameters change.
 *
 * @param text - The string to measure.
 * @param fontFamily - The font family. @default "sans-serif"
 * @param fontSize - The font size in pixels. @default 24
 * @param fontWeight - The font weight. @default ""
 * @returns A `TextMetrics` object with `width` and other metrics.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText | MDN measureText()}
 */
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
