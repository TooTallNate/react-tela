# @react-tela/core

The rendering engine behind [react-tela](https://github.com/TooTallNate/react-tela) — a pure Canvas2D scene graph with **zero React dependency**.

## Overview

`@react-tela/core` provides the entity classes, event system, and rendering pipeline that power react-tela. It can be used standalone for imperative Canvas2D rendering, or as the foundation for framework-specific bindings.

## Entity Classes

| Entity | Description |
|--------|-------------|
| `Rect` | Rectangle |
| `RoundRect` | Rounded rectangle |
| `Arc` | Arc / circle |
| `Ellipse` | Ellipse |
| `Path` | SVG path |
| `Line` | Line segment |
| `BezierCurve` | Cubic bézier curve |
| `QuadraticCurve` | Quadratic bézier curve |
| `Text` | Text with overflow, multiline, and alignment |
| `Image` | Async image loading and rendering |
| `Group` | Container for grouping entities |
| `Canvas` | Nested offscreen canvas |
| `Pattern` | Repeating pattern fill |

All entities support common props: `x`, `y`, `width`, `height`, `alpha`, `rotate`, `scaleX`, `scaleY`, `shadowColor`, `shadowBlur`, `filter`, `blendMode`, and pointer events.

## Usage

```ts
import { Root, Rect, Text } from '@react-tela/core';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const root = new Root(ctx);

const rect = new Rect({ x: 10, y: 10, width: 100, height: 60, fill: 'blue' });
root.add(rect);

const text = new Text({ x: 20, y: 30, text: 'Hello!', fill: 'white', fontSize: 16 });
root.add(text);

// Rendering happens automatically via queueRender()
```

## Installation

```bash
npm install @react-tela/core
```

Most users should install `react-tela` instead, which includes this package and adds React bindings.

## License

MIT
