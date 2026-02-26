import config, { Canvas } from '@napi-rs/canvas';
import React, { useEffect, useRef } from 'react';
import { render } from 'react-tela/render';
import { expect, test as viTest } from 'vitest';
import { Terminal, TerminalEntity } from '../src/index.js';

const FONT = 'Geist Mono Test';

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
	const refReady = new Promise<void>((r) => {
		resolveRef = r;
	});

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
		{ cols: 40, rows: 10, fontSize: 14, fontFamily: FONT },
		['Hello World'],
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Progressive Writing ───

viTest('should render Terminal with progressive writes', async () => {
	const canvas = new Canvas(500, 400);
	const { root, entity } = await renderAndWrite(
		{ cols: 40, rows: 10, fontSize: 14, fontFamily: FONT },
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
		{ cols: 40, rows: 10, fontSize: 14, fontFamily: FONT },
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
		{ cols: 40, rows: 10, fontSize: 14, fontFamily: FONT, alpha: 0.5 },
		['Semi-transparent terminal'],
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Rotation ───

viTest('should render Terminal with rotate=15', async () => {
	const canvas = new Canvas(600, 500);
	const { canvas: c } = await renderAndWrite(
		{
			cols: 30,
			rows: 8,
			fontSize: 14,
			fontFamily: FONT,
			rotate: 15,
			x: 50,
			y: 50,
		},
		['Rotated terminal'],
		canvas,
	);
	expect(c.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Dynamic Resizing ───

viTest(
	'should auto-calculate cols/rows from width/height when not provided',
	async () => {
		// charWidth = ceil(14 * 0.6) = 9, lineHeight = ceil(14 * 1.2) = 17
		// 270 / 9 = 30 cols, 170 / 17 = 10 rows
		const { canvas } = await renderAndWrite(
			{ width: 270, height: 170, fontSize: 14, fontFamily: FONT },
			['Auto-sized terminal'],
		);
		expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
	},
);

viTest(
	'should recalculate cols when width changes (dynamic resize)',
	async () => {
		const resizes: [number, number][] = [];
		const canvas = new Canvas(600, 400);
		let entity: TerminalEntity | null = null;
		let resolveRef: () => void;
		const refReady = new Promise<void>((r) => {
			resolveRef = r;
		});

		function App({ width }: { width: number }) {
			const ref = useRef<TerminalEntity>(null);
			useEffect(() => {
				entity = ref.current;
				resolveRef();
			}, []);
			return (
				<Terminal
					ref={ref}
					width={width}
					height={170}
					fontSize={14}
					fontFamily={FONT}
					onResize={(c, r) => resizes.push([c, r])}
				/>
			);
		}

		const root = render(<App width={270} />, canvas, config);
		await root;
		await refReady;

		await entity!.write('Before resize\r\n');
		await flush();
		expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

		// Simulate a width change by directly setting width on the entity
		entity!.width = 450;
		await entity!.write('After resize wider\r\n');
		await flush();
		expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

		// cols should have changed: 270/9=30, 450/9=50
		expect(resizes.length).toBeGreaterThanOrEqual(1);
		expect(resizes[resizes.length - 1][0]).toBe(50);
	},
);

viTest(
	'should recalculate rows when height changes (dynamic resize)',
	async () => {
		const resizes: [number, number][] = [];
		const canvas = new Canvas(500, 600);
		let entity: TerminalEntity | null = null;
		let resolveRef: () => void;
		const refReady = new Promise<void>((r) => {
			resolveRef = r;
		});

		function App() {
			const ref = useRef<TerminalEntity>(null);
			useEffect(() => {
				entity = ref.current;
				resolveRef();
			}, []);
			return (
				<Terminal
					ref={ref}
					width={270}
					height={170}
					fontSize={14}
					fontFamily={FONT}
					onResize={(c, r) => resizes.push([c, r])}
				/>
			);
		}

		const root = render(<App />, canvas, config);
		await root;
		await refReady;

		// Change height: 170/17=10 rows -> 340/17=20 rows
		entity!.height = 340;
		await entity!.write('More rows now\r\n');
		await flush();
		expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

		expect(resizes.length).toBeGreaterThanOrEqual(1);
		expect(resizes[resizes.length - 1][1]).toBe(20);
	},
);

viTest('should wrap long line to next row after dynamic resize', async () => {
	const canvas = new Canvas(600, 400);
	let entity: TerminalEntity | null = null;
	let resolveRef: () => void;
	const refReady = new Promise<void>((r) => {
		resolveRef = r;
	});

	function App({ width }: { width: number }) {
		const ref = useRef<TerminalEntity>(null);
		useEffect(() => {
			entity = ref.current;
			resolveRef();
		}, []);
		return (
			<Terminal
				ref={ref}
				width={width}
				height={340}
				fontSize={14}
				fontFamily={FONT}
			/>
		);
	}

	// Start wide: charWidth=9, 450/9=50 cols — the long line fits on one row
	const root = render(<App width={450} />, canvas, config);
	await root;
	await refReady;

	const longLine = 'The quick brown fox jumps over the lazy dog near the river';
	// Write text + newline so cursor moves off the wrapped line group.
	// xterm.js skips reflowing the line group containing the cursor
	// (to protect active editing context), so the cursor must be below
	// the content for reflow to work correctly on resize.
	await entity!.write(longLine + '\r\n');
	await flush();
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Shrink to 180px → 180/9=20 cols — the 58-char line must wrap across 3 rows
	entity!.width = 180;
	await flush();
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

viTest('should NOT auto-resize cols when cols is explicitly set', async () => {
	const resizes: [number, number][] = [];
	const canvas = new Canvas(600, 400);
	let entity: TerminalEntity | null = null;
	let resolveRef: () => void;
	const refReady = new Promise<void>((r) => {
		resolveRef = r;
	});

	function App() {
		const ref = useRef<TerminalEntity>(null);
		useEffect(() => {
			entity = ref.current;
			resolveRef();
		}, []);
		return (
			<Terminal
				ref={ref}
				cols={30}
				height={170}
				fontSize={14}
				fontFamily={FONT}
				onResize={(c, r) => resizes.push([c, r])}
			/>
		);
	}

	const root = render(<App />, canvas, config);
	await root;
	await refReady;

	// Change width — cols should stay at 30 since it was explicit
	entity!.width = 500;
	await flush();

	// No resize should have been triggered for cols
	const colResizes = resizes.filter(([c]) => c !== 30);
	expect(colResizes).toHaveLength(0);
});

viTest('should fire onResize when both width and height change', async () => {
	const resizes: [number, number][] = [];
	const canvas = new Canvas(600, 600);
	let entity: TerminalEntity | null = null;
	let resolveRef: () => void;
	const refReady = new Promise<void>((r) => {
		resolveRef = r;
	});

	function App() {
		const ref = useRef<TerminalEntity>(null);
		useEffect(() => {
			entity = ref.current;
			resolveRef();
		}, []);
		return (
			<Terminal
				ref={ref}
				width={270}
				height={170}
				fontSize={14}
				fontFamily={FONT}
				onResize={(c, r) => resizes.push([c, r])}
			/>
		);
	}

	const root = render(<App />, canvas, config);
	await root;
	await refReady;

	// Change both dimensions
	entity!.width = 450; // 50 cols
	entity!.height = 340; // 20 rows
	await flush();

	expect(resizes).toContainEqual([50, 10]); // width change fires first (rows still 10)
	expect(resizes).toContainEqual([50, 20]); // then height change
});

viTest('should render empty terminal with auto-calculated size', async () => {
	const { canvas } = await renderAndWrite(
		{ width: 270, height: 170, fontSize: 14, fontFamily: FONT },
		[],
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

viTest(
	'should handle minimum 1 col/row for very small dimensions',
	async () => {
		const canvas = new Canvas(100, 100);
		let entity: TerminalEntity | null = null;
		let resolveRef: () => void;
		const refReady = new Promise<void>((r) => {
			resolveRef = r;
		});

		function App() {
			const ref = useRef<TerminalEntity>(null);
			useEffect(() => {
				entity = ref.current;
				resolveRef();
			}, []);
			return (
				<Terminal
					ref={ref}
					width={270}
					height={170}
					fontSize={14}
					fontFamily={FONT}
				/>
			);
		}

		const root = render(<App />, canvas, config);
		await root;
		await refReady;

		// Shrink to very small — should clamp to 1 col, 1 row
		entity!.width = 5;
		entity!.height = 5;
		await flush();

		// Should not crash, entity should still be functional
		await entity!.write('x');
		await flush();
	},
);

// ─── Scroll Offset ───

viTest('should render scrollback content with scrollOffset', async () => {
	const canvas = new Canvas(500, 400);
	const { entity } = await renderAndWrite(
		{ cols: 40, rows: 5, fontSize: 14, fontFamily: FONT, scrollback: 100 },
		[],
		canvas,
	);

	// Write enough lines to create scrollback
	for (let i = 1; i <= 20; i++) {
		await entity.write(`Line ${i}\r\n`);
	}
	await flush();

	// Default: shows latest lines (no scroll offset)
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Scroll up by 10 rows
	entity.scrollOffset = 10;
	await flush();
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Scroll back to bottom
	entity.scrollOffset = 0;
	await flush();
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

viTest('should clamp scrollOffset to available scrollback', async () => {
	const canvas = new Canvas(500, 400);
	const { entity } = await renderAndWrite(
		{ cols: 40, rows: 5, fontSize: 14, fontFamily: FONT, scrollback: 100 },
		[],
		canvas,
	);

	// Write 10 lines — with 5 visible rows, baseY should be ~5
	for (let i = 1; i <= 10; i++) {
		await entity.write(`Line ${i}\r\n`);
	}
	await flush();

	// Set offset way too high — should clamp
	entity.scrollOffset = 9999;
	expect(entity.scrollOffset).toBeLessThanOrEqual(10);
	expect(entity.scrollOffset).toBeGreaterThan(0);
});

viTest('should clamp negative scrollOffset to 0', async () => {
	const { entity } = await renderAndWrite(
		{ cols: 40, rows: 5, fontSize: 14, fontFamily: FONT },
		['Hello\r\n'],
	);
	entity.scrollOffset = -5;
	expect(entity.scrollOffset).toBe(0);
});

viTest('should hide cursor when scrolled back', async () => {
	const canvas = new Canvas(500, 400);
	const { entity } = await renderAndWrite(
		{ cols: 40, rows: 5, fontSize: 14, fontFamily: FONT, scrollback: 100 },
		[],
		canvas,
	);

	for (let i = 1; i <= 10; i++) {
		await entity.write(`Line ${i}\r\n`);
	}
	await flush();

	// Scroll up — cursor should not be visible
	entity.scrollOffset = 3;
	await flush();
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

viTest('should accept scrollOffset via props/update', async () => {
	const canvas = new Canvas(500, 400);
	const { entity } = await renderAndWrite(
		{
			cols: 40,
			rows: 5,
			fontSize: 14,
			fontFamily: FONT,
			scrollback: 100,
			scrollOffset: 0,
		},
		[],
		canvas,
	);

	for (let i = 1; i <= 15; i++) {
		await entity.write(`Line ${i}\r\n`);
	}
	await flush();

	// Update via update() method
	entity.update({ scrollOffset: 5 });
	await flush();
	expect(entity.scrollOffset).toBe(5);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

// ─── Cursor ───

viTest('should render Terminal with visible cursor', async () => {
	const { canvas } = await renderAndWrite(
		{ cols: 40, rows: 10, fontSize: 14, fontFamily: FONT },
		['Cursor here: '],
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
