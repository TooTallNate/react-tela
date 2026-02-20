# react-tela

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
