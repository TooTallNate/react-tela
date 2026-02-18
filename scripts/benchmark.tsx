/**
 * Performance benchmark for react-tela rendering.
 * Run with: npx tsx scripts/benchmark.tsx
 *
 * Measures render performance for various scenarios.
 */
import React, { useState, useEffect } from 'react';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import nodeConfig, { Canvas, GlobalFonts } from '@napi-rs/canvas';
import { render } from '../src/render';
import {
	Rect,
	RoundRect,
	Circle,
	Text,
	Group,
	useDimensions,
} from '../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
	const fontPath = join(__dirname, '..', 'test', 'Geist-Regular.otf');
	GlobalFonts.registerFromPath(fontPath, 'Geist');
} catch {}

interface BenchmarkResult {
	name: string;
	initialRenderMs: number;
	avgReRenderMs: number;
	rendersPerSecond: number;
	renderCount: number;
}

const results: BenchmarkResult[] = [];

async function benchmark(
	name: string,
	width: number,
	height: number,
	element: React.JSX.Element,
	reRenderCount = 100,
) {
	// Measure initial render
	const canvas = new Canvas(width, height);
	const t0 = performance.now();
	const root = render(element, canvas, nodeConfig);
	await root;
	const initialRenderMs = performance.now() - t0;

	// Measure re-renders
	const t1 = performance.now();
	for (let i = 0; i < reRenderCount; i++) {
		root.queueRender();
		root.render();
	}
	const totalReRenderMs = performance.now() - t1;
	const avgReRenderMs = totalReRenderMs / reRenderCount;
	const rendersPerSecond = 1000 / avgReRenderMs;

	results.push({
		name,
		initialRenderMs,
		avgReRenderMs,
		rendersPerSecond,
		renderCount: reRenderCount,
	});

	console.log(
		`  ${name}: initial=${initialRenderMs.toFixed(2)}ms, ` +
			`re-render=${avgReRenderMs.toFixed(3)}ms avg (${rendersPerSecond.toFixed(0)} renders/s)`,
	);
}

async function main() {
	const RERENDERS = 500;

	console.log('react-tela Performance Benchmark');
	console.log('='.repeat(60));
	console.log();

	// ─── Single entity benchmarks ───
	console.log('Single entity:');

	await benchmark(
		'Single Rect',
		800,
		600,
		<Rect x={10} y={10} width={100} height={100} fill='red' />,
		RERENDERS,
	);

	await benchmark(
		'Single Rect (stroke + fill)',
		800,
		600,
		<Rect x={10} y={10} width={100} height={100} fill='red' stroke='blue' lineWidth={3} />,
		RERENDERS,
	);

	await benchmark(
		'Single RoundRect',
		800,
		600,
		<RoundRect x={10} y={10} width={100} height={100} fill='blue' radii={10} />,
		RERENDERS,
	);

	await benchmark(
		'Single Circle',
		800,
		600,
		<Circle x={100} y={100} radius={50} fill='green' />,
		RERENDERS,
	);

	await benchmark(
		'Single Text',
		800,
		600,
		<Text x={10} y={10} fontSize={24} fontFamily='Geist' fill='white'>
			Hello world!
		</Text>,
		RERENDERS,
	);

	console.log();

	// ─── Multiple entity benchmarks ───
	console.log('Multiple entities (flat):');

	for (const count of [10, 50, 100, 500]) {
		const rects = Array.from({ length: count }, (_, i) => (
			<Rect
				key={i}
				x={(i * 7) % 780}
				y={(i * 11) % 580}
				width={20}
				height={20}
				fill={`hsl(${(i * 37) % 360}, 70%, 50%)`}
			/>
		));

		await benchmark(`${count} Rects`, 800, 600, <>{rects}</>, RERENDERS);
	}

	console.log();

	// ─── Nested group benchmarks ───
	console.log('Nested groups:');

	await benchmark(
		'1 Group with 10 Rects',
		800,
		600,
		<Group x={0} y={0} width={800} height={600}>
			{Array.from({ length: 10 }, (_, i) => (
				<Rect key={i} x={i * 75} y={10} width={60} height={60} fill='red' />
			))}
		</Group>,
		RERENDERS,
	);

	await benchmark(
		'5 Groups with 10 Rects each',
		800,
		600,
		<>
			{Array.from({ length: 5 }, (_, g) => (
				<Group key={g} x={0} y={g * 120} width={800} height={100}>
					{Array.from({ length: 10 }, (_, i) => (
						<Rect key={i} x={i * 75} y={10} width={60} height={60} fill='blue' />
					))}
				</Group>
			))}
		</>,
		RERENDERS,
	);

	await benchmark(
		'Deeply nested (5 levels)',
		800,
		600,
		<Group x={0} y={0} width={800} height={600}>
			<Rect fill='#111' />
			<Group x={10} y={10} width={780} height={580}>
				<Rect fill='#222' />
				<Group x={10} y={10} width={760} height={560}>
					<Rect fill='#333' />
					<Group x={10} y={10} width={740} height={540}>
						<Rect fill='#444' />
						<Group x={10} y={10} width={720} height={520}>
							<Rect fill='#555' />
						</Group>
					</Group>
				</Group>
			</Group>
		</Group>,
		RERENDERS,
	);

	console.log();

	// ─── Mixed content ───
	console.log('Mixed content:');

	await benchmark(
		'Dashboard-like (rects + text + groups)',
		800,
		600,
		<>
			<Rect width={800} height={600} fill='#1a1a2e' />
			<Group x={10} y={10} width={780} height={50}>
				<Rect fill='#16213e' />
				<Text x={15} y={15} fontSize={20} fontFamily='Geist' fill='white'>
					Dashboard
				</Text>
			</Group>
			{Array.from({ length: 6 }, (_, i) => (
				<Group
					key={i}
					x={10 + (i % 3) * 260}
					y={70 + Math.floor(i / 3) * 270}
					width={250}
					height={260}
				>
					<RoundRect fill='#16213e' radii={8} />
					<Text x={10} y={10} fontSize={16} fontFamily='Geist' fill='#ccc'>
						Card {i + 1}
					</Text>
					{Array.from({ length: 5 }, (_, j) => (
						<Rect
							key={j}
							x={10}
							y={40 + j * 42}
							width={230}
							height={35}
							fill='#0f3460'
						/>
					))}
				</Group>
			))}
		</>,
		RERENDERS,
	);

	// ─── Summary ───
	console.log();
	console.log('='.repeat(60));
	console.log('Summary:');
	console.log();
	console.log(
		'Name'.padEnd(45) +
			'Initial'.padStart(10) +
			'Re-render'.padStart(12) +
			'  Renders/s',
	);
	console.log('-'.repeat(85));
	for (const r of results) {
		console.log(
			r.name.padEnd(45) +
				`${r.initialRenderMs.toFixed(2)}ms`.padStart(10) +
				`${r.avgReRenderMs.toFixed(3)}ms`.padStart(12) +
				`  ${r.rendersPerSecond.toFixed(0)}`,
		);
	}
}

main().catch(console.error);
