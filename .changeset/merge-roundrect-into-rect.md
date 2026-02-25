---
'react-tela': minor
'@react-tela/core': minor
---

Merge `<RoundRect>` into `<Rect>` with a new `borderRadius` prop

When `borderRadius` is set on `<Rect>`, it renders with rounded corners via `ctx.roundRect()`. This replaces the separate `<RoundRect>` component (which used the `radii` prop).

`<RoundRect>` is kept as a deprecated re-export for backward compatibility.
