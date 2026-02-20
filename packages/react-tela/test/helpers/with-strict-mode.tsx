import React from 'react';
import { test as viTest, type TestAPI } from 'vitest';
import { render as baseRender } from '../../src/render';
import type { ICanvas } from '@react-tela/core';

type RenderFn = typeof baseRender;
type TestFn = (render: RenderFn) => any;

/**
 * Creates a `test` function that runs each test case twice:
 * once normally, and once with the element wrapped in `<React.StrictMode>`.
 *
 * The test callback receives a `render` function as its first argument,
 * which automatically wraps elements in StrictMode for the second run.
 *
 * Usage:
 * ```ts
 * import { createStrictTest } from './helpers/with-strict-mode';
 * const test = createStrictTest();
 *
 * test('my test', async (render) => {
 *   await render(<App />, canvas, config);
 * });
 * ```
 *
 * Each `test(name, fn)` call registers two vitest tests:
 *   - "name"
 *   - "name (StrictMode)"
 */
export function createStrictTest() {
	const strictRender: RenderFn = (app, canvas, opts?) => {
		return baseRender(
			<React.StrictMode>{app}</React.StrictMode>,
			canvas,
			opts,
		);
	};

	const test = ((name: string, fn: TestFn, timeout?: number) => {
		viTest(name, () => fn(baseRender), timeout);
		viTest(`${name} (StrictMode)`, () => fn(strictRender), timeout);
	}) as TestAPI;

	// Copy over .skip, .only, etc. for convenience
	test.skip = ((name: string, fn: TestFn, timeout?: number) => {
		viTest.skip(name, () => fn(baseRender), timeout);
		viTest.skip(`${name} (StrictMode)`, () => fn(baseRender), timeout);
	}) as any;

	test.only = ((name: string, fn: TestFn, timeout?: number) => {
		viTest.only(name, () => fn(baseRender), timeout);
		viTest.only(`${name} (StrictMode)`, () => fn(strictRender), timeout);
	}) as any;

	return test;
}
