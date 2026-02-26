import { join } from 'path';
import config, { Canvas } from '@napi-rs/canvas';
import { Root } from '@react-tela/core';
import { expect, test } from 'vitest';

function createRoot() {
	const canvas = new Canvas(100, 100);
	const ctx = canvas.getContext('2d');
	return new Root(ctx, config);
}

test('loadImage works without a signal', async () => {
	const root = createRoot();
	const src = join(__dirname, 'pexels-sidorela-shehaj-339534630-19546368.jpg');
	const img = await root.loadImage(src);
	expect(img.naturalWidth).toBeGreaterThan(0);
	expect(img.naturalHeight).toBeGreaterThan(0);
});

test('loadImage rejects when signal is already aborted', async () => {
	const root = createRoot();
	const src = join(__dirname, 'pexels-sidorela-shehaj-339534630-19546368.jpg');
	const controller = new AbortController();
	controller.abort();
	await expect(
		root.loadImage(src, { signal: controller.signal }),
	).rejects.toThrow('aborted');
});

test('loadImage rejects when signal is aborted mid-load', async () => {
	const root = createRoot();
	const src = join(__dirname, 'pexels-sidorela-shehaj-339534630-19546368.jpg');
	const controller = new AbortController();
	const promise = root.loadImage(src, { signal: controller.signal });
	// Abort immediately — the load is async so this races with the file read
	controller.abort();
	await expect(promise).rejects.toThrow('aborted');
});
