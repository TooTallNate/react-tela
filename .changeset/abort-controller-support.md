---
"react-tela": minor
---

Add AbortController support for cancelling in-flight image loads. The `loadImage()` method on `Root` now accepts an optional `{ signal }` option. The `<Image>` component and `usePattern` hook automatically cancel pending loads on unmount or when the source changes.
