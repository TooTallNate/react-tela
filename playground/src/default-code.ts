export const DEFAULT_CODE = `import React, { useState } from "react";
import {
  Rect,
  RoundRect,
  Circle,
  Text,
  Group,
  useDimensions,
} from "react-tela";

function Card({
  x,
  y,
  width,
  height,
  title,
  color,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  color: string;
}) {
  return (
    <Group x={x} y={y} width={width} height={height}>
      <RoundRect fill="#1e293b" radii={12} />
      <RoundRect
        x={0}
        y={0}
        width={width}
        height={6}
        fill={color}
        radii={[12, 12, 0, 0]}
      />
      <Text x={16} y={24} fontSize={18} fill="white">
        {title}
      </Text>
      <Rect x={16} y={52} width={width - 32} height={1} fill="#334155" />
      <Circle x={width / 2 - 20} y={80} radius={24} fill={color} alpha={0.3} />
      <Circle x={width / 2 - 20} y={80} radius={16} fill={color} alpha={0.6} />
    </Group>
  );
}

export default function App() {
  const dims = useDimensions();
  return (
    <>
      <Rect width={dims.width} height={dims.height} fill="#0f172a" />
      <Text x={24} y={20} fontSize={28} fill="white">
        react-tela Playground
      </Text>
      <Text x={24} y={52} fontSize={14} fill="#94a3b8">
        Edit the code on the left to see changes live →
      </Text>
      <Card x={24} y={90} width={200} height={140} title="Component A" color="#3b82f6" />
      <Card x={240} y={90} width={200} height={140} title="Component B" color="#10b981" />
      <Card x={456} y={90} width={200} height={140} title="Component C" color="#f59e0b" />
      <Card x={24} y={250} width={632} height={100} title="Full Width" color="#8b5cf6" />
    </>
  );
}
`;
