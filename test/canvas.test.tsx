import React, { useState, useEffect } from 'react';
import { test, expect } from 'vitest';
import config, { Canvas as NativeCanvas } from '@napi-rs/canvas';
import { Canvas, Rect, useParent, type CanvasRef } from '../src';
import { render } from '../src/render';

test('should render <Canvas> with imperative drawing', async () => {
	const canvas = new NativeCanvas(150, 100);

	function DrawingCanvas() {
		const root = useParent();
		return (
			<Canvas
				x={10}
				y={10}
				width={100}
				height={60}
				ref={(ref) => {
					if (!ref) return;
					const ctx = ref.getContext('2d');
					if (!ctx) return;
					ctx.fillStyle = 'blue';
					ctx.fillRect(0, 0, 100, 60);
					root.queueRender();
				}}
			/>
		);
	}

	await render(<DrawingCanvas />, canvas, config);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Canvas> with rotation', async () => {
	const canvas = new NativeCanvas(150, 150);

	function RotatedCanvas() {
		const root = useParent();
		return (
			<Canvas
				x={25}
				y={25}
				width={80}
				height={80}
				rotate={15}
				ref={(ref) => {
					if (!ref) return;
					const ctx = ref.getContext('2d');
					if (!ctx) return;
					ctx.fillStyle = 'red';
					ctx.fillRect(0, 0, 80, 80);
					ctx.strokeStyle = 'white';
					ctx.lineWidth = 3;
					ctx.beginPath();
					ctx.moveTo(0, 0);
					ctx.lineTo(80, 80);
					ctx.stroke();
					root.queueRender();
				}}
			/>
		);
	}

	await render(<RotatedCanvas />, canvas, config);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Canvas> with alpha transparency', async () => {
	const canvas = new NativeCanvas(150, 100);

	function TransparentCanvas() {
		const root = useParent();
		return (
			<>
				<Rect width={150} height={100} fill='green' />
				<Canvas
					x={25}
					y={10}
					width={100}
					height={60}
					alpha={0.5}
					ref={(ref) => {
						if (!ref) return;
						const ctx = ref.getContext('2d');
						if (!ctx) return;
						ctx.fillStyle = 'red';
						ctx.fillRect(0, 0, 100, 60);
						root.queueRender();
					}}
				/>
			</>
		);
	}

	await render(<TransparentCanvas />, canvas, config);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should support getContext("2d")', async () => {
	const canvas = new NativeCanvas(100, 100);
	let ctxRef: any = null;

	function TestCanvas() {
		return (
			<Canvas
				width={50}
				height={50}
				ref={(ref) => {
					if (!ref) return;
					ctxRef = ref.getContext('2d');
				}}
			/>
		);
	}

	await render(<TestCanvas />, canvas, config);
	expect(ctxRef).not.toBeNull();
	expect(typeof ctxRef.fillRect).toBe('function');
	expect(typeof ctxRef.strokeRect).toBe('function');
	expect(typeof ctxRef.clearRect).toBe('function');
});

test('should resize sub-canvas when dimensions change', async () => {
	const canvas = new NativeCanvas(200, 100);
	let canvasRef: CanvasRef | null = null;

	function ResizableCanvas({ w, h }: { w: number; h: number }) {
		const root = useParent();
		return (
			<Canvas
				width={w}
				height={h}
				ref={(ref) => {
					if (!ref) return;
					canvasRef = ref;
					const ctx = ref.getContext('2d');
					if (!ctx) return;
					ctx.fillStyle = 'purple';
					ctx.fillRect(0, 0, w, h);
					root.queueRender();
				}}
			/>
		);
	}

	function App() {
		const [size, setSize] = useState({ w: 50, h: 50 });

		useEffect(() => {
			setSize({ w: 150, h: 80 });
		}, []);

		return <ResizableCanvas w={size.w} h={size.h} />;
	}

	const root = render(<App />, canvas, config);
	await root;
	// Wait for the useEffect state update to trigger a re-render
	await new Promise((r) => setTimeout(r, 50));
	if (root.dirty || root.renderQueued) {
		await root;
	}
	expect(canvasRef).not.toBeNull();
	expect(canvasRef!.width).toBe(150);
	expect(canvasRef!.height).toBe(80);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
