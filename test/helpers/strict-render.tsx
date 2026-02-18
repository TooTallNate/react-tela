import React from 'react';
import { render as baseRender } from '../../src/render';
import type { ICanvas } from '../../src/types';

/**
 * Wraps the element in React.StrictMode before rendering.
 */
export function strictRender(
	app: React.JSX.Element,
	canvas: ICanvas,
	opts?: any,
) {
	return baseRender(
		<React.StrictMode>{app}</React.StrictMode>,
		canvas,
		opts,
	);
}
