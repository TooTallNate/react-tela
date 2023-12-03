react-fabric
============

React renderer for fabric.js

Write React code to render shapes and images to a HTML `<canvas>` element.

### Example

```tsx
// App.tsx
import React from 'react';
import { Canvas, Rect, Text } from '@tootallnate/react-fabric';

export function App() {
    return (
        <Canvas>
            <Rect width={42} height={10} fill="red" />
            <Text fontSize={30} fill="blue">Hello world!</Text>
        </Canvas>
    );
}
```

#### In web browser

```tsx
import React from 'react';
import { fabric } from 'fabric';
import { render } from '@tootallnate/react-fabric/render';
import { App } from './App';

render(<App />, document.getElementById('canvas'), fabric);
```

#### In Node.js

```tsx
import React from 'react';
import { fabric } from 'fabric';
import { render } from '@tootallnate/react-fabric/render';
import { createCanvas } from '@napi-rs/canvas';
import { App } from './App';

render(<App />, createCanvas(300, 320), fabric);
```
