import './helpers/font';
import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import { Rect, Circle, Ellipse, Text, Line, RoundRect } from '../src';
import { render } from '../src/render';

test('should render a scene with mixed shape types', async () => {
	const canvas = new Canvas(400, 300);
	await render(
		<>
			{/* Background */}
			<Rect width={400} height={300} fill='#1a1a2e' />
			{/* Sun */}
			<Circle x={300} y={20} radius={40} fill='#f39c12' />
			{/* Ground */}
			<Rect x={0} y={220} width={400} height={80} fill='#2ecc71' />
			{/* House body */}
			<Rect x={100} y={150} width={120} height={70} fill='#e74c3c' />
			{/* Door */}
			<RoundRect
				x={140}
				y={180}
				width={40}
				height={40}
				fill='#8b4513'
				radii={[5, 5, 0, 0]}
			/>
			{/* Window */}
			<Rect
				x={200}
				y={165}
				width={15}
				height={15}
				fill='lightyellow'
				stroke='#333'
				lineWidth={1}
			/>
			{/* Roof line */}
			<Line
				points={[
					{ x: 90, y: 150 },
					{ x: 160, y: 100 },
					{ x: 230, y: 150 },
				]}
				stroke='#8b0000'
				lineWidth={4}
			/>
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render text over shapes', async () => {
	const canvas = new Canvas(300, 100);
	await render(
		<>
			<RoundRect
				x={10}
				y={10}
				width={280}
				height={80}
				fill='#3498db'
				radii={10}
			/>
			<Text x={30} y={30} fontSize={32} fontFamily='Geist Sans' fill='white'>
				Button Text
			</Text>
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should compose multiple overlapping circles', async () => {
	const canvas = new Canvas(250, 150);
	const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
	await render(
		<>
			{colors.map((color, i) => (
				<Circle
					key={i}
					x={30 + i * 40}
					y={25}
					radius={40}
					fill={color}
					alpha={0.6}
				/>
			))}
		</>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
