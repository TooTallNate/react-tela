export type PercentageString = `${string}%`;

export type InstanceProperties<T> = {
	[K in keyof T]: T[K];
};
