# @react-tela/flex

CSS Flexbox layout for [react-tela](https://github.com/TooTallNate/react-tela), powered by [Yoga](https://yogalayout.dev/) (via `yoga-wasm-web`).

## Overview

`@react-tela/flex` provides a `<Flex>` component that brings CSS Flexbox layout to the Canvas2D rendering pipeline. Nest react-tela entities inside `<Flex>` containers and they'll be positioned automatically using Yoga's layout engine.

## Usage

```tsx
import { render } from 'react-tela/render';
import { Rect, Text } from 'react-tela';
import { Flex } from '@react-tela/flex';

function App() {
  return (
    <Flex width={400} height={300} flexDirection="row" gap={10} padding={10}>
      <Rect width={100} height={100} fill="red" />
      <Rect width={100} height={100} fill="green" />
      <Rect width={100} height={100} fill="blue" />
    </Flex>
  );
}

render(<App />, canvas);
```

## Props

`<Flex>` accepts all standard react-tela entity props (`x`, `y`, `width`, `height`, `alpha`, `rotate`, etc.) plus Yoga Flexbox properties:

| Prop | Type | Description |
|------|------|-------------|
| `flexDirection` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'` | Main axis direction |
| `justifyContent` | `'flex-start' \| 'center' \| 'flex-end' \| 'space-between' \| 'space-around' \| 'space-evenly'` | Main axis alignment |
| `alignItems` | `'flex-start' \| 'center' \| 'flex-end' \| 'stretch'` | Cross axis alignment |
| `flexWrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse'` | Wrapping behavior |
| `gap` | `number` | Gap between items |
| `rowGap` | `number` | Gap between rows |
| `columnGap` | `number` | Gap between columns |
| `padding` | `number` | Padding on all sides |
| `paddingTop` | `number` | Top padding |
| `paddingBottom` | `number` | Bottom padding |
| `paddingLeft` | `number` | Left padding |
| `paddingRight` | `number` | Right padding |

Children can use `flexGrow`, `flexShrink`, `flexBasis`, and `alignSelf` via their layout props.

## Installation

```bash
npm install @react-tela/flex react-tela @react-tela/core
```

## Why a separate package?

The Yoga WASM binary (`yoga-wasm-web`) adds significant weight to the bundle. By keeping Flex in its own package, apps that don't need Flexbox layout avoid pulling in this dependency.

## License

MIT
