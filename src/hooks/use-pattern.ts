import { useEffect, useState } from 'react';
import { useParent } from './use-parent.js';
import type { PatternRepetition } from '../pattern.js';

/**
 * Create a `CanvasPattern` from an image URL.
 *
 * Returns `null` while the image is loading, and a `CanvasPattern`
 * once the image has been loaded. Triggers a re-render when the pattern is ready.
 *
 * @param source - The URL of the image to use as the pattern.
 * @param repetition - How the pattern repeats. @default "repeat"
 * @returns A `CanvasPattern` or `null` while loading.
 *
 * @example
 * ```tsx
 * const pattern = usePattern('https://example.com/tile.png');
 * <Rect width={200} height={200} fill={pattern ?? 'gray'} />
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createPattern | MDN createPattern()}
 */
export function usePattern(
	source: string,
	repetition: PatternRepetition = 'repeat',
): CanvasPattern | null {
	const parent = useParent();
	const [pattern, setPattern] = useState<CanvasPattern | null>(null);

	useEffect(() => {
		const controller = new AbortController();
		setPattern(null);
		parent.loadImage(source, { signal: controller.signal }).then((img) => {
			const p = parent.ctx.createPattern(img, repetition);
			setPattern(p);
			parent.queueRender();
		}).catch((err) => {
			// Ignore abort errors — they are expected during cleanup
			if (err instanceof DOMException && err.name === 'AbortError') return;
			throw err;
		});
		return () => {
			controller.abort();
		};
	}, [parent, source, repetition]);

	return pattern;
}
