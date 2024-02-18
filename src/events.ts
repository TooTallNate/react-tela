import type { Root } from './root';
import type { Entity } from './entity';
import type { ICanvas, Point, TelaMouseEvent } from './types';
import { findTarget, getLayer, cloneMouseEvent } from './util';

function scaledCoordinates(canvas: ICanvas, x: number, y: number): Point {
	// Get CSS size
	const cssWidth = canvas.clientWidth ?? canvas.width;
	const cssHeight = canvas.clientHeight ?? canvas.height;

	// Get drawing buffer size
	const bufferWidth = canvas.width;
	const bufferHeight = canvas.height;

	// Calculate the ratio
	const widthRatio = bufferWidth / cssWidth;
	const heightRatio = bufferHeight / cssHeight;

	return { x: x * widthRatio, y: y * heightRatio };
}

export function proxyEvents(
	canvasOrGroup: EventTarget,
	root: Root,
	scaleCoordinates: boolean,
) {
	if (!canvasOrGroup.addEventListener) {
		// Probably Node.js, where there are not events, so skip
		return;
	}

	let mouseCurrentlyOver: Root | Entity | null = null;

	//canvasOrGroup.addEventListener('touchstart', (_event) => {
	//	const event = _event as TouchEvent;
	//	console.log(event);
	//	_event.preventDefault();
	//	const { x, y } = scaleCoordinates ? scaledCoordinates(
	//		canvasOrGroup,
	//		event.layerX,
	//		event.layerY,
	//	);
	//	let target: EventTarget = root;
	//	for (let i = root.entities.length - 1; i >= 0; i--) {
	//		const entity = root.entities[i];
	//		if (entity.isPointInPath(x, y)) {
	//			target = entity;
	//			break;
	//		}
	//	}
	//});

	function doMouseEvent(_event: Event) {
		const event = _event as TelaMouseEvent;
		const point = scaledCoordinates(
			canvasOrGroup as ICanvas,
			event.layerX,
			event.layerY,
		);
		const target = findTarget(root, point);
		const layer = getLayer(target, point);
		const ev = cloneMouseEvent(event, point, layer);
		target.dispatchEvent(ev);
		if (ev.defaultPrevented) {
			event.preventDefault();
		}
		if (ev.cancelBubble) {
			event.stopPropagation();
		}
		return target;
	}
	canvasOrGroup.addEventListener('click', doMouseEvent);
	canvasOrGroup.addEventListener('mousedown', doMouseEvent);
	canvasOrGroup.addEventListener('mouseup', doMouseEvent);
	canvasOrGroup.addEventListener('mousemove', (e) => {
		const event = e as TelaMouseEvent;
		const point = scaledCoordinates(
			canvasOrGroup as ICanvas,
			event.layerX,
			event.layerY,
		);
		const target = findTarget(root, point);
		const layer = getLayer(target, point);

		if (target !== mouseCurrentlyOver) {
			if (mouseCurrentlyOver) {
				// do "mouseleave" event
				mouseCurrentlyOver.dispatchEvent(
					cloneMouseEvent(
						event,
						point,
						getLayer(mouseCurrentlyOver, point),
						'mouseleave',
						{
							bubbles: false,
							cancelable: false,
						},
					),
				);
			}

			mouseCurrentlyOver = target;

			// do "mouseenter" event
			target.dispatchEvent(
				cloneMouseEvent(event, point, layer, 'mouseenter', {
					bubbles: false,
					cancelable: false,
				}),
			);
		}

		const ev = cloneMouseEvent(event, point, layer);
		target.dispatchEvent(ev);
		if (ev.defaultPrevented) {
			event.preventDefault();
		}
		if (ev.cancelBubble) {
			event.stopPropagation();
		}
		return target;
	});
	canvasOrGroup.addEventListener('mouseleave', (_e) => {
		mouseCurrentlyOver = null;
		const event = _e as TelaMouseEvent;
		const point = scaledCoordinates(
			canvasOrGroup as ICanvas,
			event.layerX,
			event.layerY,
		);
		const ev = cloneMouseEvent(_e as TelaMouseEvent, point, point);
		root.dispatchEvent(ev);
	});
}
