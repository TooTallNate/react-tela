export type PercentageString = `${string}%`;

export type InstanceProperties<T> = {
	[K in keyof T]: T[K];
};

export interface Point {
	x: number;
	y: number;
}

export interface TelaMouseEvent extends MouseEvent {
	layerX: number;
	layerY: number;
}
