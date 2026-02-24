# AGENTS.md — react-tela

Guide for AI agents contributing to this repo.

## What is react-tela?

A **React renderer for Canvas 2D**. Write React components, get canvas drawings. Works in browsers, Node.js, and nx.js (Nintendo Switch homebrew runtime).

"Tela" means "canvas/screen" in Portuguese.

## Repo Structure

This is a **monorepo** (pnpm workspaces + turborepo):

```
packages/
  core/            — @react-tela/core: headless canvas entity system (no React dep)
    src/
      entity.ts    — Base Entity class (all drawable things extend this)
      shape.ts     — Base Shape class (extends Entity, adds fill/stroke)
      rect.ts, arc.ts, ellipse.ts, line.ts, path.ts, etc.
      text.ts      — <Text> with multiline, letter/word spacing
      image.ts     — <Image>
      pattern.ts   — <Pattern>
      group.ts     — <Group> (transform container)
      root.ts      — Root rendering logic
      bezier-curve.ts, quadratic-curve.ts — curve components
  react-tela/      — react-tela: React renderer (depends on @react-tela/core)
    src/
      index.tsx    — Exports everything, registers components
      render.ts    — React reconciler setup (react-reconciler)
      flex.tsx     — <Flex> (Yoga layout engine)
      hooks/       — useDimensions, useGradient, useLayout, useParent, usePattern, useTextMetrics
      test.tsx     — Test/snapshot utilities
    test/          — Vitest snapshot tests
    scripts/       — benchmark, readme asset generation
    assets/        — Generated example PNGs for README
apps/
  playground/      — Interactive playground (Monaco editor, deployed via Vercel)
```

## Architecture

### Entity System

Everything drawable extends `Entity`:
```
Entity (base: x, y, opacity, filters, blendMode, shadow*, transforms)
  └─ Shape (adds: fill, stroke, lineWidth, lineCap, lineJoin, etc.)
       └─ Rect, RoundRect, Arc, Ellipse, Line, Path
  └─ Text (text rendering with font, textAlign, textBaseline, multiline)
  └─ Image (drawImage wrapper)
  └─ Canvas (offscreen canvas)
  └─ Group (transform container, no drawing of its own)
  └─ Flex (Yoga-based flexbox layout)
```

### Rendering Pipeline

1. React reconciler manages component tree
2. Each entity has a `draw(ctx)` method
3. Root traverses tree, calling `draw()` on each entity
4. Entities apply their transforms, filters, globalAlpha, etc. via `preDraw()`/`postDraw()`
5. `requestAnimationFrame` drives the render loop

### Key Patterns

**Props → Entity properties:**
Components receive props and map them onto Entity instances in the reconciler's `commitUpdate`. Check `render.ts` for how props are applied.

**Private fields:**
Entity state uses ES private class fields (`#field`), with dirty-flag caching for computed values like matrices:
```typescript
#x: number;
#matrixDirty = true;
#cachedMatrix: IDOMMatrix | null = null;
```

**Hooks:**
- `useDimensions()` — get root canvas dimensions
- `useGradient(type, coords, stops)` — create linear/radial/conic gradients
- `useLayout()` — access layout context (dimensions + DPR)
- `useParent()` — get the parent entity
- `usePattern(image, repetition)` — create a canvas pattern
- `useTextMetrics(text, font)` — measure text

## Tech Stack

- **TypeScript** with `moduleResolution: "NodeNext"`
- **pnpm 10.x** (see `packageManager` in package.json)
- **Vitest** for testing
- **Changesets** for versioning
- **Yoga** (via `yoga-layout`) for flexbox in `<Flex>`

## Testing

```bash
pnpm test          # Run vitest (in packages/react-tela)
pnpm test:update   # Update snapshots
```

Tests use a canvas mock/polyfill. Snapshot tests compare rendered output. Tests also run in **strict mode** (duplicate renders) automatically.

The `packages/react-tela/src/test.tsx` module exports utilities for rendering components in tests.

## Building

```bash
pnpm build         # TypeScript compilation (turborepo builds core first, then react-tela)
```

- `@react-tela/core` → `packages/core/dist/`
- `react-tela` → `packages/react-tela/dist/`

## Versioning & Changesets

Standard semver. Create changesets with:
```bash
pnpm changeset
```

Or manually in `.changeset/`:
```markdown
---
"react-tela": minor
---

feat: description
```

## Examples

Scripts in `examples/` render components to PNG files:
```bash
pnpm example:rect   # (or whatever scripts exist)
```

These are used to generate images for the README.

## Playground

The `playground/` directory is a Vite app with Monaco editor. Users can write react-tela code and see live canvas output. Deployed via Vercel.

## Git Workflow

- Branch from `main`
- PRs reviewed by @TooTallNate
- CI runs tests on ubuntu, macos, windows (all must pass)
- **Use `git worktree`** for parallel branches — don't share working directories

## Common Pitfalls

- `pnpm install` hangs in non-interactive shells → use `pnpm install < /dev/null`
- Canvas API differences between browsers/Node/nx.js — test broadly
- `<Flex>` requires `yoga-layout` as a peer dep (it's optional)
- Don't use markdown tables in Discord/WhatsApp when discussing — use bullet lists
