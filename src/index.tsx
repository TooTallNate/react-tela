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
import { LayoutContext, useLayout } from './hooks/use-layout.js';
import { EntityProps } from './entity.js';

type MaybeArray<T> = T | T[];

function useAdjustedLayout(props: any) {
	let { x, y, width, height } = useLayout();
	x += props.x ?? 0;
	y += props.y ?? 0;
	width += props.width ?? 0;
	height += props.height ?? 0;
	return { x, y, width, height };
}

const factory = <Ref, Props extends EntityProps>(type: string) => {
	const c = forwardRef<Ref, Props>((props, ref) => {
		return createElement(type, { ...props, ...useAdjustedLayout(props), ref });
	});
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
	const layout = useAdjustedLayout(props);
	if (rootRef.current) {
		canvas = rootRef.current.ctx.canvas;
	} else {
		canvas = new root.Canvas(layout.width || 300, layout.height || 150);
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Could not get "2d" canvas context');
		}
		rootRef.current = new GroupRoot(ctx, root);
	}
	if (layout.width > 0 && layout.width !== canvas.width) {
		canvas.width = layout.width;
	}
	if (layout.height > 0 && layout.height !== canvas.height) {
		canvas.height = layout.height;
	}
	//console.log({ props })
	return (
		<ParentContext.Provider value={rootRef.current}>
			<LayoutContext.Provider value={{ x: 0, y: 0, width: 0, height: 0 }}>
				{createElement('Group', {
					...props,
					...layout,
					root: rootRef.current,
					ref,
				})}
			</LayoutContext.Provider>
		</ParentContext.Provider>
	);
});
Group.displayName = 'Group';

export { useParent } from './hooks/use-parent.js';
export { useLayout, LayoutContext, type Layout } from './hooks/use-layout.js';
export { useDimensions } from './hooks/use-dimensions.js';
export { useTextMetrics } from './hooks/use-text-metrics.js';
