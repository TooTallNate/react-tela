import { transform } from 'sucrase';

/**
 * Modules available to playground code.
 * Keys are the module names used in import statements.
 */
const MODULE_REGISTRY: Record<string, any> = {};

export function registerModule(name: string, mod: any) {
	MODULE_REGISTRY[name] = mod;
}

/**
 * Transpile TSX source code and evaluate it, returning the default export.
 * Uses sucrase for fast JSX transformation and a custom require for imports.
 */
export function transpileAndEval(code: string): React.ComponentType | null {
	try {
		// Transform TSX → JS with sucrase (converts import → require)
		const result = transform(code, {
			transforms: ['typescript', 'jsx', 'imports'],
			jsxRuntime: 'classic',
			production: true,
		});

		// Create a custom require that resolves from our registry
		const customRequire = (name: string) => {
			const mod = MODULE_REGISTRY[name];
			if (!mod) {
				throw new Error(`Module "${name}" is not available in the playground`);
			}
			return mod;
		};

		// Wrap in a function with require, module, and exports
		const moduleObj = { exports: {} as any };
		const fn = new Function('require', 'module', 'exports', result.code);
		fn(customRequire, moduleObj, moduleObj.exports);

		// Return the default export (or the module itself)
		return moduleObj.exports.default || moduleObj.exports;
	} catch (err) {
		console.error('Transpile error:', err);
		return null;
	}
}
