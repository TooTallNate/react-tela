export const DEFAULT_CODE = `import React, { useState } from "react";
import {
  Rect,
  RoundRect,
  Circle,
  Text,
  useDimensions,
} from "react-tela";
import { createFlex } from "react-tela/flex";
import initYoga from "yoga-wasm-web/asm";

const yoga = initYoga();
const Flex = createFlex(yoga);

// ─── Theme ───

const t = {
  bg: "#0a0e1a",
  surface: "#111827",
  border: "#374151",
  accent: "#6366f1",
  accentHover: "#818cf8",
  green: "#10b981",
  red: "#ef4444",
  amber: "#f59e0b",
  cyan: "#06b6d4",
  text: "#f9fafb",
  textDim: "#9ca3af",
  textMuted: "#6b7280",
};

// ─── Interactive Button ───

function Button({
  label,
  color = t.accent,
  onPress,
}: {
  label: string;
  color?: string;
  onPress?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <Flex height={40} paddingLeft={20} paddingRight={20} alignItems="center" justifyContent="center">
      <RoundRect
        fill={pressed ? color : hovered ? color : color}
        alpha={pressed ? 1 : hovered ? 0.85 : 0.65}
        radii={8}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onClick={() => onPress?.()}
      />
      <Text
        fontSize={15}
        fill="white"
        pointerEvents={false}
      >
        {label}
      </Text>
    </Flex>
  );
}

// ─── Stat Card (clickable) ───

function StatCard({
  title,
  value,
  color,
  selected,
  onSelect,
}: {
  title: string;
  value: string;
  color: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Flex flex={1} flexDirection="column" padding={20} gap={10}>
      <RoundRect
        fill={t.surface}
        alpha={hovered ? 0.9 : 1}
        radii={14}
        stroke={selected ? color : "transparent"}
        lineWidth={2}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onSelect?.()}
      />
      {/* Accent bar */}
      <Flex height={4}>
        <RoundRect fill={color} alpha={selected ? 1 : 0.5} radii={2} />
      </Flex>
      <Flex height={20}>
        <Text fontSize={14} fill={t.textMuted}>
          {title}
        </Text>
      </Flex>
      <Flex height={44}>
        <Text fontSize={36} fill={t.text}>
          {value}
        </Text>
      </Flex>
    </Flex>
  );
}

// ─── Bar Chart ───

function BarChart({ highlight }: { highlight: string }) {
  const data = [
    { label: "Jan", val: 65 },
    { label: "Feb", val: 40 },
    { label: "Mar", val: 85 },
    { label: "Apr", val: 55 },
    { label: "May", val: 70 },
    { label: "Jun", val: 90 },
    { label: "Jul", val: 45 },
    { label: "Aug", val: 75 },
    { label: "Sep", val: 60 },
    { label: "Oct", val: 80 },
    { label: "Nov", val: 50 },
    { label: "Dec", val: 95 },
  ];

  return (
    <Flex flex={1} flexDirection="column" padding={20} gap={14}>
      <RoundRect fill={t.surface} radii={14} />
      <Flex height={24}>
        <Text fontSize={18} fill={t.text}>
          Monthly Revenue
        </Text>
      </Flex>
      <Flex flex={1} flexDirection="row" alignItems="flex-end" justifyContent="space-around" paddingBottom={24}>
        {data.map((d, i) => (
          <Bar
            key={i}
            label={d.label}
            value={d.val}
            color={highlight}
            maxVal={100}
          />
        ))}
      </Flex>
    </Flex>
  );
}

function Bar({
  label,
  value,
  color,
  maxVal,
}: {
  label: string;
  value: number;
  color: string;
  maxVal: number;
}) {
  const [hovered, setHovered] = useState(false);
  const h = (value / maxVal) * 140;

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="flex-end" gap={6}>
      {/* Tooltip on hover */}
      {hovered && (
        <Flex height={20}>
          <Text fontSize={13} fill={t.text}>
            \${value}k
          </Text>
        </Flex>
      )}
      <Flex width={24} height={h}>
        <RoundRect
          fill={color}
          alpha={hovered ? 1 : 0.55}
          radii={[6, 6, 0, 0]}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
      </Flex>
      <Flex height={16}>
        <Text fontSize={11} fill={hovered ? t.text : t.textMuted}>
          {label}
        </Text>
      </Flex>
    </Flex>
  );
}

// ─── Activity Feed ───

function ActivityFeed() {
  const items = [
    { name: "Alice", action: "Deployed v2.4.1 to production", time: "2m", color: t.green },
    { name: "Bob", action: "Merged PR #142 — Flex layout", time: "15m", color: t.accent },
    { name: "Carol", action: "Opened issue #87", time: "1h", color: t.amber },
    { name: "Dan", action: "Updated documentation", time: "3h", color: t.cyan },
    { name: "Eve", action: "Fixed CI pipeline", time: "5h", color: t.red },
  ];

  return (
    <Flex width={280} flexDirection="column" padding={20} gap={10}>
      <RoundRect fill={t.surface} radii={14} />
      <Flex height={24}>
        <Text fontSize={18} fill={t.text}>
          Activity
        </Text>
      </Flex>
      <Flex height={1}><Rect fill={t.border} /></Flex>
      <Flex flex={1} flexDirection="column" gap={2}>
        {items.map((item, i) => (
          <ActivityRow key={i} {...item} />
        ))}
      </Flex>
    </Flex>
  );
}

function ActivityRow({
  name,
  action,
  time,
  color,
}: {
  name: string;
  action: string;
  time: string;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      gap={12}
      height={44}
      paddingLeft={8}
      paddingRight={8}
    >
      <RoundRect
        fill={hovered ? t.border : "transparent"}
        alpha={0.4}
        radii={8}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {/* Avatar */}
      <Flex width={32} height={32} alignItems="center" justifyContent="center">
        <Circle fill={color} alpha={0.2} />
        <Text fontSize={14} fill={color} textAlign="center">
          {name[0]}
        </Text>
      </Flex>
      {/* Info */}
      <Flex flex={1} flexDirection="column" gap={3}>
        <Flex height={16}>
          <Text fontSize={13} fill={t.text}>
            {name}
          </Text>
        </Flex>
        <Flex height={14}>
          <Text fontSize={11} fill={t.textMuted}>
            {action}
          </Text>
        </Flex>
      </Flex>
      <Flex height={14}>
        <Text fontSize={11} fill={t.textMuted}>
          {time}
        </Text>
      </Flex>
    </Flex>
  );
}

// ─── Nav ───

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Flex height={36} paddingLeft={16} paddingRight={16} alignItems="center">
      {(active || hovered) && (
        <RoundRect fill={t.accent} alpha={active ? 0.15 : 0.08} radii={8} />
      )}
      <RoundRect
        fill="transparent"
        radii={8}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onClick?.()}
      />
      <Text
        fontSize={14}
        fill={active ? t.accentHover : hovered ? t.text : t.textDim}
        pointerEvents={false}
      >
        {label}
      </Text>
    </Flex>
  );
}

// ─── App ───

export default function App() {
  const dims = useDimensions();
  const [selectedStat, setSelectedStat] = useState(0);
  const [activeNav, setActiveNav] = useState("Overview");
  const [count, setCount] = useState(0);

  const statColors = [t.green, t.accent, t.amber, t.cyan];

  return (
    <Flex width={dims.width} height={dims.height} flexDirection="column">
      <Rect fill={t.bg} />

      {/* Nav bar */}
      <Flex height={52} flexDirection="row" alignItems="center" paddingLeft={24} paddingRight={24} gap={6}>
        <Rect fill={t.surface} />
        <Flex height={22} width={140}>
          <Text fontSize={18} fill={t.text}>
            ◆ Dashboard
          </Text>
        </Flex>
        <Flex flex={1} />
        {["Overview", "Analytics", "Reports", "Settings"].map((label) => (
          <NavItem
            key={label}
            label={label}
            active={activeNav === label}
            onClick={() => setActiveNav(label)}
          />
        ))}
      </Flex>
      <Flex height={1}><Rect fill={t.border} /></Flex>

      {/* Content */}
      <Flex flex={1} flexDirection="column" padding={24} gap={18}>
        {/* Stats row */}
        <Flex height={130} flexDirection="row" gap={14}>
          <StatCard
            title="TOTAL REVENUE"
            value="$48,290"
            color={t.green}
            selected={selectedStat === 0}
            onSelect={() => setSelectedStat(0)}
          />
          <StatCard
            title="ACTIVE USERS"
            value="2,847"
            color={t.accent}
            selected={selectedStat === 1}
            onSelect={() => setSelectedStat(1)}
          />
          <StatCard
            title="CONVERSION"
            value="3.24%"
            color={t.amber}
            selected={selectedStat === 2}
            onSelect={() => setSelectedStat(2)}
          />
          <StatCard
            title="RESPONSE TIME"
            value="142ms"
            color={t.cyan}
            selected={selectedStat === 3}
            onSelect={() => setSelectedStat(3)}
          />
        </Flex>

        {/* Chart + Activity */}
        <Flex flex={1} flexDirection="row" gap={14}>
          <BarChart highlight={statColors[selectedStat]} />
          <ActivityFeed />
        </Flex>

        {/* Footer with interactive button */}
        <Flex height={52} flexDirection="row" alignItems="center" gap={14}>
          <RoundRect fill={t.surface} radii={12} />
          <Flex flex={1} paddingLeft={16} height={20}>
            <Text fontSize={14} fill={t.textDim}>
              Clicks: {count} · Try clicking the stat cards and hovering the chart bars
            </Text>
          </Flex>
          <Button label="Click me!" color={t.accent} onPress={() => setCount(c => c + 1)} />
          <Button label="Reset" color={t.red} onPress={() => { setCount(0); setSelectedStat(0); }} />
          <Flex width={8} />
        </Flex>
      </Flex>
    </Flex>
  );
}
`;
