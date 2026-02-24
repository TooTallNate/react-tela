import { GlobalFonts } from '@napi-rs/canvas';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { join } from 'path';
import { expect } from 'vitest';

expect.extend({ toMatchImageSnapshot });

// Register Geist Mono under a unique name so it won't conflict
// with a system-installed "Geist Mono" font.
GlobalFonts.registerFromPath(
	join(__dirname, 'GeistMono-Regular.ttf'),
	'Geist Mono Test',
);
