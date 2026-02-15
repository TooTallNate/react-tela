import { createContext, useContext } from 'react';

export interface Layout {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Default layout — shared singleton to enable identity checks.
 * Components can skip layout adjustment when the context value is this object.
 */
export const DEFAULT_LAYOUT: Layout = Object.freeze({
	x: 0,
	y: 0,
	width: 0,
	height: 0,
});

export const LayoutContext = createContext<Layout>(DEFAULT_LAYOUT);
LayoutContext.displayName = 'LayoutContext';

export function useLayout() {
	return useContext(LayoutContext);
}
