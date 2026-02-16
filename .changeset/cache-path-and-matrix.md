---
"react-tela": patch
---

Cache `Path2D` and `DOMMatrix` objects with dirty-flag tracking to avoid allocating new objects on every render. Re-renders improved 1.2×–2.7× depending on entity count.
