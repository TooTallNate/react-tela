import { createContext, useContext } from 'react';

/**
 * Represents the computed layout rectangle for a Flex child,
 * with absolute position and dimensions within the canvas.
 */
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

/**
 * Returns the current Flex layout rectangle from context.
 *
 * When used outside a `<Flex>` tree, returns the default layout `{ x: 0, y: 0, width: 0, height: 0 }`.
 *
 * @returns The current {@link Layout} from the nearest `LayoutContext` provider.
 */
export function useLayout() {
	return useContext(LayoutContext);
}
