import {
	type Ref,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
} from 'react';
import { useParent } from 'react-tela';
import { Terminal as TerminalEntity, type TerminalProps } from './terminal.js';

export type { TerminalProps } from './terminal.js';
export { TerminalEntity };

/**
 * A react-tela component that renders an xterm.js terminal on a Canvas2D surface.
 *
 * @example
 * ```tsx
 * import { Terminal } from '@react-tela/terminal';
 *
 * function App() {
 *   const termRef = useRef<TerminalEntity>(null);
 *
 *   useEffect(() => {
 *     termRef.current?.write('Hello, World!\r\n');
 *   }, []);
 *
 *   return <Terminal ref={termRef} cols={80} rows={30} fontSize={16} />;
 * }
 * ```
 */
export const Terminal = forwardRef<TerminalEntity, TerminalProps>(
	function Terminal(props, ref) {
		const parent = useParent();
		const entityRef = useRef<TerminalEntity | null>(null);

		// Create entity on mount, add to parent root
		if (!entityRef.current) {
			entityRef.current = new TerminalEntity(props);
		}

		useImperativeHandle(ref, () => entityRef.current!, []);

		useEffect(() => {
			const entity = entityRef.current!;
			entity._root = parent;
			parent.add(entity);
			parent.queueRender();

			return () => {
				parent.remove(entity);
				parent.queueRender();
				entity.dispose();
			};
		}, [parent]);

		// Update entity props on re-render
		useEffect(() => {
			const entity = entityRef.current!;
			entity.update(props);
		});

		return null;
	},
);
