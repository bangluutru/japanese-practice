import { forwardRef } from "react";
import type React from "react";
import type { WorksheetPage, WorksheetSettings } from "./worksheetTypes";
import type { CharacterStrokeData } from "../stroke/strokeTypes";
import type { JapaneseCharacterEntry } from "../characters/characterTypes";
import {
  getPageDimensions,
  getPrintableArea,
  getRowHeightMm,
  getHeaderHeightMm,
  getCellsPerRow,
} from "./layoutEngine";
import { GridGuidesSvg } from "./cells/GridGuidesSvg";
import { TraceCellSvg } from "./cells/TraceCellSvg";

// ============================================================
// WorksheetSvg — Two-row layout per character
//   Header row: reading label + progressive stroke steps
//   Practice row: bold reference + faded trace cells + blank cells
// ============================================================

interface WorksheetSvgProps {
  page: WorksheetPage;
  settings: WorksheetSettings;
  strokeDataMap: Map<string, CharacterStrokeData | null>;
  className?: string;
  style?: React.CSSProperties;
}

const HEADER_PRACTICE_GAP = 0.5; // mm gap between header and practice sub-rows

export const WorksheetSvg = forwardRef<SVGSVGElement, WorksheetSvgProps>(
  ({ page, settings, strokeDataMap, className, style }, ref) => {
    const dims = getPageDimensions(settings);
    const printable = getPrintableArea(settings);
    const cellSize = settings.cellSizeMm;
    const rowHeight = getRowHeightMm(settings);
    const headerH = getHeaderHeightMm(settings); // full header area = 2× mini-cell height
    const miniCellH = headerH / 2;               // single mini-cell height
    const miniCellW = cellSize / 2;
    const singleRowCapacity = getCellsPerRow(settings) - 1;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={`${dims.widthMm}mm`}
        height={`${dims.heightMm}mm`}
        viewBox={`0 0 ${dims.widthMm} ${dims.heightMm}`}
        className={className}
        style={{ background: "white", ...style }}
      >
        {/* Page background */}
        <rect x={0} y={0} width={dims.widthMm} height={dims.heightMm} fill="white" />

        {/* Title */}
        <text
          x={dims.widthMm / 2}
          y={printable.y + 4}
          textAnchor="middle"
          fontSize={3.5}
          fill="#666666"
          fontFamily="Inter, sans-serif"
        >
          Japanese Writing Practice — Page {page.pageIndex + 1}
        </text>

        {/* Character rows */}
        {page.rows.map((row, rowIdx) => {
          const blockY = printable.y + 8 + rowIdx * rowHeight;
          const practiceY = blockY + headerH + HEADER_PRACTICE_GAP;
          const strokeData = strokeDataMap.get(row.character.char) ?? null;

          return (
            <g key={`row-${rowIdx}`}>
              {/* ── HEADER ROW: reading label + stroke progression ── */}

              <HeaderLabelCell
                x={printable.x}
                y={blockY}
                width={cellSize}
                height={headerH}
                character={row.character}
                strokeCount={strokeData?.strokes.length ?? null}
              />

              {strokeData &&
                (row.headerRowMode === "single"
                  ? Array.from({ length: row.strokeStepCount }, (_, i) => (
                      <HeaderStrokeStepCell
                        key={`hstep-${i}`}
                        x={printable.x + (i + 1) * cellSize}
                        y={blockY}
                        width={cellSize}
                        height={headerH}
                        strokeData={strokeData}
                        step={i + 1}
                        showNumbers={settings.showStrokeNumbers}
                      />
                    ))
                  : Array.from({ length: row.strokeStepCount }, (_, i) => {
                      const stepsPerMiniRow = singleRowCapacity * 2;
                      const rowIdx = Math.floor(i / stepsPerMiniRow);
                      const colIdx = i % stepsPerMiniRow;
                      return (
                        <HeaderStrokeStepCell
                          key={`hstep-${i}`}
                          x={printable.x + cellSize + colIdx * miniCellW}
                          y={blockY + rowIdx * miniCellH}
                          width={miniCellW}
                          height={miniCellH}
                          strokeData={strokeData}
                          step={i + 1}
                          showNumbers={settings.showStrokeNumbers}
                        />
                      );
                    }))}

              {/* ── PRACTICE ROW: reference + trace + blank ── */}

              <ReferenceCellSvg
                x={printable.x}
                y={practiceY}
                size={cellSize}
                character={row.character}
                fontFamily={settings.selectedFontFamily}
              />

              {Array.from({ length: row.traceCellCount }, (_, i) => (
                <TraceCellSvg
                  key={`trace-${i}`}
                  x={printable.x + (i + 1) * cellSize}
                  y={practiceY}
                  size={cellSize}
                  character={row.character}
                  fontFamily={settings.selectedFontFamily}
                  traceOpacity={settings.traceOpacity}
                  guideLineOpacity={settings.guideLineOpacity}
                />
              ))}

              {Array.from({ length: row.blankCellCount }, (_, i) => (
                <GridGuidesSvg
                  key={`blank-${i}`}
                  x={printable.x + (row.traceCellCount + 1 + i) * cellSize}
                  y={practiceY}
                  size={cellSize}
                  opacity={settings.guideLineOpacity}
                />
              ))}
            </g>
          );
        })}

        {/* Footer */}
        <text
          x={dims.widthMm / 2}
          y={dims.heightMm - settings.marginMm / 2}
          textAnchor="middle"
          fontSize={2}
          fill="#cccccc"
          fontFamily="Inter, sans-serif"
        >
          Japanese Practice Sheet
        </text>
      </svg>
    );
  }
);

WorksheetSvg.displayName = "WorksheetSvg";

// ============================================================
// Header: reading label cell
// ============================================================

interface HeaderLabelCellProps {
  x: number;
  y: number;
  width: number;
  height: number;
  character: JapaneseCharacterEntry;
  strokeCount: number | null;
}

const HeaderLabelCell: React.FC<HeaderLabelCellProps> = ({
  x,
  y,
  width,
  height,
  character,
  strokeCount,
}) => {
  const reading = character.romaji ?? character.char;
  const hasCount = strokeCount !== null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#f0effe"
        stroke="#c9c5d0"
        strokeWidth={0.25}
      />
      <text
        x={x + width / 2}
        y={y + height * (hasCount ? 0.38 : 0.5)}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={height * 0.38}
        fill="#444444"
        fontFamily="Inter, sans-serif"
        fontStyle="italic"
      >
        {reading}
      </text>
      {hasCount && (
        <text
          x={x + width / 2}
          y={y + height * 0.78}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={height * 0.28}
          fill="#888888"
          fontFamily="Inter, sans-serif"
        >
          {strokeCount}画
        </text>
      )}
    </g>
  );
};

// ============================================================
// Header: progressive stroke step mini cell
// ============================================================

interface HeaderStrokeStepCellProps {
  x: number;
  y: number;
  width: number;
  height: number;
  strokeData: CharacterStrokeData;
  step: number;
  showNumbers: boolean;
}

const HeaderStrokeStepCell: React.FC<HeaderStrokeStepCellProps> = ({
  x,
  y,
  width,
  height,
  strokeData,
  step,
  showNumbers,
}) => {
  const vbParts = strokeData.viewBox.split(" ").map(Number);
  const vbW = vbParts[2] || 109;
  const vbH = vbParts[3] || 109;

  const padding = height * 0.07;
  const drawW = width - 2 * padding;
  const drawH = height - 2 * padding;
  const scale = Math.min(drawW / vbW, drawH / vbH);

  const offsetX = x + padding + (drawW - vbW * scale) / 2;
  const offsetY = y + padding + (drawH - vbH * scale) / 2;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="white"
        stroke="#c9c5d0"
        strokeWidth={0.2}
      />
      <g transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}>
        {strokeData.strokes.slice(0, step).map((stroke, idx) => {
          const isNew = idx === step - 1;
          return (
            <path
              key={stroke.id}
              d={stroke.d}
              fill="none"
              stroke={isNew ? "#e53e3e" : "#555555"}
              strokeWidth={isNew ? 5 : 3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isNew ? 1 : 0.5}
            />
          );
        })}
      </g>
      {showNumbers && (
        <text
          x={x + width - 1.2}
          y={y + 1.2}
          textAnchor="end"
          dominantBaseline="hanging"
          fontSize={height * 0.3}
          fill="#e53e3e"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
        >
          {step}
        </text>
      )}
    </g>
  );
};

// ============================================================
// Practice row: bold reference character cell
// ============================================================

interface ReferenceCellSvgProps {
  x: number;
  y: number;
  size: number;
  character: JapaneseCharacterEntry;
  fontFamily: string;
}

const ReferenceCellSvg: React.FC<ReferenceCellSvgProps> = ({
  x,
  y,
  size,
  character,
  fontFamily,
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={size}
      height={size}
      fill="#f0effe"
      stroke="#999999"
      strokeWidth={0.35}
    />
    <text
      x={x + size / 2}
      y={y + size / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size * 0.72}
      fill="#1a1a2e"
      fontFamily={fontFamily}
      fontWeight="700"
    >
      {character.char}
    </text>
  </g>
);
