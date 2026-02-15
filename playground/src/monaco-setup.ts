import type { Monaco } from '@monaco-editor/react';

/**
 * Configure Monaco's TypeScript compiler and add type declarations
 * so playground code gets proper intellisense and no red squigglies.
 */
export function configureMonaco(monaco: Monaco) {
	const ts = monaco.languages.typescript.typescriptDefaults;

	// Configure TypeScript compiler for JSX
	ts.setCompilerOptions({
		target: monaco.languages.typescript.ScriptTarget.ESNext,
		module: monaco.languages.typescript.ModuleKind.ESNext,
		moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
		jsx: monaco.languages.typescript.JsxEmit.React,
		jsxFactory: 'React.createElement',
		jsxFragmentFactory: 'React.Fragment',
		allowJs: true,
		allowNonTsExtensions: true,
		esModuleInterop: true,
		strict: false,
		noEmit: true,
		skipLibCheck: true,
	});

	ts.setDiagnosticsOptions({
		noSemanticValidation: false,
		noSyntaxValidation: false,
	});

	// Add React types (minimal but sufficient)
	ts.addExtraLib(
		`
declare module "react" {
  export function useState<T>(initial: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(fn: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initial: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
  export function useMemo<T>(fn: () => T, deps: any[]): T;
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export function forwardRef<T, P>(fn: (props: P, ref: any) => any): any;

  export type ReactNode = any;
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  export type FC<P = {}> = (props: P) => any;
  export type ComponentType<P = {}> = FC<P>;

  export default React;
  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useRef: typeof useRef;
    useCallback: typeof useCallback;
    useMemo: typeof useMemo;
    createElement: typeof createElement;
  };
}
`,
		'file:///node_modules/@types/react/index.d.ts',
	);

	// Add react-tela types
	ts.addExtraLib(
		`
declare module "react-tela" {
  import { ReactNode } from "react";

  interface EntityProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    alpha?: number;
    rotate?: number;
    scaleX?: number;
    scaleY?: number;
    pointerEvents?: boolean;
    onClick?: (ev: MouseEvent) => any;
    onMouseDown?: (ev: MouseEvent) => any;
    onMouseUp?: (ev: MouseEvent) => any;
    onMouseMove?: (ev: MouseEvent) => any;
    onMouseEnter?: (ev: MouseEvent) => any;
    onMouseLeave?: (ev: MouseEvent) => any;
    onTouchStart?: (ev: TouchEvent) => any;
    onTouchMove?: (ev: TouchEvent) => any;
    onTouchEnd?: (ev: TouchEvent) => any;
  }

  interface ShapeProps extends EntityProps {
    fill?: string;
    fillRule?: CanvasFillRule;
    stroke?: string;
    lineWidth?: number;
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
    lineDash?: number[];
    lineDashOffset?: number;
    miterLimit?: number;
    clip?: boolean;
    clipRule?: CanvasFillRule;
  }

  interface RectProps extends ShapeProps {}
  interface RoundRectProps extends ShapeProps {
    radii?: number | DOMPointInit | (number | DOMPointInit)[];
  }
  interface ArcProps extends Omit<ShapeProps, 'width' | 'height'> {
    startAngle: number;
    endAngle: number;
    radius: number;
    counterclockwise?: boolean;
  }
  type CircleProps = Omit<ArcProps, 'startAngle' | 'endAngle' | 'counterclockwise'>;
  interface PathProps extends ShapeProps {
    d: string;
    width: number;
    height: number;
  }
  interface ImageProps extends EntityProps {
    src: string;
    sx?: number;
    sy?: number;
    sw?: number;
    sh?: number;
  }
  interface TextProps extends Omit<EntityProps, 'width' | 'height'> {
    children?: string | number | (string | number)[];
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fill?: string;
    stroke?: string;
    lineWidth?: number;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
  }
  interface GroupProps extends EntityProps {
    children?: ReactNode;
  }
  interface CanvasProps extends EntityProps {}

  export const Rect: React.FC<RectProps>;
  export const RoundRect: React.FC<RoundRectProps>;
  export const Arc: React.FC<ArcProps>;
  export const Circle: React.FC<CircleProps>;
  export const Path: React.FC<PathProps>;
  export const Image: React.FC<ImageProps>;
  export const Text: React.FC<TextProps>;
  export const Group: React.FC<GroupProps>;
  export const Canvas: React.FC<CanvasProps>;

  export function useDimensions(): { width: number; height: number };
  export function useLayout(): { x: number; y: number; width: number; height: number };
  export function useParent(): any;
  export function useTextMetrics(text: string, fontFamily?: string, fontSize?: number, fontWeight?: string | number): TextMetrics;

  export interface Layout {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  export const LayoutContext: React.Context<Layout>;

  export type {
    RectProps,
    RoundRectProps,
    ArcProps,
    CircleProps,
    PathProps,
    ImageProps,
    TextProps,
    GroupProps,
    CanvasProps,
    EntityProps,
    ShapeProps,
  };
}
`,
		'file:///node_modules/@types/react-tela/index.d.ts',
	);

	// Add react-tela/render types
	ts.addExtraLib(
		`
declare module "react-tela/render" {
  export function render(app: any, canvas: HTMLCanvasElement | any, opts?: any): any;
}
`,
		'file:///node_modules/@types/react-tela/render.d.ts',
	);

	// Add react-tela/flex types
	ts.addExtraLib(
		`
declare module "react-tela/flex" {
  import { ReactNode } from "react";

  interface FlexProps {
    flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
    flexWrap?: "no-wrap" | "wrap" | "wrap-reverse";
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline" | "auto";
    alignSelf?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline" | "auto";
    flex?: number;
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number | string;
    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    minHeight?: number | string;
    maxHeight?: number | string;
    gap?: number;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    padding?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    position?: "relative" | "absolute" | "static";
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    display?: "flex" | "none";
    overflow?: "visible" | "hidden" | "scroll";
    aspectRatio?: number;
    children?: ReactNode;
  }

  interface FlexTextProps {
    children?: string | number | (string | number)[];
    fontFamily?: string;
    fontWeight?: string | number;
    fontSize?: number;
    fill?: string;
    stroke?: string;
    [key: string]: any;
  }

  interface FlexComponent {
    (props: FlexProps): any;
    Text: (props: FlexTextProps) => any;
    displayName: string;
  }

  export function createFlex(yogaInstance: any): FlexComponent;
}
`,
		'file:///node_modules/@types/react-tela/flex.d.ts',
	);

	// Add yoga-wasm-web types
	ts.addExtraLib(
		`
declare module "yoga-wasm-web/asm" {
  interface Yoga {
    Node: any;
    Config: any;
  }
  export default function initYoga(): Yoga;
}
`,
		'file:///node_modules/@types/yoga-wasm-web/asm.d.ts',
	);
}
