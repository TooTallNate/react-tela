import React, {
	createElement,
	forwardRef,
	useRef,
	type PropsWithChildren,
} from 'react';
import { ParentContext, useParent } from './hooks/use-parent.js';
import { Canvas as _Canvas, type CanvasProps } from './canvas.js';
import {
	GroupRoot,
	Group as _Group,
	type GroupProps as _GroupProps,
} from './group.js';
import { Rect as _Rect, type RectProps } from './rect.js';
import { RoundRect as _RoundRect, type RoundRectProps } from './round-rect.js';
import { Arc as _Arc, type ArcProps } from './arc.js';
import { Path as _Path, type PathProps } from './path.js';
import { Image as _Image, type ImageProps } from './image.js';
import { Text as _Text, type TextProps as _TextProps } from './text.js';
import { ICanvas } from './types.js';

type MaybeArray<T> = T | T[];

const factory = <Ref, Props>(type: string) => {
	const c = forwardRef<Ref, Props>((props, ref) =>
		createElement(type, { ...props, ref }),
	);
	c.displayName = type;
	return c;
};

export type GroupProps = PropsWithChildren<_GroupProps>;
export {
	ArcProps,
	CanvasProps,
	RectProps,
	RoundRectProps,
	PathProps,
	ImageProps,
};
export type { _Canvas as CanvasRef };

export const Arc = factory<_Arc, ArcProps>('Arc');
export const Canvas = factory<_Canvas, CanvasProps>('Canvas');
//export const Group = factory<_Group, GroupProps>('Group');
export const Image = factory<_Image, ImageProps>('Image');
export const Path = factory<_Path, PathProps>('Path');
export const Rect = factory<_Rect, RectProps>('Rect');
export const RoundRect = factory<_RoundRect, RoundRectProps>('RoundRect');

export type TextProps = Omit<_TextProps, 'value'> & {
	children?: MaybeArray<string | number>;
};
export const Text = factory<_Text, TextProps>('Text');

export type CircleProps = Omit<
	ArcProps,
	'startAngle' | 'endAngle' | 'counterclockwise'
>;

export const Circle = forwardRef<_Arc, CircleProps>((props, ref) => {
	return <Arc {...props} ref={ref} startAngle={0} endAngle={360} />;
});
Circle.displayName = 'Circle';

export const Group = forwardRef<_Group, GroupProps>((props, ref) => {
	const root = useParent();
	const rootRef = useRef<GroupRoot>();
	let canvas: ICanvas;
	if (rootRef.current) {
		canvas = rootRef.current.ctx.canvas;
	} else {
		canvas = new root.Canvas(props.width || 300, props.height || 150);
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Could not get "2d" canvas context');
		}
		rootRef.current = new GroupRoot(ctx, root);
	}
	if (props.width > 0 && props.width !== canvas.width) {
		canvas.width = props.width;
	}
	if (props.height > 0 && props.height !== canvas.height) {
		canvas.height = props.height;
	}
	//console.log({ props })
	return (
		<ParentContext.Provider value={rootRef.current}>
			{createElement('Group', {
				...props,
				root: rootRef.current,
				ref,
			})}
		</ParentContext.Provider>
	);
});
Group.displayName = 'Group';

export { useParent } from './hooks/use-parent.js';
export { useDimensions } from './hooks/use-dimensions.js';
export { useTextMetrics } from './hooks/use-text-metrics.js';
