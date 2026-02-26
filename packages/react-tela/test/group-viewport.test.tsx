import './helpers/font';
import config, { Canvas } from '@napi-rs/canvas';
import React, { useState } from 'react';
import { expect } from 'vitest';
import { Group, Rect, Text } from '../src';
import { createStrictTest } from './helpers/with-strict-mode';

const test = createStrictTest();

/** Wait for the next render event after a state change */
function waitForRender(root: any): Promise<void> {
	return new Promise((resolve) => {
		const renderCount = root.renderCount;
		const check = () => {
			if (root.renderCount > renderCount) {
				resolve();
			} else {
				setTimeout(check, 10);
			}
		};
		check();
	});
}

test('should render <Group> with contentHeight and scrollTop', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={100}
			contentHeight={300}
			scrollTop={0}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=0 shows the red rect
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should scroll content with scrollTop', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={100}
			contentHeight={300}
			scrollTop={100}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=100 shows the green rect
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should scroll content with scrollLeft', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={100}
			height={100}
			contentWidth={300}
			scrollLeft={100}
		>
			<Rect width={100} height={100} fill='red' />
			<Rect x={100} width={100} height={100} fill='green' />
			<Rect x={200} width={100} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollLeft=100 shows the green rect
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should allow overscroll past max (no clamping)', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={100}
			contentHeight={300}
			scrollTop={250}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=250 with contentHeight=300, height=100: shows bottom 50px of blue + 50px empty
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should allow negative overscroll (no clamping)', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={100}
			contentHeight={300}
			scrollTop={-50}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=-50: shows 50px empty space at top + top 50px of red
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should show partial content with scrollTop between components', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={100}
			contentHeight={300}
			scrollTop={50}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=50 shows bottom half of red and top half of green
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should show partial content with scrollLeft between components', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={100}
			height={100}
			contentWidth={300}
			scrollLeft={50}
		>
			<Rect width={100} height={100} fill='red' />
			<Rect x={100} width={100} height={100} fill='green' />
			<Rect x={200} width={100} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollLeft=50 shows right half of red and left half of green
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should show three partial components with scrollTop', async (render) => {
	const canvas = new Canvas(200, 150);
	await render(
		<Group
			x={0}
			y={0}
			width={200}
			height={150}
			contentHeight={300}
			scrollTop={75}
		>
			<Rect width={200} height={100} fill='red' />
			<Rect y={100} width={200} height={100} fill='green' />
			<Rect y={200} width={200} height={100} fill='blue' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=75 with viewport height 150: shows bottom 25px of red, all 100px of green, top 25px of blue
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should show partial content with both scrollTop and scrollLeft', async (render) => {
	const canvas = new Canvas(100, 100);
	await render(
		<Group
			x={0}
			y={0}
			width={100}
			height={100}
			contentWidth={200}
			contentHeight={200}
			scrollTop={50}
			scrollLeft={50}
		>
			<Rect width={100} height={100} fill='red' />
			<Rect x={100} width={100} height={100} fill='green' />
			<Rect y={100} width={100} height={100} fill='blue' />
			<Rect x={100} y={100} width={100} height={100} fill='yellow' />
		</Group>,
		canvas,
		config,
	);
	// scrollTop=50, scrollLeft=50: shows corners of all four rects
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should work without contentWidth/contentHeight (backward compat)', async (render) => {
	const canvas = new Canvas(200, 100);
	await render(
		<Group x={10} y={10} width={180} height={80}>
			<Rect width={180} height={80} fill='purple' />
		</Group>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should not use 300x150 default when dimensions are 0', async (render) => {
	const canvas = new Canvas(200, 100);
	// A Group with width=0 and height=0 should produce an empty canvas,
	// not fall back to a 300x150 default size
	await render(
		<>
			<Rect width={200} height={100} fill='white' />
			<Group x={0} y={0} width={0} height={0}>
				<Rect width={300} height={150} fill='red' />
			</Group>
		</>,
		canvas,
		config,
	);
	// Should be a fully white canvas — the red rect inside the 0x0 Group should not be visible
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should not use 300x150 default when contentHeight is 0', async (render) => {
	const canvas = new Canvas(200, 100);
	// When contentHeight=0, the backing canvas should be 0px tall,
	// not fall back to the HTML default of 150px
	await render(
		<>
			<Rect width={200} height={100} fill='white' />
			<Group x={0} y={0} width={200} height={100} contentHeight={0}>
				<Rect width={200} height={150} fill='red' />
			</Group>
		</>,
		canvas,
		config,
	);
	// Should be a fully white canvas — contentHeight=0 means no content is visible
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render correctly when contentHeight changes from 0 to a real value', async (render) => {
	const canvas = new Canvas(200, 100);
	let setHeight: (h: number) => void;
	function DynamicGroup() {
		const [contentHeight, _setHeight] = useState(0);
		setHeight = _setHeight;
		return (
			<Group x={0} y={0} width={200} height={100} contentHeight={contentHeight}>
				<Rect width={200} height={100} fill='red' />
				<Rect y={100} width={200} height={100} fill='green' />
			</Group>
		);
	}
	// Initial render with contentHeight=0 — trigger initial render and wait
	const root = render(<DynamicGroup />, canvas, config);
	await root;
	// Initially contentHeight=0, so nothing should be visible
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();

	// Update contentHeight to show content
	setHeight!(200);
	await waitForRender(root);
	// Now contentHeight=200, scrollTop defaults to 0, so red rect should be visible
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
