import React from "react";
import type { CharacterStrokeData } from "../../stroke/strokeTypes";
import { GridGuidesSvg } from "./GridGuidesSvg";

// ============================================================
// Progressive Stroke Cell — Shows strokes 1 through step
// ============================================================

interface ProgressiveStrokeCellSvgProps {
  x: number;
  y: number;
  size: number;
  strokeData: CharacterStrokeData;
  step: number;
  showNumbers: boolean;
  guideLineOpacity: number;
}

export const ProgressiveStrokeCellSvg: React.FC<ProgressiveStrokeCellSvgProps> = ({
  x,
  y,
  size,
  strokeData,
  step,
  showNumbers,
  guideLineOpacity,
}) => {
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

  // Show strokes 1 through step
  const visibleStrokes = strokeData.strokes.slice(0, step);

  return (
    <g>
      <GridGuidesSvg x={x} y={y} size={size} opacity={guideLineOpacity} />
      <g transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}>
        {visibleStrokes.map((stroke, idx) => {
          const isCurrentStroke = idx === step - 1;
          return (
            <g key={stroke.id}>
              <path
                d={stroke.d}
                fill="none"
                stroke={isCurrentStroke ? "#ef4444" : "#333333"}
                strokeWidth={isCurrentStroke ? 3.5 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {showNumbers && isCurrentStroke && (
                <StepNumber pathD={stroke.d} number={step} />
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
};

function getPathStart(d: string): { x: number; y: number } {
  const match = d.match(/[Mm]\s*(-?[\d.]+)[,\s]+(-?[\d.]+)/);
  if (match) return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
  return { x: 10, y: 10 };
}

const StepNumber: React.FC<{ pathD: string; number: number }> = ({ pathD, number }) => {
  const start = getPathStart(pathD);
  const nx = Math.max(8, Math.min(start.x - 5, 101));
  const ny = Math.max(8, Math.min(start.y - 5, 101));
  return (
    <g>
      <circle cx={nx} cy={ny} r={6} fill="#ef4444" opacity={0.9} />
      <text
        x={nx}
        y={ny}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={7}
        fill="white"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
      >
        {number}
      </text>
    </g>
  );
};
