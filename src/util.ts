import type { PercentageString } from './types';

export function parsePercent(str: PercentageString) {
	return parseFloat(str.slice(0, -1)) / 100;
}

export function cloneMouseEvent(
	e: MouseEvent,
	x: number,
	y: number,
	type = e.type,
	extra?: MouseEventInit,
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
		...extra,
		clientX: x,
		clientY: y,
	});
	Object.defineProperties(clone, {
		offsetX: { value: x, configurable: true },
		offsetY: { value: y, configurable: true },
	});
	return clone;
}
