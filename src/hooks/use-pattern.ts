import { useEffect, useState } from 'react';
import { useParent } from './use-parent.js';
import type { PatternRepetition } from '../pattern.js';

/**
 * Create a `CanvasPattern` from an image URL.
 * Returns `null` while the image is loading, and a `CanvasPattern`
 * once the image has been loaded.
 */
export function usePattern(
	source: string,
	repetition: PatternRepetition = 'repeat',
): CanvasPattern | null {
	const parent = useParent();
	const [pattern, setPattern] = useState<CanvasPattern | null>(null);

	useEffect(() => {
		let cancelled = false;
		setPattern(null);
		parent.loadImage(source).then((img) => {
			if (cancelled) return;
			const p = parent.ctx.createPattern(img as any, repetition);
			setPattern(p);
			parent.queueRender();
		});
		return () => {
			cancelled = true;
		};
	}, [parent, source, repetition]);

	return pattern;
}
