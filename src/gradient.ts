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

export function resolveGradient(
	ctx: ICanvasRenderingContext2D,
	desc: GradientDescriptor,
): CanvasGradient {
	let gradient: CanvasGradient;
	switch (desc.type) {
		case 'linear-gradient':
			gradient = (ctx as any).createLinearGradient(
				desc.x0,
				desc.y0,
				desc.x1,
				desc.y1,
			);
			break;
		case 'radial-gradient':
			gradient = (ctx as any).createRadialGradient(
				desc.x0,
				desc.y0,
				desc.r0,
				desc.x1,
				desc.y1,
				desc.r1,
			);
			break;
		case 'conic-gradient':
			gradient = (ctx as any).createConicGradient(
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

export type FillStrokeStyle = string | GradientDescriptor;
