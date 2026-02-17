import type { ICanvasRenderingContext2D } from './types.js';

export type ColorStop = [offset: number, color: string];

export interface LinearGradientDescriptor {
	type: 'linear-gradient';
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	stops: ColorStop[];
}

export interface RadialGradientDescriptor {
	type: 'radial-gradient';
	x0: number;
	y0: number;
	r0: number;
	x1: number;
	y1: number;
	r1: number;
	stops: ColorStop[];
}

export interface ConicGradientDescriptor {
	type: 'conic-gradient';
	startAngle: number;
	x: number;
	y: number;
	stops: ColorStop[];
}

export type GradientDescriptor =
	| LinearGradientDescriptor
	| RadialGradientDescriptor
	| ConicGradientDescriptor;

export function linearGradient(
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	stops: ColorStop[],
): LinearGradientDescriptor {
	return { type: 'linear-gradient', x0, y0, x1, y1, stops };
}

export function radialGradient(
	x0: number,
	y0: number,
	r0: number,
	x1: number,
	y1: number,
	r1: number,
	stops: ColorStop[],
): RadialGradientDescriptor {
	return { type: 'radial-gradient', x0, y0, r0, x1, y1, r1, stops };
}

export function conicGradient(
	startAngle: number,
	x: number,
	y: number,
	stops: ColorStop[],
): ConicGradientDescriptor {
	return { type: 'conic-gradient', startAngle, x, y, stops };
}

export function isGradientDescriptor(
	value: unknown,
): value is GradientDescriptor {
	return (
		typeof value === 'object' &&
		value !== null &&
		'type' in value &&
		((value as any).type === 'linear-gradient' ||
			(value as any).type === 'radial-gradient' ||
			(value as any).type === 'conic-gradient')
	);
}

const gradientCache = new WeakMap<
	ICanvasRenderingContext2D,
	Map<string, CanvasGradient>
>();

function descriptorKey(desc: GradientDescriptor): string {
	const stops = desc.stops.map((s) => `${s[0]}:${s[1]}`).join(',');
	switch (desc.type) {
		case 'linear-gradient':
			return `l:${desc.x0}:${desc.y0}:${desc.x1}:${desc.y1}|${stops}`;
		case 'radial-gradient':
			return `r:${desc.x0}:${desc.y0}:${desc.r0}:${desc.x1}:${desc.y1}:${desc.r1}|${stops}`;
		case 'conic-gradient':
			return `c:${desc.startAngle}:${desc.x}:${desc.y}|${stops}`;
	}
}

function createGradient(
	ctx: ICanvasRenderingContext2D,
	desc: GradientDescriptor,
): CanvasGradient {
	let gradient: CanvasGradient;
	switch (desc.type) {
		case 'linear-gradient':
			gradient = ctx.createLinearGradient(
				desc.x0,
				desc.y0,
				desc.x1,
				desc.y1,
			);
			break;
		case 'radial-gradient':
			gradient = ctx.createRadialGradient(
				desc.x0,
				desc.y0,
				desc.r0,
				desc.x1,
				desc.y1,
				desc.r1,
			);
			break;
		case 'conic-gradient':
			gradient = ctx.createConicGradient(
				desc.startAngle,
				desc.x,
				desc.y,
			);
			break;
	}
	for (const [offset, color] of desc.stops) {
		gradient.addColorStop(offset, color);
	}
	return gradient;
}

export function resolveGradient(
	ctx: ICanvasRenderingContext2D,
	desc: GradientDescriptor,
): CanvasGradient {
	let ctxCache = gradientCache.get(ctx);
	if (!ctxCache) {
		ctxCache = new Map();
		gradientCache.set(ctx, ctxCache);
	}
	const key = descriptorKey(desc);
	let gradient = ctxCache.get(key);
	if (!gradient) {
		gradient = createGradient(ctx, desc);
		ctxCache.set(key, gradient);
	}
	return gradient;
}

export type FillStrokeStyle = string | GradientDescriptor;
