import { createContext, useContext } from 'react';
import type { Root } from '@react-tela/core';

export const ParentContext = createContext<Root | null>(null);
ParentContext.displayName = 'ParentContext';

/**
 * Returns the nearest parent {@link Root} context.
 *
 * Must be called within a react-tela render tree. Throws if no parent context is found.
 *
 * @returns The parent {@link Root} instance.
 * @throws If called outside a react-tela render tree.
 */
export function useParent() {
	const parent = useContext(ParentContext);
	if (!parent) {
		throw new Error('Could not find parent context');
	}
	return parent;
}
