import { join } from 'path';
import { expect } from 'vitest';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { GlobalFonts } from '@napi-rs/canvas';

expect.extend({ toMatchImageSnapshot });

// Register Geist Mono for consistent cross-platform rendering
GlobalFonts.registerFromPath(
	join(__dirname, 'GeistMono-Regular.ttf'),
	'Geist Mono',
);
