const PATCHED_EVENT = new WeakSet<Event>();
const STOP_PROPAGATION = new WeakSet<Event>();

/**
 * Extended `EventTarget` that adds `on${type}` handler support and manual
 * event bubbling through `parentNode`. All react-tela entities and roots
 * extend this class.
 */
export class TelaEventTarget extends EventTarget {
	get parentNode(): EventTarget | null {
		return null;
	}

	dispatchEvent(event: Event): boolean {
		if (!PATCHED_EVENT.has(event)) {
			// There is no standardized way to tell if an event
			// `stopPropagation()` function was called, so define our own
			Object.defineProperty(event, 'stopPropagation', {
				configurable: true,
				value: function stopPropagation() {
					STOP_PROPAGATION.add(event);
				},
			});
			PATCHED_EVENT.add(event);
		}

		const rtn = super.dispatchEvent(event);

		// If there's an `on${type}` prop set, invoke that handler
		const prop = `on${event.type}`;
		const fn = (this as any)[prop];
		if (typeof fn === 'function') {
			if (!fn.call(this, event)) {
				event.preventDefault();
			}
		}

		// Ensure `cancelBubble` is set to true if `stopPropagation()` was called
		if (!event.cancelBubble && STOP_PROPAGATION.has(event)) {
			Object.defineProperty(event, 'cancelBubble', {
				configurable: true,
				value: true,
			});
		}

		if (this.parentNode && event.bubbles && !event.cancelBubble) {
			return this.parentNode.dispatchEvent(event);
		}

		return rtn;
	}
}
