import React from "react";

// ============================================================
// Grid Guides SVG — 米字格 style practice cell guides
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
    <g>
      {/* Outer border — always at full opacity */}
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        fill="none"
        stroke="#999999"
        strokeWidth={0.3}
      />

      {/* Internal 米字格 guides — opacity controlled by setting */}
      <g opacity={opacity}>
        {/* Center vertical */}
        <line
          x1={cx}
          y1={y}
          x2={cx}
          y2={y + size}
          stroke="#aaaaaa"
          strokeWidth={0.2}
          strokeDasharray="1 0.5"
        />
        {/* Center horizontal */}
        <line
          x1={x}
          y1={cy}
          x2={x + size}
          y2={cy}
          stroke="#aaaaaa"
          strokeWidth={0.2}
          strokeDasharray="1 0.5"
        />
        {/* Diagonal top-left → bottom-right */}
        <line
          x1={x}
          y1={y}
          x2={x + size}
          y2={y + size}
          stroke="#bbbbbb"
          strokeWidth={0.15}
          strokeDasharray="0.8 0.6"
        />
        {/* Diagonal top-right → bottom-left */}
        <line
          x1={x + size}
          y1={y}
          x2={x}
          y2={y + size}
          stroke="#bbbbbb"
          strokeWidth={0.15}
          strokeDasharray="0.8 0.6"
        />
      </g>
    </g>
  );
};
