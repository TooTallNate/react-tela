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
import { Ellipse as _Ellipse, type EllipseProps } from './ellipse.js';
import { Path as _Path, type PathProps } from './path.js';
import { Image as _Image, type ImageProps } from './image.js';
import { Line as _Line, type LineProps } from './line.js';
import { Text as _Text, type TextProps as _TextProps } from './text.js';
import { ICanvas } from './types.js';
import {
	DEFAULT_LAYOUT,
	LayoutContext,
	useLayout,
} from './hooks/use-layout.js';
import { EntityProps } from './entity.js';

type MaybeArray<T> = T | T[];

function useAdjustedLayout(props: any) {
	const layout = useLayout();
	// Fast path: when no Flex layout is active, the context is the
	// default frozen singleton. Skip the object spread entirely.
	if (layout === DEFAULT_LAYOUT) {
		return props;
	}
	return {
		...props,
		x: layout.x + (props.x ?? 0),
		y: layout.y + (props.y ?? 0),
		width: layout.width + (props.width ?? 0),
		height: layout.height + (props.height ?? 0),
	};
}

const factory = <Ref, Props extends EntityProps>(type: string) => {
	const c = forwardRef<Ref, Props>((props, ref) => {
		const adjusted = useAdjustedLayout(props);
		return createElement(type, adjusted === props ? { ...props, ref } : { ...adjusted, ref });
	});
	c.displayName = type;
	return c;
};

export type GroupProps = PropsWithChildren<_GroupProps>;
export {
	ArcProps,
	CanvasProps,
	EllipseProps,
	RectProps,
	RoundRectProps,
	PathProps,
	ImageProps,
	LineProps,
};
export type { _Canvas as CanvasRef };

export const Canvas = factory<_Canvas, CanvasProps>('Canvas');
export const Ellipse = factory<_Ellipse, EllipseProps>('Ellipse');
export const Image = factory<_Image, ImageProps>('Image');
export const Line = factory<_Line, LineProps>('Line');
export const Path = factory<_Path, PathProps>('Path');
export const Rect = factory<_Rect, RectProps>('Rect');
export const RoundRect = factory<_RoundRect, RoundRectProps>('RoundRect');

export type TextProps = Omit<_TextProps, 'value'> & {
	children?: MaybeArray<string | number>;
};
export const Text = factory<_Text, TextProps>('Text');

export const Arc = forwardRef<_Arc, ArcProps>((props, ref) => {
	const adjusted = useAdjustedLayout(props);
	const x = adjusted === props ? (props.x ?? 0) : adjusted.x;
	const y = adjusted === props ? (props.y ?? 0) : adjusted.y;
	const w = adjusted === props ? 0 : adjusted.width;
	const h = adjusted === props ? 0 : adjusted.height;
	const radius = props.radius ?? Math.min(w, h) / 2;
	return createElement('Arc', {
		...props,
		x,
		y,
		radius,
		ref,
	});
});
Arc.displayName = 'Arc';

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
	const adjusted = useAdjustedLayout(props);
	const w = adjusted === props ? (props.width ?? 0) : adjusted.width;
	const h = adjusted === props ? (props.height ?? 0) : adjusted.height;
	if (rootRef.current) {
		canvas = rootRef.current.ctx.canvas;
	} else {
		canvas = new root.Canvas(w || 300, h || 150);
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Could not get "2d" canvas context');
		}
		rootRef.current = new GroupRoot(ctx, root);
	}
	if (w > 0 && w !== canvas.width) {
		canvas.width = w;
	}
	if (h > 0 && h !== canvas.height) {
		canvas.height = h;
	}
	return (
		<ParentContext.Provider value={rootRef.current}>
			<LayoutContext.Provider value={DEFAULT_LAYOUT}>
				{createElement('Group', {
					...(adjusted === props ? props : adjusted),
					root: rootRef.current,
					ref,
				})}
			</LayoutContext.Provider>
		</ParentContext.Provider>
	);
});
Group.displayName = 'Group';

export { type ColorStop } from './gradient.js';
export { type FillStrokeStyle } from './shape.js';
export {
	useLinearGradient,
	useRadialGradient,
	useConicGradient,
} from './hooks/use-gradient.js';
export { useParent } from './hooks/use-parent.js';
export { useLayout, LayoutContext, type Layout } from './hooks/use-layout.js';
export { useDimensions } from './hooks/use-dimensions.js';
export { useTextMetrics } from './hooks/use-text-metrics.js';
