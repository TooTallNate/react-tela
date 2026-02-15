export const DEFAULT_CODE = `import React from "react";
import { Rect, RoundRect, Circle, Text, useDimensions } from "react-tela";
import { createFlex } from "react-tela/flex";
import initYoga from "yoga-wasm-web/asm";

const yoga = initYoga();
const Flex = createFlex(yoga);

function Card({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children?: React.ReactNode;
}) {
  return (
    <Flex flexDirection="column">
      <RoundRect fill="#1e293b" radii={12} />
      {/* Color accent bar */}
      <Flex height={4}>
        <RoundRect fill={color} radii={[12, 12, 0, 0]} />
      </Flex>
      {/* Card content */}
      <Flex flex={1} padding={16} gap={12} flexDirection="column">
        <Flex height={20}>
          <Text fontSize={16} fill="white">
            {title}
          </Text>
        </Flex>
        <Flex height={1}>
          <Rect fill="#334155" />
        </Flex>
        <Flex flex={1} alignItems="center" justifyContent="center">
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}

function StatCircle({ value, color }: { value: string; color: string }) {
  return (
    <Flex flexDirection="column" alignItems="center" gap={8}>
      <Flex width={48} height={48}>
        <Circle fill={color} alpha={0.2} />
        <Circle fill={color} alpha={0.8} />
      </Flex>
      <Flex height={16}>
        <Text fontSize={12} fill="#94a3b8">
          {value}
        </Text>
      </Flex>
    </Flex>
  );
}

export default function App() {
  const dims = useDimensions();
  return (
    <Flex
      width={dims.width}
      height={dims.height}
      flexDirection="column"
      padding={24}
      gap={16}
    >
      {/* Background */}
      <Rect fill="#0f172a" />

      {/* Header */}
      <Flex height={48} justifyContent="center" flexDirection="column">
        <Flex height={28}>
          <Text fontSize={24} fill="white">
            react-tela Playground
          </Text>
        </Flex>
        <Flex height={16}>
          <Text fontSize={12} fill="#64748b">
            Edit the code on the left · Changes render live
          </Text>
        </Flex>
      </Flex>

      {/* Cards row */}
      <Flex flex={1} flexDirection="row" gap={16}>
        <Card title="Performance" color="#3b82f6">
          <Flex flexDirection="row" gap={16}>
            <StatCircle value="11.9k/s" color="#3b82f6" />
            <StatCircle value="0.08ms" color="#06b6d4" />
          </Flex>
        </Card>
        <Card title="Components" color="#10b981">
          <Flex flexDirection="row" gap={16}>
            <StatCircle value="9 built-in" color="#10b981" />
            <StatCircle value="4 hooks" color="#34d399" />
          </Flex>
        </Card>
        <Card title="Layout" color="#f59e0b">
          <Flex flexDirection="row" gap={16}>
            <StatCircle value="Flexbox" color="#f59e0b" />
            <StatCircle value="Yoga" color="#fbbf24" />
          </Flex>
        </Card>
      </Flex>

      {/* Footer bar */}
      <Flex height={40} flexDirection="row" alignItems="center" padding={12} gap={8}>
        <RoundRect fill="#1e293b" radii={8} />
        <Flex height={14}>
          <Text fontSize={11} fill="#64748b">
            Powered by react-tela · Flex layout by Yoga
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
`;
