import type { Monaco } from '@monaco-editor/react';
import {
	reactGlobalDts,
	reactIndexDts,
	reactTelaFlexTypes,
	reactTelaRenderTypes,
	reactTelaTypes,
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

	// Add csstype stub (used by @types/react)
	ts.addExtraLib(
		`declare module "csstype" {
  export interface Properties<TLength = (string & {}) | 0, TTime = string & {}> {
    [key: string]: any;
  }
  export interface PropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> {
    [key: string]: any;
  }
}`,
		'file:///node_modules/csstype/index.d.ts',
	);

	// Add prop-types stub (used by @types/react)
	ts.addExtraLib(
		`declare module "prop-types" {
  export interface Validator<T> {
    (props: { [key: string]: any }, propName: string, componentName: string, location: string, propFullyQualifiedName: string): Error | null;
  }
  export interface Requireable<T> extends Validator<T | undefined | null> {
    isRequired: Validator<NonNullable<T>>;
  }
  export interface ValidationMap<T> {
    [key: string]: Validator<any>;
  }
  export const any: Requireable<any>;
  export const array: Requireable<any[]>;
  export const bool: Requireable<boolean>;
  export const func: Requireable<(...args: any[]) => any>;
  export const number: Requireable<number>;
  export const object: Requireable<object>;
  export const string: Requireable<string>;
  export const node: Requireable<any>;
  export const element: Requireable<any>;
  export const symbol: Requireable<symbol>;
  export function instanceOf<T>(expectedClass: new (...args: any[]) => T): Requireable<T>;
  export function oneOf<T>(types: readonly T[]): Requireable<T>;
  export function oneOfType<T extends Validator<any>>(types: T[]): Requireable<any>;
  export function arrayOf<T>(type: Validator<T>): Requireable<T[]>;
  export function objectOf<T>(type: Validator<T>): Requireable<{ [key: string]: T }>;
  export function shape<P extends ValidationMap<any>>(type: P): Requireable<any>;
  export function exact<P extends ValidationMap<any>>(type: P): Requireable<any>;
  export const ReactNodeLike: Requireable<any>;
  export const ReactElementLike: Requireable<any>;
  export const ReactComponentLike: Requireable<any>;
  export function checkPropTypes(typeSpecs: any, values: any, location: string, componentName: string, getStack?: () => any): void;
  export function resetWarningCache(): void;
  export interface InferProps<V extends ValidationMap<any>> {
    [key: string]: any;
  }
}`,
		'file:///node_modules/prop-types/index.d.ts',
	);

	// Add scheduler/tracing stub (used by @types/react)
	ts.addExtraLib(
		`declare module "scheduler/tracing" {
  export interface Interaction { id: number; name: string; timestamp: number; }
}`,
		'file:///node_modules/@types/scheduler/tracing.d.ts',
	);

	// Add full @types/react (compiled from source)
	ts.addExtraLib(
		reactGlobalDts,
		'file:///node_modules/@types/react/global.d.ts',
	);

	ts.addExtraLib(reactIndexDts, 'file:///node_modules/@types/react/index.d.ts');

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

	// Add @react-tela/flex types — auto-generated from source
	ts.addExtraLib(
		reactTelaFlexTypes,
		'file:///node_modules/@types/@react-tela/flex/index.d.ts',
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
