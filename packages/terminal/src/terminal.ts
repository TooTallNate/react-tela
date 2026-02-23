import { Entity, type EntityProps } from '@react-tela/core';
import type { Terminal as XTerminalType, ITheme } from '@xterm/headless';
import XTermHeadless from '@xterm/headless';
// @xterm/headless is CJS-only; handle both Node ESM (default.Terminal) and bundler (Terminal) interop
const _mod = XTermHeadless as any;
const XTerminal = (_mod.Terminal ?? _mod.default?.Terminal) as typeof XTerminalType;

// ANSI 256-color palette (first 16 standard colors)
const ANSI_COLORS = [
	'#000000', '#cd0000', '#00cd00', '#cdcd00',
	'#0000ee', '#cd00cd', '#00cdcd', '#e5e5e5',
	'#7f7f7f', '#ff0000', '#00ff00', '#ffff00',
	'#5c5cff', '#ff00ff', '#00ffff', '#ffffff',
];

/**
 * Props for the Terminal entity.
 */
export interface TerminalProps extends EntityProps {
	/** Number of columns. @default 80 */
	cols?: number;
	/** Number of rows. @default 30 */
	rows?: number;
	/** Font size in pixels. @default 16 */
	fontSize?: number;
	/** Font family. @default "monospace" */
	fontFamily?: string;
	/** Character width in pixels. Auto-calculated from fontSize if not set. */
	charWidth?: number;
	/** Line height in pixels. Auto-calculated from fontSize if not set. */
	lineHeight?: number;
	/** xterm.js theme object. */
	theme?: ITheme;
	/** Scrollback buffer size. @default 500 */
	scrollback?: number;
	/** Called when the terminal produces output data (e.g. from user input responses). */
	onData?: (data: string) => void;
	/** Called when the terminal is resized. */
	onResize?: (cols: number, rows: number) => void;
}

/**
 * A react-tela entity that renders an xterm.js terminal to a Canvas2D surface.
 *
 * Uses `@xterm/headless` for terminal state management and draws the buffer
 * contents using canvas text rendering.
 */
export class Terminal extends Entity {
	#term: XTerminalType;
	#cols: number;
	#rows: number;
	#fontSize: number;
	#fontFamily: string;
	#charWidth: number;
	#lineHeight: number;
	#theme: ITheme;
	#onData?: (data: string) => void;
	#onResize?: (cols: number, rows: number) => void;
	#dataDisposable?: { dispose(): void };
	/** Whether cols was explicitly provided (not auto-calculated). */
	#explicitCols: boolean;
	/** Whether rows was explicitly provided (not auto-calculated). */
	#explicitRows: boolean;

	constructor(opts: TerminalProps = {}) {
		const fontSize = opts.fontSize ?? 16;
		// For monospace fonts, character width is typically ~60% of font size.
		// Users can override with explicit width/height props.
		const charWidth = opts.charWidth ?? Math.ceil(fontSize * 0.6);
		const lineHeight = opts.lineHeight ?? Math.ceil(fontSize * 1.2);

		const explicitCols = opts.cols != null;
		const explicitRows = opts.rows != null;

		// When cols/rows are omitted, derive from width/height if provided,
		// otherwise fall back to sensible defaults.
		let cols: number;
		let rows: number;
		let width: number;
		let height: number;

		if (explicitCols) {
			cols = opts.cols!;
			width = opts.width ?? Math.ceil(cols * charWidth);
		} else if (opts.width != null) {
			width = opts.width;
			cols = Math.max(1, Math.floor(width / charWidth));
		} else {
			cols = 80;
			width = Math.ceil(cols * charWidth);
		}

		if (explicitRows) {
			rows = opts.rows!;
			height = opts.height ?? Math.ceil(rows * lineHeight);
		} else if (opts.height != null) {
			height = opts.height;
			rows = Math.max(1, Math.floor(height / lineHeight));
		} else {
			rows = 30;
			height = Math.ceil(rows * lineHeight);
		}

		super({ ...opts, width, height });

		this.#cols = cols;
		this.#rows = rows;
		this.#explicitCols = explicitCols;
		this.#explicitRows = explicitRows;
		this.#fontSize = fontSize;
		this.#fontFamily = opts.fontFamily ?? 'monospace';
		this.#charWidth = charWidth;
		this.#lineHeight = lineHeight;
		this.#theme = opts.theme ?? {};
		this.#onData = opts.onData;
		this.#onResize = opts.onResize;

		this.#term = new XTerminal({
			cols,
			rows,
			scrollback: opts.scrollback ?? 500,
			allowProposedApi: true,
		});

		// Forward data events
		if (this.#onData) {
			this.#dataDisposable = this.#term.onData(this.#onData);
		}

		// Queue re-render when buffer changes
		this.#term.onCursorMove(() => {
			this._root?.queueRender();
		});
		this.#term.onLineFeed(() => {
			this._root?.queueRender();
		});
		this.#term.onScroll(() => {
			this._root?.queueRender();
		});
	}

	/**
	 * Override width setter to auto-resize cols when cols is not explicitly set.
	 */
	override get width(): number {
		return super.width;
	}
	override set width(v: number) {
		super.width = v;
		if (!this.#explicitCols) {
			const newCols = Math.max(1, Math.floor(v / this.#charWidth));
			if (newCols !== this.#cols) {
				this.#cols = newCols;
				this.#term.resize(this.#cols, this.#rows);
				this.#onResize?.(this.#cols, this.#rows);
				this._root?.queueRender();
			}
		}
	}

	/**
	 * Override height setter to auto-resize rows when rows is not explicitly set.
	 */
	override get height(): number {
		return super.height;
	}
	override set height(v: number) {
		super.height = v;
		if (!this.#explicitRows) {
			const newRows = Math.max(1, Math.floor(v / this.#lineHeight));
			if (newRows !== this.#rows) {
				this.#rows = newRows;
				this.#term.resize(this.#cols, this.#rows);
				this.#onResize?.(this.#cols, this.#rows);
				this._root?.queueRender();
			}
		}
	}

	/** The underlying xterm.js Terminal instance. */
	get terminal(): XTerminalType {
		return this.#term;
	}

	/** Write data into the terminal. Returns a Promise that resolves when the data has been processed. */
	write(data: string): Promise<void> {
		return new Promise<void>((resolve) => {
			this.#term.write(data, () => {
				this._root?.queueRender();
				resolve();
			});
		});
	}

	#getCellColor(colorCode: number, isBold: boolean, isDefault: boolean): string {
		const fg = this.#theme.foreground ?? '#fff';

		if (isDefault || colorCode === -1) {
			return fg;
		}

		// Standard ANSI colors (0-15)
		if (colorCode >= 0 && colorCode <= 15) {
			// Bold shifts standard colors to bright
			if (isBold && colorCode < 8) {
				return ANSI_COLORS[colorCode + 8]!;
			}
			return ANSI_COLORS[colorCode]!;
		}

		// 256-color: 16-231 are a 6x6x6 color cube
		if (colorCode >= 16 && colorCode <= 231) {
			const c = colorCode - 16;
			const r = Math.floor(c / 36) * 51;
			const g = (Math.floor(c / 6) % 6) * 51;
			const b = (c % 6) * 51;
			return `rgb(${r},${g},${b})`;
		}

		// 256-color: 232-255 are grayscale
		if (colorCode >= 232 && colorCode <= 255) {
			const v = (colorCode - 232) * 10 + 8;
			return `rgb(${v},${v},${v})`;
		}

		return fg;
	}

	/** Update terminal props. */
	update(opts: Partial<TerminalProps>): void {
		if (opts.theme !== undefined) {
			this.#theme = opts.theme;
		}
		if (opts.fontSize !== undefined) {
			this.#fontSize = opts.fontSize;
			this.#charWidth = Math.ceil(opts.fontSize * 0.6);
			this.#lineHeight = Math.ceil(opts.fontSize * 1.2);
		}
		if (opts.fontFamily !== undefined) {
			this.#fontFamily = opts.fontFamily;
		}
		if (opts.onData !== undefined) {
			this.#dataDisposable?.dispose();
			this.#onData = opts.onData;
			if (opts.onData) {
				this.#dataDisposable = this.#term.onData(opts.onData);
			}
		}
		if (opts.onResize !== undefined) {
			this.#onResize = opts.onResize;
		}

		// Track whether cols/rows are explicitly provided
		this.#explicitCols = opts.cols != null;
		this.#explicitRows = opts.rows != null;

		// Handle explicit cols/rows resize
		if (this.#explicitCols || this.#explicitRows) {
			const newCols = opts.cols ?? this.#cols;
			const newRows = opts.rows ?? this.#rows;
			if (newCols !== this.#cols || newRows !== this.#rows) {
				this.#cols = newCols;
				this.#rows = newRows;
				this.#term.resize(newCols, newRows);
				this.#onResize?.(newCols, newRows);
			}
		}

		// Recalculate dimensions from cols/rows when they're explicit
		if (this.#explicitCols && !opts.width) {
			this.width = Math.ceil(this.#cols * this.#charWidth);
		}
		if (this.#explicitRows && !opts.height) {
			this.height = Math.ceil(this.#rows * this.#lineHeight);
		}

		this._root?.queueRender();
	}

	render(): void {
		super.render();
		const { ctx } = this.root;
		const buff = this.#term.buffer.active;
		const cell = buff.getNullCell();

		// Draw background
		ctx.fillStyle = this.#theme.background ?? '#000';
		ctx.fillRect(0, 0, this.width, this.height);

		// Draw each cell
		ctx.font = `${this.#fontSize}px "${this.#fontFamily}"`;
		ctx.textBaseline = 'top';

		for (let y = 0; y < this.#rows; y++) {
			const line = buff.getLine(buff.viewportY + y);
			if (!line) continue;
			for (let x = 0; x < line.length; x++) {
				line.getCell(x, cell);
				const char = cell.getChars();
				if (!char) continue;

				// Draw cell background if set
				const bgColor = cell.getBgColor();
				if (!cell.isBgDefault() && bgColor >= 0) {
					ctx.fillStyle = this.#getCellColor(bgColor, false, cell.isBgDefault());
					ctx.fillRect(
						x * this.#charWidth,
						y * this.#lineHeight,
						this.#charWidth,
						this.#lineHeight,
					);
				}

				// Draw character
				ctx.fillStyle = this.#getCellColor(
					cell.getFgColor(),
					cell.isBold() !== 0,
					cell.isFgDefault(),
				);
				ctx.font = cell.isBold()
					? `bold ${this.#fontSize}px "${this.#fontFamily}"`
					: `${this.#fontSize}px "${this.#fontFamily}"`;
				ctx.fillText(
					char,
					x * this.#charWidth,
					y * this.#lineHeight,
				);
			}
		}

		// Draw cursor
		const cursorX = buff.cursorX;
		const cursorY = buff.cursorY;
		ctx.fillStyle = this.#theme.cursor ?? '#fff';
		ctx.globalAlpha = 0.5;
		ctx.fillRect(
			cursorX * this.#charWidth,
			cursorY * this.#lineHeight,
			this.#charWidth,
			this.#lineHeight,
		);
		ctx.globalAlpha = this.alpha;
	}

	dispose(): void {
		this.#dataDisposable?.dispose();
		this.#term.dispose();
	}
}
