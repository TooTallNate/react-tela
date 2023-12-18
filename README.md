# react-tela
## Use React to render images, shapes and text to `<canavs>`.

> [!WARNING]
> This package is currently under development. Expect breaking changes.


### Example

```tsx
// App.jsx
import React from 'react';
import { Rect, Text } from 'react-tela';

export function App() {
    return (
        <>
            <Rect width={42} height={10} fill="red" />
            <Text fontSize={30} fill="blue">Hello world!</Text>
        </>
    );
}
```

#### In web browser

```tsx
import React from 'react';
import { render } from 'react-tela/render';
import { App } from './App';

render(<App />, document.getElementById('canvas'));
```

#### In Node.js

```tsx
import React from 'react';
import { render } from '@tootallnate/react-fabric/render';
import { createCanvas } from '@napi-rs/canvas';
import { App } from './App';

render(<App />, createCanvas(300, 320));
```
