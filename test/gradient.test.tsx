import './helpers/font';
import React from 'react';
import { test, expect } from 'vitest';
import config, { Canvas } from '@napi-rs/canvas';
import {
	Rect,
	Text,
	useLinearGradient,
	useRadialGradient,
	type ColorStop,
} from '../src';
import { render } from '../src/render';

function LinearGradientRect({
	width,
	height,
	x0,
	y0,
	x1,
	y1,
	stops,
}: {
	width: number;
	height: number;
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	stops: ColorStop[];
}) {
	const gradient = useLinearGradient(x0, y0, x1, y1, stops);
	return <Rect width={width} height={height} fill={gradient} />;
}

function RadialGradientRect({
	width,
	height,
	x0,
	y0,
	r0,
	x1,
	y1,
	r1,
	stops,
}: {
	width: number;
	height: number;
	x0: number;
	y0: number;
	r0: number;
	x1: number;
	y1: number;
	r1: number;
	stops: ColorStop[];
}) {
	const gradient = useRadialGradient(x0, y0, r0, x1, y1, r1, stops);
	return <Rect width={width} height={height} fill={gradient} />;
}

function LinearGradientStrokeRect({
	x,
	y,
	width,
	height,
	x0,
	y0,
	x1,
	y1,
	stops,
	lineWidth,
}: {
	x: number;
	y: number;
	width: number;
	height: number;
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	stops: ColorStop[];
	lineWidth: number;
}) {
	const gradient = useLinearGradient(x0, y0, x1, y1, stops);
	return (
		<Rect
			x={x}
			y={y}
			width={width}
			height={height}
			stroke={gradient}
			lineWidth={lineWidth}
		/>
	);
}

function LinearGradientText({
	stops,
}: {
	stops: ColorStop[];
}) {
	const gradient = useLinearGradient(0, 0, 300, 0, stops);
	return (
		<Text fontFamily='Geist Sans' fontSize={48} fill={gradient}>
			Gradient
		</Text>
	);
}

test('should render <Rect> with linearGradient fill', async () => {
	const canvas = new Canvas(200, 100);
	await render(
		<LinearGradientRect
			width={200}
			height={100}
			x0={0}
			y0={0}
			x1={200}
			y1={0}
			stops={[
				[0, 'red'],
				[0.5, 'yellow'],
				[1, 'blue'],
			]}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with radialGradient fill', async () => {
	const canvas = new Canvas(200, 200);
	await render(
		<RadialGradientRect
			width={200}
			height={200}
			x0={100}
			y0={100}
			r0={10}
			x1={100}
			y1={100}
			r1={100}
			stops={[
				[0, 'white'],
				[1, 'black'],
			]}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Rect> with linearGradient stroke', async () => {
	const canvas = new Canvas(200, 100);
	await render(
		<LinearGradientStrokeRect
			x={10}
			y={10}
			width={180}
			height={80}
			x0={0}
			y0={0}
			x1={200}
			y1={0}
			stops={[
				[0, 'green'],
				[1, 'purple'],
			]}
			lineWidth={4}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});

test('should render <Text> with linearGradient fill', async () => {
	const canvas = new Canvas(300, 60);
	await render(
		<LinearGradientText
			stops={[
				[0, 'red'],
				[1, 'blue'],
			]}
		/>,
		canvas,
		config,
	);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot({
		failureThreshold: 0.08,
		failureThresholdType: 'percent',
	});
});

test('string fill still works (backward compat)', async () => {
	const canvas = new Canvas(100, 100);
	await render(<Rect width={100} height={100} fill='red' />, canvas, config);
	expect(canvas.toBuffer('image/png')).toMatchImageSnapshot();
});
