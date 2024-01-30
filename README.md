# react-tela

### Use React to render images, shapes and text to `<canvas>`

> [!WARNING]
> This package is currently under development. Expect breaking changes.

`react-tela` is a React renderer that draws components to a `<canvas>` node.

### Features

-   **Low-level**
    -   The base components expose only the main Canvas primitives (images, shapes and text)
    -   Leverage the power of React to create high-level abstractions over the base components
-   **Unopinionated about runtime environment**
    -   Works in web browsers, Node.js, but was specifically created for [nx.js](https://github.com/TooTallNate/nx.js)
    -   Never makes assumptions about anything "outside" of the provided canvas node

## Example

```tsx
// App.jsx
import React from "react";
import { Group, Rect, Text } from "react-tela";

export function App() {
	return (
		<Group x={5} y={15} width={180} height={30} rotate={0.1}>
			<Rect width="100%" height="100%" fill="purple" alpha={0.5} />
			<Text fontSize={32} fontFamily="Geist" fill="white">
				Hello world!
			</Text>
		</Group>
	);
}
```

![](./assets/example.png)

### In web browser

```tsx
import React from "react";
import { render } from "react-tela/render";
import { App } from "./App";

render(<App />, document.getElementById("canvas"));
```

### In nx.js

```tsx
import React from "react";
import { render } from "react-tela/render";
import { App } from "./App";

render(<App />, screen);
```

### In Node.js

```tsx
import React from "react";
import { render } from "react-tela/render";
import { DOMMatrix, Image, Path2D, createCanvas } from "@napi-rs/canvas";
import { App } from "./App";

const canvas = createCanvas(300, 150);
await render(<App />, canvas, {
	Image,
	Path2D,
	DOMMatrix,
});

const buffer = canvas.toBuffer("image/png");
// … do something with PNG `buffer`
```

## What is "tela"? 🇧🇷

The word "tela" is the Portuguese word for "canvas" or "screen".

> **tela** > [ˈtɛla] (feminine noun)
>
> 1. (_de pintar_) canvas
> 2. (_cinema_, _telecommunications_) screen

Since the name `react-canvas` was already taken, using `react-tela` was a fun alternative.

## Prior Art

A few other React renderes for `<canvas>` alreay exist, so why another?

`react-tela` is designed to make as little assumptions about the runtime environment as possible. Others renderers assume they are running in a web browser, or possibly Node.js. This module only interacts with the canvas node it is provided, and never makes any assumptions about anything "outside" of the node.

-   [`react-art`](https://www.npmjs.com/package/react-art)
    -   Nice because it would appear to be an official solution. The code is located in the react monorepo itself.
    -   However documentation and examples are basically non-existent, and this does not seem to be actively maintained.
-   [`react-canvas`](https://www.npmjs.com/package/react-canvas)
    -   Perfect name. Nice API. Probably one of the original React `<canvas>` implementations.
    -   Has not been updated in years, and is not currently maintained.
-   [`react-konva`](https://www.npmjs.com/package/react-konva)
    -   Awesome and very mature. Would love to have just been able to use this.
    -   It relies on `react-dom`, which is pretty large, and makes the assumption that a DOM is actually available.
