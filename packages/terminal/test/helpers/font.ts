import { join } from 'path';
import { GlobalFonts } from '@napi-rs/canvas';

GlobalFonts.registerFromPath(
	join(__dirname, '../GeistMono-Regular.otf'),
	'Geist Mono',
);
