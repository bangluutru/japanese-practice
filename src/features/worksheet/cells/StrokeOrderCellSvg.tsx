import React from "react";
import type { CharacterStrokeData } from "../../stroke/strokeTypes";
import { GridGuidesSvg } from "./GridGuidesSvg";

// ============================================================
// Stroke Order Cell — Renders all strokes with optional numbers
// ============================================================

interface StrokeOrderCellSvgProps {
  x: number;
  y: number;
  size: number;
  strokeData: CharacterStrokeData;
  showNumbers: boolean;
  guideLineOpacity: number;
}

export const StrokeOrderCellSvg: React.FC<StrokeOrderCellSvgProps> = ({
  x,
  y,
  size,
  strokeData,
  showNumbers,
  guideLineOpacity,
}) => {
  // Parse viewBox to get scale
  const vbParts = strokeData.viewBox.split(" ").map(Number);
  const vbW = vbParts[2] || 109;
  const vbH = vbParts[3] || 109;

  const padding = size * 0.08;
  const drawSize = size - 2 * padding;
  const scaleX = drawSize / vbW;
  const scaleY = drawSize / vbH;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = x + padding + (drawSize - vbW * scale) / 2;
  const offsetY = y + padding + (drawSize - vbH * scale) / 2;

  // Color palette for strokes
  const strokeColors = [
    "#333333", "#333333", "#333333", "#333333",
    "#333333", "#333333", "#333333", "#333333",
  ];

  return (
    <g>
      <GridGuidesSvg x={x} y={y} size={size} opacity={guideLineOpacity} />
      <g transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}>
        {strokeData.strokes.map((stroke, idx) => (
          <g key={stroke.id}>
            <path
              d={stroke.d}
              fill="none"
              stroke={strokeColors[idx % strokeColors.length]}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {showNumbers && (
              <StrokeNumber
                pathD={stroke.d}
                number={idx + 1}
                fontSize={10}
              />
            )}
          </g>
        ))}
      </g>
    </g>
  );
};

// Helper to estimate stroke start position from path data
function getPathStart(d: string): { x: number; y: number } {
  const match = d.match(/[Mm]\s*(-?[\d.]+)[,\s]+(-?[\d.]+)/);
  if (match) {
    return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
  }
  return { x: 10, y: 10 };
}

interface StrokeNumberProps {
  pathD: string;
  number: number;
  fontSize: number;
}

const StrokeNumber: React.FC<StrokeNumberProps> = ({ pathD, number, fontSize }) => {
  const start = getPathStart(pathD);
  const nx = Math.max(8, Math.min(start.x - 5, 101));
  const ny = Math.max(8, Math.min(start.y - 5, 101));

  return (
    <g>
      <circle cx={nx} cy={ny} r={fontSize * 0.55} fill="#ef4444" opacity={0.85} />
      <text
        x={nx}
        y={ny}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize * 0.7}
        fill="white"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
      >
        {number}
      </text>
    </g>
  );
};
