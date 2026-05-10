import React from "react";
import type { JapaneseCharacterEntry } from "../../characters/characterTypes";
import { GridGuidesSvg } from "./GridGuidesSvg";

// ============================================================
// Missing Data Cell — Shows warning when stroke data unavailable
// ============================================================

interface MissingDataCellSvgProps {
  x: number;
  y: number;
  size: number;
  character: JapaneseCharacterEntry;
  reason: string;
  guideLineOpacity: number;
}

export const MissingDataCellSvg: React.FC<MissingDataCellSvgProps> = ({
  x,
  y,
  size,
  character,
  reason,
  guideLineOpacity,
}) => {
  return (
    <g>
      <GridGuidesSvg x={x} y={y} size={size} opacity={guideLineOpacity} />
      {/* Warning icon */}
      <text
        x={x + size / 2}
        y={y + size * 0.35}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.2}
        fill="#f59e0b"
      >
        ⚠
      </text>
      {/* Character */}
      <text
        x={x + size / 2}
        y={y + size * 0.6}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.25}
        fill="#999999"
        fontFamily="'Noto Sans JP', sans-serif"
      >
        {character.char}
      </text>
      {/* Reason text - tiny */}
      <text
        x={x + size / 2}
        y={y + size * 0.85}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.07}
        fill="#aaaaaa"
        fontFamily="Inter, sans-serif"
      >
        {reason.length > 20 ? reason.slice(0, 18) + "…" : reason}
      </text>
    </g>
  );
};
