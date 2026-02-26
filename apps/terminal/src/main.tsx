// @ts-expect-error Vite asset import
import GeistMonoBold from 'geist/dist/fonts/geist-mono/GeistMono-Bold.woff2?url';
// @ts-expect-error Vite asset import
import GeistMonoRegular from 'geist/dist/fonts/geist-mono/GeistMono-Regular.woff2?url';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Load Geist Mono font before rendering so the terminal uses correct metrics
const fonts = [
	new FontFace('Geist Mono', `url(${GeistMonoRegular})`, { weight: '400' }),
	new FontFace('Geist Mono', `url(${GeistMonoBold})`, { weight: '700' }),
];

Promise.all(
	fonts.map((f) => {
		document.fonts.add(f);
		return f.load();
	}),
).then(() => {
	ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
});
