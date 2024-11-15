import { join } from 'path';
import { GlobalFonts } from '@napi-rs/canvas';

GlobalFonts.registerFromPath(
	join(__dirname, 'Geist-Regular.otf'),
	'Geist Sans',
);
