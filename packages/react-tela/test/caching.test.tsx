import React from 'react';
import { expect, describe } from 'vitest';
import { createStrictTest } from './helpers/with-strict-mode';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect, RoundRect, Arc, Ellipse, Line, Path } from '../src';
import { Rect as _Rect } from '@react-tela/core';
import { Arc as _Arc } from '@react-tela/core';
import { Ellipse as _Ellipse } from '@react-tela/core';
import { Line as _Line } from '@react-tela/core';
import { RoundRect as _RoundRect } from '@react-tela/core';

const test = createStrictTest();

describe('Matrix caching', () => {
	test('entity.matrix returns same reference when properties unchanged', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		expect(ref).not.toBeNull();
		const matrix1 = ref!.matrix;
		const matrix2 = ref!.matrix;
		expect(matrix1).toBe(matrix2);
	});

	test('entity.matrix returns new object after changing x', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		expect(ref).not.toBeNull();
		const matrix1 = ref!.matrix;
		ref!.x = 99;
		const matrix2 = ref!.matrix;
		expect(matrix1).not.toBe(matrix2);
	});

	test('entity.matrix returns new object after changing y', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		const matrix1 = ref!.matrix;
		ref!.y = 99;
		const matrix2 = ref!.matrix;
		expect(matrix1).not.toBe(matrix2);
	});

	test('entity.matrix returns new object after changing width', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		const matrix1 = ref!.matrix;
		ref!.width = 100;
		const matrix2 = ref!.matrix;
		expect(matrix1).not.toBe(matrix2);
	});

	test('entity.matrix returns new object after changing rotate', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		const matrix1 = ref!.matrix;
		ref!.rotate = 45;
		const matrix2 = ref!.matrix;
		expect(matrix1).not.toBe(matrix2);
	});

	test('entity.matrix is not invalidated when setting same value', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		const matrix1 = ref!.matrix;
		ref!.x = 10; // same value
		const matrix2 = ref!.matrix;
		expect(matrix1).toBe(matrix2);
	});
});

describe('Inverse matrix caching', () => {
	test('inverseMatrix returns same reference when properties unchanged', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		const inv1 = ref!.inverseMatrix;
		const inv2 = ref!.inverseMatrix;
		expect(inv1).toBe(inv2);
	});

	test('inverseMatrix invalidated independently from matrix', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		const inv1 = ref!.inverseMatrix;
		ref!.x = 99;
		const inv2 = ref!.inverseMatrix;
		expect(inv1).not.toBe(inv2);
	});

	test('inverseMatrix is cached separately from matrix', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		// Access matrix and inverse matrix to populate caches
		const m1 = ref!.matrix;
		const inv1 = ref!.inverseMatrix;
		// Both should be cached
		expect(ref!.matrix).toBe(m1);
		expect(ref!.inverseMatrix).toBe(inv1);
		// They should be different objects
		expect(m1).not.toBe(inv1);
	});
});

describe('Path caching - Rect', () => {
	test('path returns same reference when properties unchanged', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		const path2 = ref!.path;
		expect(path1).toBe(path2);
	});

	test('path is recomputed when width changes', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		ref!.width = 100;
		const path2 = ref!.path;
		expect(path1).not.toBe(path2);
	});

	test('path is recomputed when height changes', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		ref!.height = 100;
		const path2 = ref!.path;
		expect(path1).not.toBe(path2);
	});

	test('path is NOT recomputed when x changes (position only affects matrix)', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Rect | null = null;
		await render(
			<Rect ref={(r) => { ref = r; }} x={10} y={20} width={50} height={30} fill='red' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		ref!.x = 99;
		const path2 = ref!.path;
		expect(path1).toBe(path2);
	});
});

describe('Path caching - Arc', () => {
	test('arc path is cached', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Arc | null = null;
		await render(
			<Arc ref={(r) => { ref = r; }} x={50} y={50} radius={25} startAngle={0} endAngle={360} fill='green' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		const path2 = ref!.path;
		expect(path1).toBe(path2);
	});

	test('arc path recomputed when radius changes', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Arc | null = null;
		await render(
			<Arc ref={(r) => { ref = r; }} x={50} y={50} radius={25} startAngle={0} endAngle={360} fill='green' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		ref!.radius = 40;
		const path2 = ref!.path;
		expect(path1).not.toBe(path2);
	});

	test('arc path recomputed when startAngle changes', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Arc | null = null;
		await render(
			<Arc ref={(r) => { ref = r; }} x={50} y={50} radius={25} startAngle={0} endAngle={360} fill='green' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		ref!.startAngle = 90;
		const path2 = ref!.path;
		expect(path1).not.toBe(path2);
	});
});

describe('Path caching - Ellipse', () => {
	test('ellipse path is cached', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Ellipse | null = null;
		await render(
			<Ellipse ref={(r) => { ref = r; }} x={50} y={50} radiusX={30} radiusY={20} fill='blue' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		const path2 = ref!.path;
		expect(path1).toBe(path2);
	});

	test('ellipse path recomputed when radiusX changes', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Ellipse | null = null;
		await render(
			<Ellipse ref={(r) => { ref = r; }} x={50} y={50} radiusX={30} radiusY={20} fill='blue' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		ref!.radiusX = 50;
		const path2 = ref!.path;
		expect(path1).not.toBe(path2);
	});
});

describe('Path caching - Line', () => {
	test('line path is cached', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Line | null = null;
		await render(
			<Line ref={(r) => { ref = r; }} points={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} stroke='white' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		const path2 = ref!.path;
		expect(path1).toBe(path2);
	});

	test('line path recomputed when points change', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _Line | null = null;
		await render(
			<Line ref={(r) => { ref = r; }} points={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} stroke='white' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		ref!.points = [{ x: 0, y: 0 }, { x: 50, y: 50 }];
		const path2 = ref!.path;
		expect(path1).not.toBe(path2);
	});
});

describe('Path caching - RoundRect', () => {
	test('roundrect path is cached', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _RoundRect | null = null;
		await render(
			<RoundRect ref={(r) => { ref = r; }} x={10} y={10} width={50} height={30} radii={5} fill='purple' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		const path2 = ref!.path;
		expect(path1).toBe(path2);
	});

	test('roundrect path recomputed when radii changes', async (render) => {
		const canvas = new Canvas(150, 100);
		let ref: _RoundRect | null = null;
		await render(
			<RoundRect ref={(r) => { ref = r; }} x={10} y={10} width={50} height={30} radii={5} fill='purple' />,
			canvas,
			config,
		);
		const path1 = ref!.path;
		ref!.radii = 15;
		const path2 = ref!.path;
		expect(path1).not.toBe(path2);
	});
});
