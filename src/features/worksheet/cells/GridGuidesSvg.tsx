import React from "react";

// ============================================================
// Grid Guides SVG — Renders guide lines inside a practice cell
// ============================================================

interface GridGuidesSvgProps {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export const GridGuidesSvg: React.FC<GridGuidesSvgProps> = ({
  x,
  y,
  size,
  opacity,
}) => {
  const cx = x + size / 2;
  const cy = y + size / 2;

  return (
    <g opacity={opacity}>
      {/* Outer border */}
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        fill="none"
        stroke="#666666"
        strokeWidth={0.3}
      />

      {/* Center vertical guide */}
      <line
        x1={cx}
        y1={y}
        x2={cx}
        y2={y + size}
        stroke="#C9C9C9"
        strokeWidth={0.15}
        strokeDasharray="0.8 0.4"
      />

      {/* Center horizontal guide */}
      <line
        x1={x}
        y1={cy}
        x2={x + size}
        y2={cy}
        stroke="#C9C9C9"
        strokeWidth={0.15}
        strokeDasharray="0.8 0.4"
      />

      {/* Diagonal guides */}
      <line
        x1={x}
        y1={y}
        x2={x + size}
        y2={y + size}
        stroke="#E0E0E0"
        strokeWidth={0.1}
        strokeDasharray="0.6 0.6"
      />
      <line
        x1={x + size}
        y1={y}
        x2={x}
        y2={y + size}
        stroke="#E0E0E0"
        strokeWidth={0.1}
        strokeDasharray="0.6 0.6"
      />
    </g>
  );
};
