const STOP_PROPAGATION = new WeakSet<Event>();

export class TelaEventTarget extends EventTarget {
	dispatchEvent(event: Event): boolean {
		const prop = `on${event.type}`;
		const fn = (this as any)[prop];
		if (typeof fn === 'function') {
			if (!fn.call(this, event)) {
				event.preventDefault();
			}
		}
		return super.dispatchEvent(event);
	}
}
