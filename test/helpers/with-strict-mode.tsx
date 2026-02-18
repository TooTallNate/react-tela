import React from 'react';
import { test as viTest, type TestAPI } from 'vitest';
import { render as baseRender } from '../../src/render';
import type { ICanvas } from '../../src/types';

type RenderFn = typeof baseRender;

/**
 * Creates a pair of `test` + `render` that runs each test case twice:
 * once normally, and once with the element wrapped in `<React.StrictMode>`.
 *
 * Usage:
 * ```ts
 * import { createTestPair } from './helpers/with-strict-mode';
 * const { test, render } = createTestPair();
 * ```
 *
 * Each `test(name, fn)` call registers two vitest tests:
 *   - "name"
 *   - "name (StrictMode)"
 */
export function createStrictTest() {
	let strictMode = false;

	const render: RenderFn = (app, canvas, opts?) => {
		const element = strictMode
			? (<React.StrictMode>{app}</React.StrictMode>)
			: app;
		return baseRender(element, canvas, opts);
	};

	const test = ((name: string, fn: () => any, timeout?: number) => {
		viTest(name, () => {
			strictMode = false;
			return fn();
		}, timeout);
		viTest(`${name} (StrictMode)`, () => {
			strictMode = true;
			return fn();
		}, timeout);
	}) as TestAPI;

	// Copy over .skip, .only, etc. for convenience
	test.skip = ((name: string, fn: () => any, timeout?: number) => {
		viTest.skip(name, fn, timeout);
		viTest.skip(`${name} (StrictMode)`, fn, timeout);
	}) as any;

	test.only = ((name: string, fn: () => any, timeout?: number) => {
		viTest.only(name, fn, timeout);
		viTest.only(`${name} (StrictMode)`, fn, timeout);
	}) as any;

	return { test, render };
}
