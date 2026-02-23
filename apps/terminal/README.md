# Terminal Demo

A demo app showcasing `@react-tela/terminal` rendered on a react-tela canvas with a perspective-like transformation — as if viewing a terminal screen mounted on a wall at an angle.

## What it does

1. Creates a react-tela canvas
2. Renders a `<Terminal>` component with rotation, scale, and shadow transforms
3. Spawns a real shell session via `node-pty`
4. Pipes shell I/O through the terminal component
5. Saves the result as `output.png`

## Usage

```bash
pnpm install
pnpm start
```

The rendered terminal snapshot will be saved to `output.png`.

## Prerequisites

- Node.js 18+
- A C/C++ toolchain for `node-pty` native compilation (build-essential on Linux, Xcode CLI tools on macOS)
