import React, {
	createElement,
	forwardRef,
	type PropsWithChildren,
} from 'react';
import { Group as _Group, type GroupProps as _GroupProps } from './group.js';
import { Rect as _Rect, type RectProps } from './rect.js';
import { RoundRect as _RoundRect, type RoundRectProps } from './round-rect.js';
import { Arc as _Arc, type ArcProps } from './arc.js';
import { Path as _Path, type PathProps } from './path.js';
import { Image as _Image, type ImageProps } from './image.js';
import { Text as _Text, type TextProps as _TextProps } from './text.js';

type MaybeArray<T> = T | T[];

const factory = <Ref, Props>(type: string) => {
	const c = forwardRef<Ref, Props>((props, ref) =>
		createElement(type, { ...props, ref }),
	);
	c.displayName = type;
	return c;
};

export type GroupProps = PropsWithChildren<_GroupProps>;
export { ArcProps, RectProps, RoundRectProps, PathProps, ImageProps };

export const Arc = factory<_Arc, ArcProps>('Arc');
export const Group = factory<_Group, GroupProps>('Group');
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

export { useRoot } from './hooks/use-root.js';
