import React, { useEffect, useRef } from 'react';
import { expect, test as viTest } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { render } from 'react-tela/render';
import { Terminal, TerminalEntity } from '../src/index.js';

const flush = () => new Promise<void>((r) => setTimeout(r, 50));

/**
 * Helper: render a Terminal, write data, flush, and return.
 */
async function renderAndWrite(
	props: React.ComponentProps<typeof Terminal>,
	writes: string[],
	canvas?: InstanceType<typeof Canvas>,
) {
	canvas = canvas ?? new Canvas(500, 400);
	let entity: TerminalEntity | null = null;
	let resolveRef: () => void;
	const refReady = new Promise<void>((r) => { resolveRef = r; });

	function App() {
		const ref = useRef<TerminalEntity>(null);
		useEffect(() => {
			entity = ref.current;
			resolveRef();
		}, []);
		return <Terminal ref={ref} {...props} />;
	}

	const root = render(<App />, canvas, config);
	await root;
	await refReady;

	for (const w of writes) {
		await entity!.write(w);
	}

	// Let queueRender microtask and render fire
	await flush();

	return { root, canvas, entity: entity! };
}

// ─── Basic Rendering ───

viTest('should render Terminal with "Hello World"', async () => {
	const { canvas } = await renderAndWrite(
		{ cols: 40, rows: 10, fontSize: 14 },
		['Hello World'],
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Progressive Writing ───

viTest('should render Terminal with progressive writes', async () => {
	const canvas = new Canvas(500, 400);
	const { root, entity } = await renderAndWrite(
		{ cols: 40, rows: 10, fontSize: 14 },
		['First line\r\n'],
		canvas,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	await entity.write('Second line\r\n');
	await flush();
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── ANSI Colors ───

viTest('should render Terminal with ANSI colors', async () => {
	const { canvas } = await renderAndWrite(
		{ cols: 40, rows: 10, fontSize: 14 },
		[
			'\x1b[31mRed Text\x1b[0m ',
			'\x1b[32mGreen Text\x1b[0m ',
			'\x1b[34mBlue Text\x1b[0m',
		],
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Opacity ───

viTest('should render Terminal with alpha=0.5', async () => {
	const { canvas } = await renderAndWrite(
		{ cols: 40, rows: 10, fontSize: 14, alpha: 0.5 },
		['Semi-transparent terminal'],
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Rotation ───

viTest('should render Terminal with rotate=15', async () => {
	const canvas = new Canvas(600, 500);
	const { canvas: c } = await renderAndWrite(
		{ cols: 30, rows: 8, fontSize: 14, rotate: 15, x: 50, y: 50 },
		['Rotated terminal'],
		canvas,
	);
	expect(c.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Cursor ───

viTest('should render Terminal with visible cursor', async () => {
	const { canvas } = await renderAndWrite(
		{ cols: 40, rows: 10, fontSize: 14 },
		['Cursor here: '],
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
