import { createContext, useContext } from 'react';
import type { Root } from '../root.js';

export const ParentContext = createContext<Root | null>(null);
ParentContext.displayName = 'ParentContext';

export function useParent() {
	const parent = useContext(ParentContext);
	if (!parent) {
		throw new Error('Could not find parent context');
	}
	return parent;
}
