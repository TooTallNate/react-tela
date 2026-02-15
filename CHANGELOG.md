# react-tela

## 0.1.0

### Minor Changes

- 2ea4afd: Add `<Flex>` component with Yoga layout engine integration

  New `createFlex(yoga)` factory exported from `react-tela/flex` that provides CSS Flexbox-like layout powered by `yoga-wasm-web`. Supports flexDirection, justifyContent, alignItems, alignSelf, flexWrap, flex/flexGrow/flexShrink/flexBasis, gap, margin, padding (all + per-edge), percentage dimensions, min/max dimensions, absolute positioning, overflow, aspectRatio, and a `Flex.Text` subcomponent for measured text within flex layouts.

### Patch Changes

- 825e560: Fix Canvas component sub-canvas not resizing when width/height props change
- 26f54c9: Optimize layout context fast path: skip object allocations when no Flex layout is active
