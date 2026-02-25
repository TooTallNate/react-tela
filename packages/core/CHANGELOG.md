# @react-tela/core

## 1.0.0

### Minor Changes

- 977098e: Add `borderRadius` prop to `<Group>` component for rounded-corner clipping of composited group output
- e36b342: Merge `<RoundRect>` into `<Rect>` with a new `borderRadius` prop

  When `borderRadius` is set on `<Rect>`, it renders with rounded corners via `ctx.roundRect()`. The separate `<RoundRect>` component has been removed.

### Patch Changes

- 4e23599: Add viewport/scroll behavior to `<Group>` component with `contentWidth`, `contentHeight`, `scrollTop`, and `scrollLeft` props for scrollable content areas

## 0.3.0

### Minor Changes

- f5ff7e0: Initial release

### Patch Changes

- 3682863: Fix `fontFamily` prop to support comma-delimited font lists and arrays. Previously, the entire `fontFamily` value was wrapped in quotes, breaking CSS font fallback syntax. Now a string with commas is passed through as-is, a single name is only quoted when it contains spaces, and an array of names is joined with each entry individually quoted as needed.
