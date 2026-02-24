import { createRequire } from 'module';
import { dirname, join, resolve } from 'path';
import { GlobalFonts } from '@napi-rs/canvas';

const require = createRequire(import.meta.url);
const geistDir = resolve(dirname(require.resolve('geist/font/sans')), '..');

GlobalFonts.registerFromPath(
	join(geistDir, 'dist/fonts/geist-sans/Geist-Regular.ttf'),
	'Geist Sans',
);
