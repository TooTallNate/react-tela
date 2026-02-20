export function enableEvents(canvas: any) {
	const ev = new EventTarget();
	canvas.addEventListener = ev.addEventListener.bind(ev);
	canvas.removeEventListener = ev.removeEventListener.bind(ev);
	canvas.dispatchEvent = ev.dispatchEvent.bind(ev);
}

export function dispatchEvent(target: any, event: Event) {
	target.dispatchEvent(event);
}
