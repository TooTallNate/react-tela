import { useParent } from './use-parent.js';

export function useDimensions() {
	const root = useParent();
	return {
		width: root.ctx.canvas.width,
		height: root.ctx.canvas.height,
	};
}
