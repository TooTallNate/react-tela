export const DEFAULT_CODE = `import React, { useState, useEffect } from "react";
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

const theme = {
  bg: "#0a0e1a",
  surface: "#111827",
  surfaceLight: "#1f2937",
  border: "#374151",
  accent: "#6366f1",
  accentGlow: "#818cf8",
  green: "#10b981",
  red: "#ef4444",
  amber: "#f59e0b",
  cyan: "#06b6d4",
  textPrimary: "#f9fafb",
  textSecondary: "#9ca3af",
  textMuted: "#6b7280",
};

// ─── Reusable Components ───

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <Flex height={20} padding={6} alignItems="center">
      <RoundRect fill={color} alpha={0.15} radii={4} />
      <Text fontSize={10} fill={color}>
        {label}
      </Text>
    </Flex>
  );
}

function StatCard({
  title,
  value,
  change,
  positive,
  color,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  color: string;
}) {
  return (
    <Flex flex={1} flexDirection="column" padding={16} gap={8}>
      <RoundRect fill={theme.surface} radii={12} />
      {/* Top accent line */}
      <Flex height={3}>
        <RoundRect fill={color} radii={2} />
      </Flex>
      <Flex height={14}>
        <Text fontSize={11} fill={theme.textMuted}>
          {title}
        </Text>
      </Flex>
      <Flex height={32}>
        <Text fontSize={28} fill={theme.textPrimary}>
          {value}
        </Text>
      </Flex>
      <Flex flexDirection="row" gap={6} alignItems="center" height={16}>
        <Badge
          label={change}
          color={positive ? theme.green : theme.red}
        />
      </Flex>
    </Flex>
  );
}

function BarChart() {
  const data = [65, 40, 85, 55, 70, 90, 45, 75, 60, 80, 50, 95];
  const months = [
    "J", "F", "M", "A", "M", "J",
    "J", "A", "S", "O", "N", "D",
  ];
  const maxVal = 100;
  const barWidth = 18;
  const chartHeight = 120;

  return (
    <Flex flex={1} flexDirection="column" padding={16} gap={12}>
      <RoundRect fill={theme.surface} radii={12} />
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        height={20}
      >
        <Flex height={16}>
          <Text fontSize={13} fill={theme.textPrimary}>
            Monthly Revenue
          </Text>
        </Flex>
        <Badge label="2026" color={theme.accent} />
      </Flex>
      <Flex
        flex={1}
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="space-around"
        paddingBottom={18}
      >
        {data.map((val, i) => {
          const h = (val / maxVal) * chartHeight;
          const isHighest = val === Math.max(...data);
          return (
            <Flex
              key={i}
              width={barWidth}
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-end"
              gap={4}
            >
              <Flex width={barWidth} height={h}>
                <RoundRect
                  fill={isHighest ? theme.accentGlow : theme.accent}
                  alpha={isHighest ? 1 : 0.6}
                  radii={[4, 4, 0, 0]}
                />
              </Flex>
              <Flex height={12}>
                <Text fontSize={9} fill={theme.textMuted}>
                  {months[i]}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

function ActivityItem({
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
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      gap={10}
      height={36}
      paddingLeft={4}
      paddingRight={4}
    >
      {/* Avatar */}
      <Flex width={28} height={28}>
        <Circle fill={color} alpha={0.2} />
        <Text fontSize={12} fill={color} textAlign="center">
          {name[0]}
        </Text>
      </Flex>
      {/* Info */}
      <Flex flex={1} flexDirection="column" gap={2}>
        <Flex height={14}>
          <Text fontSize={11} fill={theme.textPrimary}>
            {name}
          </Text>
        </Flex>
        <Flex height={12}>
          <Text fontSize={9} fill={theme.textMuted}>
            {action}
          </Text>
        </Flex>
      </Flex>
      {/* Time */}
      <Flex height={12}>
        <Text fontSize={9} fill={theme.textMuted}>
          {time}
        </Text>
      </Flex>
    </Flex>
  );
}

function ActivityFeed() {
  return (
    <Flex width={240} flexDirection="column" padding={16} gap={8}>
      <RoundRect fill={theme.surface} radii={12} />
      <Flex height={18}>
        <Text fontSize={13} fill={theme.textPrimary}>
          Recent Activity
        </Text>
      </Flex>
      <Flex height={1}>
        <Rect fill={theme.border} />
      </Flex>
      <Flex flex={1} flexDirection="column" gap={4}>
        <ActivityItem
          name="Alice"
          action="Deployed v2.4.1"
          time="2m ago"
          color={theme.green}
        />
        <ActivityItem
          name="Bob"
          action="Merged PR #142"
          time="15m ago"
          color={theme.accent}
        />
        <ActivityItem
          name="Carol"
          action="Opened issue #87"
          time="1h ago"
          color={theme.amber}
        />
        <ActivityItem
          name="Dan"
          action="Updated docs"
          time="3h ago"
          color={theme.cyan}
        />
        <ActivityItem
          name="Eve"
          action="Fixed build pipeline"
          time="5h ago"
          color={theme.red}
        />
      </Flex>
    </Flex>
  );
}

function NavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <Flex height={32} paddingLeft={12} paddingRight={12} alignItems="center">
      {active && <RoundRect fill={theme.accent} alpha={0.1} radii={6} />}
      <Text
        fontSize={12}
        fill={active ? theme.accentGlow : theme.textSecondary}
      >
        {label}
      </Text>
    </Flex>
  );
}

// ─── Main App ───

export default function App() {
  const dims = useDimensions();

  return (
    <Flex
      width={dims.width}
      height={dims.height}
      flexDirection="column"
    >
      {/* Background */}
      <Rect fill={theme.bg} />

      {/* Top nav */}
      <Flex
        height={48}
        flexDirection="row"
        alignItems="center"
        paddingLeft={20}
        paddingRight={20}
        gap={4}
      >
        <Rect fill={theme.surface} />
        <Flex height={18} width={100}>
          <Text fontSize={15} fill={theme.textPrimary}>
            ◆ Dashboard
          </Text>
        </Flex>
        <Flex flex={1} />
        <NavItem label="Overview" active />
        <NavItem label="Analytics" />
        <NavItem label="Reports" />
        <NavItem label="Settings" />
      </Flex>

      {/* Divider */}
      <Flex height={1}>
        <Rect fill={theme.border} />
      </Flex>

      {/* Main content */}
      <Flex flex={1} flexDirection="column" padding={20} gap={16}>
        {/* Stat cards row */}
        <Flex height={120} flexDirection="row" gap={12}>
          <StatCard
            title="TOTAL REVENUE"
            value="$48,290"
            change="↑ 12.5%"
            positive={true}
            color={theme.green}
          />
          <StatCard
            title="ACTIVE USERS"
            value="2,847"
            change="↑ 8.1%"
            positive={true}
            color={theme.accent}
          />
          <StatCard
            title="CONVERSION"
            value="3.24%"
            change="↓ 0.4%"
            positive={false}
            color={theme.amber}
          />
          <StatCard
            title="AVG. RESPONSE"
            value="142ms"
            change="↑ 23%"
            positive={true}
            color={theme.cyan}
          />
        </Flex>

        {/* Chart + Activity row */}
        <Flex flex={1} flexDirection="row" gap={12}>
          <BarChart />
          <ActivityFeed />
        </Flex>
      </Flex>
    </Flex>
  );
}
`;
