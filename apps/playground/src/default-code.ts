export const DEFAULT_CODE = `import React, { useRef, useEffect, useState } from "react";
import { Group, Rect, RoundRect, Text, useDimensions } from "react-tela";
import { Terminal, TerminalEntity } from "@react-tela/terminal";

// ─── Theme ───

const t = {
  bg: "#0a0e1a",
  surface: "#111827",
  border: "#374151",
  accent: "#6366f1",
  text: "#f9fafb",
  textDim: "#9ca3af",
  green: "#10b981",
};

export default function App() {
  const dims = useDimensions();
  const termRef = useRef<TerminalEntity>(null);
  const [focused, setFocused] = useState(false);

  // Write a welcome message on mount
  useEffect(() => {
    const term = termRef.current;
    if (!term) return;
    term.write("\\x1b[1;32mreact-tela terminal\\x1b[0m\\r\\n");
    term.write("Click the canvas to focus, then type!\\r\\n\\r\\n");
    term.write("\\x1b[36m$\\x1b[0m ");
  }, []);

  // Make canvas focusable and track focus/blur
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    // Make the canvas focusable
    canvas.tabIndex = 0;
    canvas.style.outline = "none";

    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    canvas.addEventListener("focus", onFocus);
    canvas.addEventListener("blur", onBlur);
    return () => {
      canvas.removeEventListener("focus", onFocus);
      canvas.removeEventListener("blur", onBlur);
    };
  }, []);

  // Forward keyboard events to terminal when focused
  useEffect(() => {
    if (!focused) return;
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const term = termRef.current;
      if (!term) return;

      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;
      e.preventDefault();

      if (e.key === "Enter") {
        term.write("\\r\\n\\x1b[36m$\\x1b[0m ");
      } else if (e.key === "Backspace") {
        term.write("\\b \\b");
      } else if (e.key === "Tab") {
        term.write("    ");
      } else if (e.key.length === 1) {
        if (e.ctrlKey) {
          if (e.key === "c") {
            term.write("^C\\r\\n\\x1b[36m$\\x1b[0m ");
          } else if (e.key === "l") {
            term.write("\\x1b[2J\\x1b[H\\x1b[36m$\\x1b[0m ");
          }
        } else {
          term.write(e.key);
        }
      }
    };

    canvas.addEventListener("keydown", handleKeyDown);
    return () => canvas.removeEventListener("keydown", handleKeyDown);
  }, [focused]);

  const padding = 20;
  const headerH = 44;

  return (
    <Group width={dims.width} height={dims.height}>
      {/* Background */}
      <Rect width={dims.width} height={dims.height} fill={t.bg} />

      {/* Header */}
      <RoundRect
        x={padding}
        y={padding}
        width={dims.width - padding * 2}
        height={headerH}
        fill={t.surface}
        radii={[10, 10, 0, 0]}
      />
      <Text
        x={padding + 16}
        y={padding + 12}
        fontSize={16}
        fill={t.text}
      >
        🖥️ Terminal Demo
      </Text>
      <Text
        x={dims.width - padding - 120}
        y={padding + 14}
        fontSize={12}
        fill={focused ? t.green : t.textDim}
      >
        {focused ? "● focused" : "○ unfocused"}
      </Text>

      {/* Terminal */}
      <Terminal
        ref={termRef}
        x={padding}
        y={padding + headerH}
        width={dims.width - padding * 2}
        height={dims.height - padding * 2 - headerH}
        fontSize={32}
        fontFamily={"'Geist Mono', monospace"}
        theme={{
          background: "#111827",
          foreground: "#f9fafb",
          cursor: "#6366f1",
          cursorAccent: "#111827",
        }}
      />
    </Group>
  );
}
`;
