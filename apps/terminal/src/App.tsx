import { Terminal, TerminalEntity } from '@react-tela/terminal';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	Circle,
	Group,
	Rect,
	RoundRect,
	Text,
	useParent,
} from 'react-tela';
import { render } from 'react-tela/render';

// Terminal settings
const FONT_SIZE = 16;
const TITLE_BAR_HEIGHT = 40;
const WINDOW_PADDING = 40;
const WINDOW_BORDER_RADIUS = 10;
const PAGE_BG = '#e8e8e8';
const TERM_BG = '#1a252f';

/**
 * Hook that returns reactive canvas dimensions by listening to
 * the root's render events. When the canvas is resized externally,
 * the root re-renders and this hook picks up the new dimensions.
 */
function useCanvasDimensions() {
	const parent = useParent();
	const { canvas } = parent.ctx;
	const [dims, setDims] = useState({
		width: canvas.width,
		height: canvas.height,
	});

	useEffect(() => {
		const onRender = () => {
			setDims((prev) => {
				if (prev.width !== canvas.width || prev.height !== canvas.height) {
					return { width: canvas.width, height: canvas.height };
				}
				return prev;
			});
		};
		parent.addEventListener('render', onRender);
		return () => parent.removeEventListener('render', onRender);
	}, [parent, canvas]);

	return dims;
}

/**
 * macOS-style traffic light buttons rendered with react-tela primitives.
 * x/y specify the center of the first (red) button.
 */
function TrafficLights({ x, y, dpr }: { x: number; y: number; dpr: number }) {
	const gap = 20 * dpr;
	const r = 6 * dpr;
	return (
		<>
			<Circle x={x} y={y} radius={r} fill='#ff5f57' />
			<Circle x={x + gap} y={y} radius={r} fill='#febc2e' />
			<Circle x={x + gap * 2} y={y} radius={r} fill='#28c840' />
		</>
	);
}

/**
 * Inner react-tela scene rendered onto the canvas.
 * Renders macOS chrome + terminal, reading canvas dimensions reactively.
 */
function Scene({ onReady }: { onReady: (entity: TerminalEntity) => void }) {
	const termRef = useRef<TerminalEntity>(null);
	const { width, height } = useCanvasDimensions();
	const dpr = window.devicePixelRatio || 1;

	// Scaled dimensions for layout
	const padding = WINDOW_PADDING * dpr;
	const titleBarH = TITLE_BAR_HEIGHT * dpr;
	const borderRadius = WINDOW_BORDER_RADIUS * dpr;

	// Window bounds (inset from canvas edges)
	const winX = padding;
	const winY = padding;
	const winW = width - padding * 2;
	const winH = height - padding * 2;

	// Terminal area (below title bar)
	const termX = winX;
	const termY = winY + titleBarH;
	const termW = winW;
	const termH = winH - titleBarH;

	// Traffic lights: x/y are center of the circle, so offset by radius from edges
	const lightsX = winX + 20 * dpr;
	const lightsY = winY + titleBarH / 2;

	useEffect(() => {
		if (termRef.current) {
			onReady(termRef.current);
		}
	}, []);

	return (
		<>
			{/* Page background */}
			<Rect x={0} y={0} width={width} height={height} fill={PAGE_BG} />

			{/* Window shadow (full window shape) */}
			<RoundRect
				x={winX}
				y={winY}
				width={winW}
				height={winH}
				borderRadius={borderRadius}
				fill={TERM_BG}
				shadowColor='rgba(0,0,0,0.35)'
				shadowBlur={40 * dpr}
				shadowOffsetY={10 * dpr}
			/>

			{/* Terminal rendered inside a Group for isolation, with rounded bottom corners */}
			<Group x={termX} y={termY} width={termW} height={termH} borderRadius={[0, 0, borderRadius, borderRadius]}>
				<Terminal
					ref={termRef}
					x={0}
					y={0}
					width={termW}
					height={termH}
					fontFamily='Geist Mono'
					fontSize={FONT_SIZE * dpr}
					theme={{ background: TERM_BG }}
				/>
			</Group>

			{/* Title bar background (painted on top of terminal) */}
			<Rect
				x={winX}
				y={winY}
				width={winW}
				height={titleBarH}
				fill='#2c2c2c'
			/>

			{/* Title bar bottom separator */}
			<Rect
				x={winX}
				y={winY + titleBarH - 1 * dpr}
				width={winW}
				height={1 * dpr}
				fill='#1a1a1a'
			/>

			{/* Traffic light buttons */}
			<TrafficLights x={lightsX} y={lightsY} dpr={dpr} />

			{/* Title text */}
			<Text
				x={winX + winW / 2}
				y={winY + titleBarH / 2 - (13 * dpr) / 2}
				fontSize={13 * dpr}
				fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
				fontWeight='500'
				fill='rgba(255,255,255,0.5)'
				textAlign='center'
			>
				Terminal
			</Text>
		</>
	);
}

/**
 * Simple local echo shell that handles basic line editing.
 * Since we can't use node-pty in the browser, this provides
 * an interactive experience where users can type and see output.
 */
class LocalShell {
	#entity: TerminalEntity;
	#lineBuffer = '';
	#prompt = '$ ';

	constructor(entity: TerminalEntity) {
		this.#entity = entity;
	}

	async start() {
		await this.#entity.write(
			'\x1b[1;36m╔══════════════════════════════════════╗\r\n' +
				'║  react-tela terminal demo            ║\r\n' +
				'║  interactive browser terminal        ║\r\n' +
				'╚══════════════════════════════════════╝\x1b[0m\r\n\r\n',
		);
		await this.#entity.write(
			'Type commands below. Try: \x1b[1;33mhelp\x1b[0m, \x1b[1;33mecho <text>\x1b[0m, \x1b[1;33mclear\x1b[0m, \x1b[1;33mdate\x1b[0m\r\n\r\n',
		);
		await this.#writePrompt();
	}

	async #writePrompt() {
		await this.#entity.write(`\x1b[1;32m${this.#prompt}\x1b[0m`);
	}

	async handleInput(data: string) {
		for (const ch of data) {
			if (ch === '\r' || ch === '\n') {
				await this.#entity.write('\r\n');
				await this.#executeCommand(this.#lineBuffer.trim());
				this.#lineBuffer = '';
				await this.#writePrompt();
			} else if (ch === '\x7f' || ch === '\b') {
				// Backspace
				if (this.#lineBuffer.length > 0) {
					this.#lineBuffer = this.#lineBuffer.slice(0, -1);
					await this.#entity.write('\b \b');
				}
			} else if (ch === '\x03') {
				// Ctrl+C
				this.#lineBuffer = '';
				await this.#entity.write('^C\r\n');
				await this.#writePrompt();
			} else if (ch === '\x0c') {
				// Ctrl+L (clear)
				await this.#entity.write('\x1b[2J\x1b[H');
				await this.#writePrompt();
			} else if (ch >= ' ') {
				this.#lineBuffer += ch;
				await this.#entity.write(ch);
			}
		}
	}

	async #executeCommand(cmd: string) {
		if (!cmd) return;

		const [command, ...args] = cmd.split(/\s+/);
		switch (command) {
			case 'help':
				await this.#entity.write(
					'\x1b[1mAvailable commands:\x1b[0m\r\n' +
						'  \x1b[33mhelp\x1b[0m          Show this help message\r\n' +
						'  \x1b[33mecho <text>\x1b[0m   Print text to the terminal\r\n' +
						'  \x1b[33mclear\x1b[0m         Clear the screen\r\n' +
						'  \x1b[33mdate\x1b[0m          Show current date and time\r\n' +
						'  \x1b[33mcolors\x1b[0m        Show color test\r\n' +
						'  \x1b[33mmatrix\x1b[0m        Display a matrix-style effect\r\n' +
						'  \x1b[33malpha <0-1>\x1b[0m   Set terminal transparency\r\n',
				);
				break;
			case 'echo':
				await this.#entity.write(args.join(' ') + '\r\n');
				break;
			case 'clear':
				await this.#entity.write('\x1b[2J\x1b[H');
				break;
			case 'date':
				await this.#entity.write(new Date().toString() + '\r\n');
				break;
			case 'colors': {
				let line = '';
				for (let i = 0; i < 16; i++) {
					line += `\x1b[48;5;${i}m  \x1b[0m`;
				}
				await this.#entity.write(line + '\r\n');
				for (let row = 0; row < 6; row++) {
					line = '';
					for (let col = 0; col < 36; col++) {
						const code = 16 + row * 36 + col;
						line += `\x1b[48;5;${code}m \x1b[0m`;
					}
					await this.#entity.write(line + '\r\n');
				}
				break;
			}
			case 'matrix': {
				const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:.="*+-<>';
				for (let i = 0; i < 8; i++) {
					let line = '';
					for (let j = 0; j < 40; j++) {
						const c = chars[Math.floor(Math.random() * chars.length)];
						const bright = Math.random() > 0.7;
						line += bright ? `\x1b[1;32m${c}\x1b[0m` : `\x1b[32m${c}\x1b[0m`;
					}
					await this.#entity.write(line + '\r\n');
				}
				break;
			}
			case 'alpha': {
				const val = parseFloat(args[0]);
				if (isNaN(val) || val < 0 || val > 1) {
					await this.#entity.write(
						'\x1b[31mUsage: alpha <0-1> (e.g. alpha 0.5)\x1b[0m\r\n',
					);
				} else {
					this.#entity.alpha = val;
					await this.#entity.write(
						`Terminal alpha set to \x1b[1;33m${val}\x1b[0m\r\n`,
					);
				}
				break;
			}
			default:
				await this.#entity.write(
					`\x1b[31mcommand not found: ${command}\x1b[0m\r\n`,
				);
		}
	}
}

export function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rootRef = useRef<any>(null);
	const shellRef = useRef<LocalShell | null>(null);

	const handleReady = useCallback((entity: TerminalEntity) => {
		if (shellRef.current) return; // Already initialized
		const shell = new LocalShell(entity);
		shellRef.current = shell;
		shell.start();
	}, []);

	// Render react-tela scene once on mount
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// Set initial canvas size
		const dpr = window.devicePixelRatio || 1;
		canvas.width = canvas.clientWidth * dpr;
		canvas.height = canvas.clientHeight * dpr;

		rootRef.current = render(<Scene onReady={handleReady} />, canvas);

		// Observe container resize and update canvas pixel dimensions.
		// The Scene component listens for root render events to pick up the new size.
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				const w = Math.floor(width * dpr);
				const h = Math.floor(height * dpr);
				if (canvas.width !== w || canvas.height !== h) {
					canvas.width = w;
					canvas.height = h;
					rootRef.current?.queueRender();
				}
			}
		});
		observer.observe(canvas);

		return () => {
			observer.disconnect();
			if (rootRef.current) {
				rootRef.current.clear();
				rootRef.current = null;
			}
		};
	}, [handleReady]);

	// Keyboard input handler
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!shellRef.current) return;

			// Allow browser shortcuts through (Cmd+R, Cmd+T, Cmd+W, Cmd+L, etc.)
			if (e.metaKey || e.altKey) return;

			let data = '';
			if (e.key === 'Enter') {
				data = '\r';
			} else if (e.key === 'Backspace') {
				data = '\x7f';
			} else if (e.key === 'Tab') {
				data = '\t';
			} else if (e.key === 'Escape') {
				data = '\x1b';
			} else if (e.key === 'ArrowUp') {
				data = '\x1b[A';
			} else if (e.key === 'ArrowDown') {
				data = '\x1b[B';
			} else if (e.key === 'ArrowRight') {
				data = '\x1b[C';
			} else if (e.key === 'ArrowLeft') {
				data = '\x1b[D';
			} else if (e.ctrlKey && e.key.length === 1) {
				// Ctrl+key
				const code = e.key.toLowerCase().charCodeAt(0) - 96;
				if (code > 0 && code < 27) {
					data = String.fromCharCode(code);
				}
			} else if (e.key.length === 1) {
				data = e.key;
			}

			if (data) {
				// Only prevent default for keys the terminal actually handles
				e.preventDefault();
				shellRef.current.handleInput(data);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				width: '100vw',
				height: '100vh',
				display: 'block',
				cursor: 'text',
			}}
		/>
	);
}
