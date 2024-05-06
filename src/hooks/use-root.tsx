import { createContext, useContext } from 'react';
import type { Root } from '../root.js';

export const RootContext = createContext<Root | null>(null);

export function useRoot() {
	return useContext(RootContext)!;
}
