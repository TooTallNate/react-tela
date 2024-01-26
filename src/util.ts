import type { PercentageString } from './types';

export const STOP_PROPAGATION = Symbol('stop propagation');

export function parsePercent(str: PercentageString) {
	return parseFloat(str.slice(0, -1)) / 100;
}
