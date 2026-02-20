# @react-tela/terminal

A [react-tela](https://github.com/TooTallNate/react-tela) component that renders a terminal emulator on a Canvas2D surface using [xterm.js](https://xtermjs.org/) (headless).

## Features

- 🖥️ Full terminal emulation via `@xterm/headless`
- 🎨 ANSI 256-color support
- ✨ Inherits all react-tela entity props: `alpha`, `rotate`, `scaleX/Y`, `shadow`, `filter`, `blendMode`
- 📐 Auto-calculates `cols`/`rows` from dimensions, or set them explicitly
- 🔄 Dynamic resizing — adapts when width/height change (e.g. inside `<Flex>`)
- ⌨️ Async `write()` that resolves when xterm has processed the data

## Usage

```tsx
import { render } from 'react-tela/render';
import { Terminal } from '@react-tela/terminal';

function App() {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.write('Hello, terminal! 🖥️\r\n');
    ref.current?.write('\x1b[32mGreen text\x1b[0m\r\n');
  }, []);

  return (
    <Terminal
      ref={ref}
      cols={80}
      rows={24}
      fontSize={16}
      fontFamily="Geist Mono"
      theme={{ background: '#1e1e1e', foreground: '#d4d4d4' }}
    />
  );
}

render(<App />, canvas);
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `number` | Auto from width | Number of columns |
| `rows` | `number` | Auto from height | Number of rows |
| `fontSize` | `number` | `16` | Font size in pixels |
| `fontFamily` | `string` | `"monospace"` | Font family |
| `charWidth` | `number` | Auto | Character width in pixels |
| `lineHeight` | `number` | Auto | Line height in pixels |
| `theme` | `ITheme` | `{}` | xterm.js theme object |
| `scrollback` | `number` | `500` | Scrollback buffer size |
| `onData` | `(data: string) => void` | — | Terminal output data callback |
| `onResize` | `(cols: number, rows: number) => void` | — | Resize callback |

Plus all standard [react-tela entity props](https://github.com/TooTallNate/react-tela) (`x`, `y`, `width`, `height`, `alpha`, `rotate`, etc.).

## Ref Methods

Access the terminal entity via `ref`:

```tsx
const ref = useRef<TerminalEntity>(null);

// Write data (async — resolves when processed)
await ref.current.write('Hello\r\n');

// Access the underlying xterm.js instance
ref.current.terminal.scrollToBottom();
```

## Installation

```bash
npm install @react-tela/terminal react-tela
```

## License

MIT
