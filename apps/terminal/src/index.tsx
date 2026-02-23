import React, { useEffect, useRef } from 'react';
import config, { Canvas, type SKRSContext2D } from '@napi-rs/canvas';
import { render } from 'react-tela/render';
import { Terminal, TerminalEntity } from '@react-tela/terminal';
import * as pty from 'node-pty';
import { writeFileSync } from 'node:fs';

// Canvas dimensions
const WIDTH = 900;
const HEIGHT = 700;

// Terminal settings
const COLS = 80;
const ROWS = 24;
const FONT_SIZE = 14;

/**
 * The main App component renders a terminal inside a react-tela canvas
 * with a 3D perspective-like transformation, as if the terminal is
 * mounted on a wall and viewed from an angle.
 */
function App({ onReady }: { onReady: (entity: TerminalEntity) => void }) {
	const termRef = useRef<TerminalEntity>(null);

	useEffect(() => {
		if (termRef.current) {
			onReady(termRef.current);
		}
	}, []);

	return (
		<Terminal
			ref={termRef}
			cols={COLS}
			rows={ROWS}
			fontSize={FONT_SIZE}
			// Position the terminal with a rotation and scale to simulate
			// viewing a screen mounted on a wall at an angle
			x={WIDTH / 2 - 200}
			y={80}
			rotate={-8}
			scaleX={0.85}
			scaleY={0.95}
			shadowColor="rgba(0, 0, 0, 0.5)"
			shadowBlur={30}
			shadowOffsetX={15}
			shadowOffsetY={15}
		/>
	);
}

async function main() {
	const canvas = new Canvas(WIDTH, HEIGHT);
	const ctx = canvas.getContext('2d') as unknown as SKRSContext2D;

	// Draw a dark "wall" background with a subtle gradient effect
	const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
	gradient.addColorStop(0, '#2c3e50');
	gradient.addColorStop(1, '#1a252f');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	// Draw some "wall" texture lines
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
	ctx.lineWidth = 1;
	for (let y = 0; y < HEIGHT; y += 20) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(WIDTH, y);
		ctx.stroke();
	}

	let resolveEntity: (e: TerminalEntity) => void;
	const entityReady = new Promise<TerminalEntity>(
		(r) => (resolveEntity = r),
	);

	// Render the react-tela scene
	await render(<App onReady={(e) => resolveEntity(e)} />, canvas, config);

	const entity = await entityReady;

	// Spawn a shell using node-pty
	const shell =
		process.env.SHELL || (process.platform === 'win32' ? 'powershell.exe' : 'bash');
	const ptyProcess = pty.spawn(shell, [], {
		name: 'xterm-256color',
		cols: COLS,
		rows: ROWS,
		cwd: process.env.HOME || process.cwd(),
		env: process.env as Record<string, string>,
	});

	// Pipe pty output to the terminal component
	ptyProcess.onData((data: string) => {
		entity.write(data);
	});

	// Send a demo command to show something interesting
	ptyProcess.write('echo "╔══════════════════════════════════════╗"\r');
	ptyProcess.write('echo "║  react-tela terminal demo            ║"\r');
	ptyProcess.write('echo "║  rendered on a canvas with transform ║"\r');
	ptyProcess.write('echo "╚══════════════════════════════════════╝"\r');
	ptyProcess.write('ls --color=auto\r');

	// Wait for output to render
	await new Promise((r) => setTimeout(r, 1500));

	// Save the rendered canvas as a PNG
	const outputPath = new URL('../output.png', import.meta.url).pathname;
	const buffer = canvas.toBuffer('image/png');
	writeFileSync(outputPath, buffer);
	console.log(`✅ Rendered terminal demo saved to: ${outputPath}`);

	// Clean up
	ptyProcess.kill();
	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
