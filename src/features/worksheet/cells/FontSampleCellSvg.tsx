import React from "react";
import type { JapaneseCharacterEntry } from "../../characters/characterTypes";
import { GridGuidesSvg } from "./GridGuidesSvg";

// ============================================================
// Font Sample Cell — Renders character using selected font
// ============================================================

interface FontSampleCellSvgProps {
  x: number;
  y: number;
  size: number;
  character: JapaneseCharacterEntry;
  fontFamily: string;
  guideLineOpacity: number;
}

export const FontSampleCellSvg: React.FC<FontSampleCellSvgProps> = ({
  x,
  y,
  size,
  character,
  fontFamily,
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
        fill="#222222"
      >
        {character.char}
      </text>
    </g>
  );
};
