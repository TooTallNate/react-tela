import type { PercentageString, Point } from './types';

export function parsePercent(str: PercentageString) {
	return parseFloat(str.slice(0, -1)) / 100;
}

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

export function degreesToRadians(degrees: number) {
	return degrees * (Math.PI / 180);
}
