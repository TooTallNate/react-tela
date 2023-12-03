import {
	createElement,
	createContext,
	useContext,
	forwardRef,
	type PropsWithChildren,
} from 'react';
import { Group as _Group, type GroupProps as _GroupProps } from './group';
import { Rect as _Rect, type RectProps } from './rect';

type MaybeArray<T> = T | T[];

const factory = <Ref, Props>(type: string) =>
	forwardRef<Ref, Props>((props, ref) =>
		createElement(type, { ...props, ref }),
	);

export type GroupProps = PropsWithChildren<_GroupProps>;
export const Group = factory<_Group, GroupProps>('Group');

export { RectProps };
export const Rect = factory<_Rect, RectProps>('Rect');

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
