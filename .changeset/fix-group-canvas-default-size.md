---
'@react-tela/core': patch
'react-tela': patch
---

Remove implicit 300x150 default canvas size for `<Group>` component. The backing canvas now uses the exact dimensions specified by `width`/`height` (or `contentWidth`/`contentHeight`), instead of falling back to the HTML canvas default when dimensions are 0. Use `typeof === 'number'` checks for viewport mode detection instead of truthiness checks.
