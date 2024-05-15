import { createContext, useContext } from 'react';

export interface Layout {
	x: number;
	y: number;
	width: number;
	height: number;
}

export const LayoutContext = createContext<Layout>({
	x: 0,
	y: 0,
	width: 0,
	height: 0,
});
LayoutContext.displayName = 'LayoutContext';

export function useLayout() {
	return useContext(LayoutContext);
}
