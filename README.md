# react-tela

Use React to render images, shapes, and text to `<canvas>`.

This is a monorepo containing the core renderer and supporting packages.

## Packages

| Package | Description |
|---------|-------------|
| [`react-tela`](./packages/react-tela) | The core React renderer for canvas |
| [`@react-tela/core`](./packages/core) | Pure Canvas2D scene graph engine (zero React dependency) |
| [`@react-tela/flex`](./packages/flex) | CSS Flexbox layout powered by Yoga |
| [`@react-tela/terminal`](./packages/terminal) | Terminal emulator component using xterm.js |

## Apps

| App | Description | |
|-----|-------------|---|
| [`playground`](./apps/playground) | Interactive playground for experimenting with react-tela | [Live](https://react-tela-playground.n8.io) |
| [`terminal`](./apps/terminal) | Terminal demo app | [Live](https://react-tela-terminal-demo.n8.io) |

## License

MIT
