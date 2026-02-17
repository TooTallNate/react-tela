import { Entity } from './entity.js';
import { Group, GroupRoot, type GroupProps } from './group.js';

export type PatternRepetition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

export interface PatternProps extends GroupProps {
	repetition?: PatternRepetition;
}

export class Pattern extends Group {
	pattern: CanvasPattern | null = null;
	repetition: PatternRepetition;

	constructor(opts: PatternProps & { root: GroupRoot }) {
		super(opts);
		this.repetition = opts.repetition ?? 'repeat';
	}

	render(): void {
		// Call Entity.render() for transforms/alpha
		Entity.prototype.render.call(this);
		// Render children to sub-canvas
		this.subroot.render();
		// Create pattern from the sub-canvas instead of drawImage
		this.pattern = this.root.ctx.createPattern(
			this.subroot.ctx.canvas as any,
			this.repetition,
		);
	}
}
