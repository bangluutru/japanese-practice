import React from "react";
import type { JapaneseCharacterEntry } from "../../characters/characterTypes";
import { GridGuidesSvg } from "./GridGuidesSvg";

// ============================================================
// Trace Cell — Light gray character for writing over
// ============================================================

interface TraceCellSvgProps {
  x: number;
  y: number;
  size: number;
  character: JapaneseCharacterEntry;
  fontFamily: string;
  traceOpacity: number;
  guideLineOpacity: number;
}

export const TraceCellSvg: React.FC<TraceCellSvgProps> = ({
  x,
  y,
  size,
  character,
  fontFamily,
  traceOpacity,
  guideLineOpacity,
}) => {
  const fontSize = size * 0.7;

  return (
    <g>
      <GridGuidesSvg x={x} y={y} size={size} opacity={guideLineOpacity} />
      <text
        x={x + size / 2}
        y={y + size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={fontFamily}
        fontSize={fontSize}
        fill="#999999"
        opacity={traceOpacity}
      >
        {character.char}
      </text>
    </g>
  );
};
