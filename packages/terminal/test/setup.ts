import { createRequire } from 'module';
import { dirname, join, resolve } from 'path';
import { GlobalFonts } from '@napi-rs/canvas';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { expect } from 'vitest';

expect.extend({ toMatchImageSnapshot });

const require = createRequire(import.meta.url);
const geistDir = resolve(dirname(require.resolve('geist/font/mono')), '..');

// Register Geist Mono under a unique name so it won't conflict
// with a system-installed "Geist Mono" font.
GlobalFonts.registerFromPath(
	join(geistDir, 'dist/fonts/geist-mono/GeistMono-Regular.ttf'),
	'Geist Mono Test',
);
