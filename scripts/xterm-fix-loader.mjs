/**
 * Custom loader that wraps @xterm/headless CJS as ESM with named exports.
 */
export async function resolve(specifier, context, nextResolve) {
	return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
	// Check if this is @xterm/headless
	if (url.includes('@xterm') && url.includes('headless') && url.includes('xterm-headless.js')) {
		return {
			format: 'module',
			source: `
				import { createRequire } from 'node:module';
				const require = createRequire(${JSON.stringify(url)});
				const mod = require(${JSON.stringify(url.startsWith('file://') ? new URL(url).pathname : url)});
				export const Terminal = mod.Terminal;
				export default mod;
			`,
			shortCircuit: true,
		};
	}
	return nextLoad(url, context);
}
