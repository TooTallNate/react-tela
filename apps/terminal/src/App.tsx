import React, { useRef, useEffect, useState, useCallback } from 'react';
import { render } from 'react-tela/render';
import { Terminal, TerminalEntity } from '@react-tela/terminal';

// Terminal settings
const FONT_SIZE = 32;

/**
 * Inner react-tela scene rendered onto the canvas.
 * The terminal is positioned with rotation and scale to simulate
 * viewing a screen mounted on a wall at an angle.
 */
function Scene({
  onReady,
  canvasWidth,
  canvasHeight,
}: {
  onReady: (entity: TerminalEntity) => void;
  canvasWidth: number;
  canvasHeight: number;
}) {
  const termRef = useRef<TerminalEntity>(null);

  useEffect(() => {
    if (termRef.current) {
      onReady(termRef.current);
    }
  }, []);

  return (
    <Terminal
      ref={termRef}
      width={canvasWidth}
      height={canvasHeight}
      fontFamily="Geist Mono"
      fontSize={FONT_SIZE * (window.devicePixelRatio || 1)}
    />
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
          '  \x1b[33mmatrix\x1b[0m        Display a matrix-style effect\r\n',
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
      default:
        await this.#entity.write(
          `\x1b[31mcommand not found: ${command}\x1b[0m\r\n`,
        );
    }
  }
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<any>(null);
  const shellRef = useRef<LocalShell | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 700 });
  const [focused, setFocused] = useState(false);

  // Resize canvas to fill container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({
          width: Math.floor(width),
          height: Math.floor(height),
        });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleReady = useCallback((entity: TerminalEntity) => {
    const shell = new LocalShell(entity);
    shellRef.current = shell;
    shell.start();
  }, []);

  // Render react-tela scene to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;

    if (rootRef.current) {
      rootRef.current.clear();
    }

    rootRef.current = render(
      <Scene
        onReady={handleReady}
        canvasWidth={canvas.width}
        canvasHeight={canvas.height}
      />,
      canvas,
    );
  }, [canvasSize, handleReady]);

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!shellRef.current) return;

      // Prevent default for keys we handle
      e.preventDefault();

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
        shellRef.current.handleInput(data);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => containerRef.current?.focus()}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#1a252f',
        cursor: 'text',
        outline: 'none',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      {!focused && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 14,
            fontFamily: 'monospace',
            pointerEvents: 'none',
          }}
        >
          Click to focus and start typing
        </div>
      )}
    </div>
  );
}
