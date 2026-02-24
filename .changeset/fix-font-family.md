---
"@react-tela/core": patch
"react-tela": patch
---

Fix `fontFamily` prop to support comma-delimited font lists and arrays. Previously, the entire `fontFamily` value was wrapped in quotes, breaking CSS font fallback syntax. Now a string with commas is passed through as-is, a single name is only quoted when it contains spaces, and an array of names is joined with each entry individually quoted as needed.
