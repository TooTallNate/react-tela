import type { PercentageString } from './types';

export function parsePercent(str: PercentageString) {
	return parseFloat(str.slice(0, -1)) / 100;
}
