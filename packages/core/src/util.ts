import type { Entity } from './entity.js';
import { Root } from './root.js';
import type { Point } from './types.js';

const MouseEvent = globalThis.MouseEvent || class MouseEvent extends Event {};

export function cloneMouseEvent(
	e: MouseEvent,
	client: Point,
	layer: Point,
	type = e.type,
	init?: MouseEventInit,
) {
	const clone = new MouseEvent(type, {
		...e,
		bubbles: e.bubbles,
		cancelable: e.cancelable,
		button: e.button,
		buttons: e.buttons,
		composed: e.composed,
		ctrlKey: e.ctrlKey,
		metaKey: e.metaKey,
		shiftKey: e.shiftKey,
		detail: e.detail,
		which: e.which,
		view: e.view,
		...init,
		clientX: client.x,
		clientY: client.y,
	});
	Object.defineProperties(clone, {
		offsetX: { value: client.x, configurable: true },
		offsetY: { value: client.y, configurable: true },
		layerX: { value: layer.x, configurable: true },
		layerY: { value: layer.y, configurable: true },
	});
	return clone;
}

function mapTouches(list: TouchList, touches: Map<number, Touch>) {
	return [...list].map((t) => {
		const touch = touches.get(t.identifier);
		if (!touch) {
			throw new Error(`Could not find Touch for ${t.identifier}`);
		}
		return touch;
	});
}

export function cloneTouchEvent(
	e: TouchEvent,
	touches: Map<number, Touch>,
	type = e.type,
) {
	const clone = new TouchEvent(type, {
		...e,
		bubbles: e.bubbles,
		cancelable: e.cancelable,
		composed: e.composed,
		ctrlKey: e.ctrlKey,
		metaKey: e.metaKey,
		shiftKey: e.shiftKey,
		detail: e.detail,
		which: e.which,
		view: e.view,
		touches: mapTouches(e.touches, touches),
		changedTouches: mapTouches(e.changedTouches, touches),
		targetTouches: mapTouches(e.targetTouches, touches),
	});
	return clone;
}

/**
 * Convert an angle from degrees to radians.
 *
 * @param degrees - The angle in degrees.
 * @returns The angle in radians.
 */
export function degreesToRadians(degrees: number) {
	return degrees * (Math.PI / 180);
}

export function findTarget(root: Root, point: Point) {
	let target: Root | Entity = root;
	for (let i = root.entities.length - 1; i >= 0; i--) {
		const entity = root.entities[i];
		if (entity.pointerEvents && entity.isPointInPath(point.x, point.y)) {
			target = entity;
			break;
		}
	}
	return target;
}

export function getLayer(target: Root | Entity, point: Point) {
	return target instanceof Root
		? point
		: target.inverseMatrix.transformPoint(point);
}
