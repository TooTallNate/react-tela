import React, {
	createElement,
	createContext,
	useContext,
	forwardRef,
	type PropsWithChildren,
} from 'react';
import { Group as _Group, type GroupProps as _GroupProps } from './group';
import { Rect as _Rect, type RectProps } from './rect';
import { RoundRect as _RoundRect, type RoundRectProps } from './round-rect';
import { Arc as _Arc, type ArcProps } from './arc';
import { Path as _Path, type PathProps } from './path';
import { Image as _Image, type ImageProps } from './image';
import { Text as _Text, type TextProps as _TextProps } from './text';

type MaybeArray<T> = T | T[];

const factory = <Ref, Props>(type: string) =>
	forwardRef<Ref, Props>((props, ref) =>
		createElement(type, { ...props, ref }),
	);

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
	return <Arc {...props} ref={ref} startAngle={0} endAngle={2 * Math.PI} />;
});

//export type ImageProps = fabric.IImageOptions & {
//	src: any;
//};
//export const Image = factory<fabric.Image, ImageProps>('Image');

//export type TextProps = fabric.ITextOptions & {
//	children?: MaybeArray<string | number>;
//};
//export const Text = factory<fabric.Text, TextProps>('Text');

//export type PathProps = fabric.IPathOptions & { d: string };
//export const Path = factory<fabric.Path, PathProps>('Path');

//export const FabricContext = createContext<typeof fabric | null>(null);
//
//export function useFabric() {
//	return useContext(FabricContext)!;
//}
