import type { Monaco } from '@monaco-editor/react';
import {
	reactTelaTypes,
	reactTelaRenderTypes,
	reactTelaFlexTypes,
} from './generated-types';

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

	// Add React types (minimal but sufficient for playground use)
	ts.addExtraLib(
		`
declare module "react" {
  export function useState<T>(initial: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(fn: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initial: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
  export function useMemo<T>(fn: () => T, deps: any[]): T;
  export function useLayoutEffect(fn: () => void | (() => void), deps?: any[]): void;
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export function forwardRef<T, P>(fn: (props: P, ref: any) => any): ForwardRefExoticComponent<P & RefAttributes<T>>;

  export type ReactNode = any;
  export type ReactElement = { type: any; props: any; key: any };
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  export type FC<P = {}> = (props: P) => ReactElement | null;
  export type ComponentType<P = {}> = FC<P>;
  export type RefAttributes<T> = { ref?: any };
  export interface ForwardRefExoticComponent<P> {
    (props: P): ReactElement | null;
    readonly $$typeof: symbol;
    displayName?: string;
  }
  export type Context<T> = { Provider: any; Consumer: any };

  export namespace JSX {
    type Element = ReactElement;
    interface IntrinsicAttributes {
      key?: string | number | null;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
  }

  export default React;
  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useRef: typeof useRef;
    useCallback: typeof useCallback;
    useMemo: typeof useMemo;
    useLayoutEffect: typeof useLayoutEffect;
    createContext: typeof createContext;
    useContext: typeof useContext;
    createElement: typeof createElement;
    forwardRef: typeof forwardRef;
  };
}
`,
		'file:///node_modules/@types/react/index.d.ts',
	);

	// Global JSX namespace — TypeScript's JSX resolution looks here for
	// IntrinsicAttributes (provides `key`) and element type checking
	ts.addExtraLib(
		`
declare namespace JSX {
  type Element = { type: any; props: any; key: any };
  interface IntrinsicAttributes {
    key?: string | number | null;
  }
  interface ElementChildrenAttribute {
    children: {};
  }
}
`,
		'file:///global-jsx.d.ts',
	);

	// Add react-tela types — auto-generated from source
	ts.addExtraLib(
		reactTelaTypes,
		'file:///node_modules/@types/react-tela/index.d.ts',
	);

	// Add react-tela/render types — auto-generated from source
	ts.addExtraLib(
		reactTelaRenderTypes,
		'file:///node_modules/@types/react-tela/render.d.ts',
	);

	// Add react-tela/flex types — auto-generated from source
	ts.addExtraLib(
		reactTelaFlexTypes,
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
