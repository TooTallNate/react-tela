# react-tela

## 1.0.1

### Patch Changes

- 8e1fff2: Remove implicit 300x150 default canvas size for `<Group>` component. The backing canvas now uses the exact dimensions specified by `width`/`height` (or `contentWidth`/`contentHeight`), instead of falling back to the HTML canvas default when dimensions are 0. Use `typeof === 'number'` checks for viewport mode detection instead of truthiness checks.
- Updated dependencies [8e1fff2]
  - @react-tela/core@1.0.1

## 1.0.0

### Major Changes

- f0ab0e7: Promote to v1.0.0 stable release

### Minor Changes

- 977098e: Add `borderRadius` prop to `<Group>` component for rounded-corner clipping of composited group output
- e36b342: Merge `<RoundRect>` into `<Rect>` with a new `borderRadius` prop

  When `borderRadius` is set on `<Rect>`, it renders with rounded corners via `ctx.roundRect()`. The separate `<RoundRect>` component has been removed.

### Patch Changes

- 4e23599: Add viewport/scroll behavior to `<Group>` component with `contentWidth`, `contentHeight`, `scrollTop`, and `scrollLeft` props for scrollable content areas
- Updated dependencies [977098e]
- Updated dependencies [4e23599]
- Updated dependencies [e36b342]
  - @react-tela/core@1.0.0

## 0.3.0

### Minor Changes

- f0aa216: Add AbortController support for cancelling in-flight image loads. The `loadImage()` method on `Root` now accepts an optional `{ signal }` option. The `<Image>` component and `usePattern` hook automatically cancel pending loads on unmount or when the source changes.
- f5ff7e0: Convert to monorepo and extract `@react-tela/core` engine package
- 56afeb6: Move Flex component to dedicated @react-tela/flex package

  The Flex component and its yoga-wasm-web dependency have been moved to
  `@react-tela/flex`. Import from `@react-tela/flex` instead of `react-tela/flex`.

### Patch Changes

- 3682863: Fix `fontFamily` prop to support comma-delimited font lists and arrays. Previously, the entire `fontFamily` value was wrapped in quotes, breaking CSS font fallback syntax. Now a string with commas is passed through as-is, a single name is only quoted when it contains spaces, and an array of names is joined with each entry individually quoted as needed.
- 6d4b507: Fix React StrictMode compatibility for Flex components and add StrictMode test coverage across all tests
- Updated dependencies [3682863]
- Updated dependencies [f5ff7e0]
  - @react-tela/core@0.3.0

## 0.2.0

### Minor Changes

- 82837d2: Add `blendMode` prop to all entities, mapping to `ctx.globalCompositeOperation`
- aa5478b: Add `<BezierCurve>` and `<QuadraticCurve>` components for drawing cubic and quadratic Bézier curves
- 5991c24: Add `<Ellipse>` component with separate radiusX/radiusY
- 6bf6b7b: Add `filter` prop to all entities, mapping to `CanvasRenderingContext2D.filter` for CSS filter effects like `blur()`, `brightness()`, `drop-shadow()`, and more.
- ee1d1fa: Add gradient support for `fill` and `stroke` props via `useLinearGradient()`, `useRadialGradient()`, and `useConicGradient()` hooks
- 875779d: Add `<Line>` component for drawing lines and polylines
- 32bad9d: Add multiline text support to `<Text>` with word wrapping, ellipsis truncation, and clipping. New props: `maxWidth`, `lineHeight`, and `overflow`.
- 9dc56b4: Add `<Pattern>` component for creating repeating pattern fills and strokes, and `usePattern()` hook for image URL-based patterns
- 2fc8c53: Add shadow props (shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY) to all entities
- e622b19: Add advanced text properties to `<Text>`: `letterSpacing`, `wordSpacing`, `direction`, `fontKerning`, `fontStretch`, and `fontVariantCaps`
- 4cf9cb3: Add `imageSmoothing` and `imageSmoothingQuality` props to `<Image>` component for controlling image interpolation when scaling. Useful for pixel art or crisp rendering.

### Patch Changes

- dc207d5: Cache `Path2D` and `DOMMatrix` objects with dirty-flag tracking to avoid allocating new objects on every render. Re-renders improved 1.2×–2.7× depending on entity count.
- 1c529d4: Add comprehensive JSDoc comments to all exported APIs

## 0.1.0

### Minor Changes

- 2ea4afd: Add `<Flex>` component with Yoga layout engine integration

  New `createFlex(yoga)` factory exported from `react-tela/flex` that provides CSS Flexbox-like layout powered by `yoga-wasm-web`. Supports flexDirection, justifyContent, alignItems, alignSelf, flexWrap, flex/flexGrow/flexShrink/flexBasis, gap, margin, padding (all + per-edge), percentage dimensions, min/max dimensions, absolute positioning, overflow, aspectRatio, and a `Flex.Text` subcomponent for measured text within flex layouts.

### Patch Changes

- 825e560: Fix Canvas component sub-canvas not resizing when width/height props change
- 26f54c9: Optimize layout context fast path: skip object allocations when no Flex layout is active
