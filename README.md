# react-tela

### Use React to render images, shapes and text to `<canavs>`

> [!WARNING]
> This package is currently under development. Expect breaking changes.

`react-tela` is a React renderer that draws components to a `<canvas>` node.
It is designed to be low-level and unopinionated so that more high-level React
components can be written on top.

## Example

```tsx
// App.jsx
import React from "react";
import { Rect, Text } from "react-tela";

export function App() {
	return (
		<>
			<Rect width={42} height={10} fill="red" />
			<Text fontSize={30} fill="blue">
				Hello world!
			</Text>
		</>
	);
}
```

### In web browser

```tsx
import React from "react";
import { render } from "react-tela/render";
import { App } from "./App";

render(<App />, document.getElementById("canvas"));
```

### In Node.js

```tsx
import React from "react";
import { render } from "@tootallnate/react-fabric/render";
import { createCanvas } from "@napi-rs/canvas";
import { App } from "./App";

render(<App />, createCanvas(300, 320));
```

## What is "tela"?

The word "tela" is the Portuguese word for "canvas" or "screen".

> **tela** > [ˈtɛla ] > **feminine noun**
>
> 1. (_de pintar_) canvas
> 2. (_cinema_, _telecommunications_) screen

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
    -   It relies on `react-dom`, which is pretty large, and
