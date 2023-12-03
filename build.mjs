import { build } from 'esbuild';

await build({
    entryPoints: ['src/index.ts', 'src/render.ts'],
    outdir: process.cwd(),
    target: 'ES2020',
    sourcemap: true
});
