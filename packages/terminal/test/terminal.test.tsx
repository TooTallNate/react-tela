import React, { useEffect, useRef } from 'react';
import { expect, test as viTest } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { render } from 'react-tela/render';
import { Terminal, TerminalEntity } from '../src/index.js';

// Helper: render a Terminal, optionally write to it, and snapshot
function renderTerminal(
	props: React.ComponentProps<typeof Terminal>,
	opts?: {
		writes?: string[];
		canvas?: InstanceType<typeof Canvas>;
	},
) {
	const canvas = opts?.canvas ?? new Canvas(500, 400);
	const writes = opts?.writes ?? [];

	function App() {
		const ref = useRef<TerminalEntity>(null);
		useEffect(() => {
			if (!ref.current) return;
			for (const w of writes) {
				ref.current.write(w);
			}
		}, []);
		return <Terminal ref={ref} {...props} />;
	}

	const root = render(<App />, canvas, config);
	return { root, canvas };
}

// ─── Basic Rendering ───

viTest('should render Terminal with "Hello World"', async () => {
	const { root, canvas } = renderTerminal(
		{ cols: 40, rows: 10, fontSize: 14 },
		{ writes: ['Hello World'] },
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Progressive Writing ───

viTest('should render Terminal with progressive writes', async () => {
	const canvas = new Canvas(500, 400);
	let termRef: TerminalEntity | null = null;

	function App() {
		const ref = useRef<TerminalEntity>(null);
		useEffect(() => {
			termRef = ref.current;
		}, []);
		return <Terminal ref={ref} cols={40} rows={10} fontSize={14} />;
	}

	const root = render(<App />, canvas, config);
	await root;

	// Write first line
	termRef!.write('First line\r\n');
	root.queueRender();
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Write second line
	termRef!.write('Second line\r\n');
	root.queueRender();
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── ANSI Colors ───

viTest('should render Terminal with ANSI colors', async () => {
	const { root, canvas } = renderTerminal(
		{ cols: 40, rows: 10, fontSize: 14 },
		{
			writes: [
				'\x1b[31mRed Text\x1b[0m ',
				'\x1b[32mGreen Text\x1b[0m ',
				'\x1b[34mBlue Text\x1b[0m',
			],
		},
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Opacity ───

viTest('should render Terminal with alpha=0.5', async () => {
	const { root, canvas } = renderTerminal(
		{ cols: 40, rows: 10, fontSize: 14, alpha: 0.5 },
		{ writes: ['Semi-transparent terminal'] },
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Rotation ───

viTest('should render Terminal with rotate=15', async () => {
	const canvas = new Canvas(600, 500);
	const { root } = renderTerminal(
		{ cols: 30, rows: 8, fontSize: 14, rotate: 15, x: 50, y: 50 },
		{ writes: ['Rotated terminal'], canvas },
	);
	await root;
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Cursor ───

viTest('should render Terminal with visible cursor', async () => {
	const { root, canvas } = renderTerminal(
		{ cols: 40, rows: 10, fontSize: 14 },
		{ writes: ['Cursor here: '] },
	);
	await root;
	// The cursor should be rendered - snapshot will show the cursor block
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
