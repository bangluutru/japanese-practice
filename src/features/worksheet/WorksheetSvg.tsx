import { forwardRef } from "react";
import type { WorksheetPage, WorksheetSettings } from "./worksheetTypes";
import type { CharacterStrokeData } from "../stroke/strokeTypes";
import { getPageDimensions, getPrintableArea, getRowHeightMm } from "./layoutEngine";
import { GridGuidesSvg } from "./cells/GridGuidesSvg";
import { FontSampleCellSvg } from "./cells/FontSampleCellSvg";
import { TraceCellSvg } from "./cells/TraceCellSvg";
import { StrokeOrderCellSvg } from "./cells/StrokeOrderCellSvg";
import { ProgressiveStrokeCellSvg } from "./cells/ProgressiveStrokeCellSvg";
import { MissingDataCellSvg } from "./cells/MissingDataCellSvg";

// ============================================================
// WorksheetSvg — Renders a single A4 page as SVG
// ============================================================

interface WorksheetSvgProps {
  page: WorksheetPage;
  settings: WorksheetSettings;
  strokeDataMap: Map<string, CharacterStrokeData | null>;
  className?: string;
}

export const WorksheetSvg = forwardRef<SVGSVGElement, WorksheetSvgProps>(
  ({ page, settings, strokeDataMap, className }, ref) => {
    const dims = getPageDimensions(settings);
    const printable = getPrintableArea(settings);
    const cellSize = settings.cellSizeMm;
    const rowHeight = getRowHeightMm(settings);

    const titleY = printable.y + 4;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={`${dims.widthMm}mm`}
        height={`${dims.heightMm}mm`}
        viewBox={`0 0 ${dims.widthMm} ${dims.heightMm}`}
        className={className}
        style={{ background: "white" }}
      >
        {/* Page background */}
        <rect x={0} y={0} width={dims.widthMm} height={dims.heightMm} fill="white" />

        {/* Title */}
        <text
          x={dims.widthMm / 2}
          y={titleY}
          textAnchor="middle"
          fontSize={3.5}
          fill="#666666"
          fontFamily="Inter, sans-serif"
        >
          Japanese Writing Practice — Page {page.pageIndex + 1}
        </text>

        {/* Rows */}
        {page.rows.map((row, rowIdx) => {
          const rowY = printable.y + 8 + rowIdx * rowHeight;
          const strokeData = strokeDataMap.get(row.character.char) ?? null;

          return (
            <g key={`row-${rowIdx}`}>
              {row.cells.map((cell, cellIdx) => {
                const cellX = printable.x + cellIdx * cellSize;

                switch (cell.type) {
                  case "label":
                    return (
                      <g key={`cell-${cellIdx}`}>
                        <rect
                          x={cellX}
                          y={rowY}
                          width={cellSize}
                          height={cellSize}
                          fill="#f8f9fa"
                          stroke="#666666"
                          strokeWidth={0.3}
                        />
                        <text
                          x={cellX + cellSize / 2}
                          y={rowY + cellSize * 0.42}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={cellSize * 0.45}
                          fill="#222222"
                          fontFamily="'Noto Sans JP', sans-serif"
                          fontWeight="700"
                        >
                          {cell.character!.char}
                        </text>
                        {cell.character!.romaji && (
                          <text
                            x={cellX + cellSize / 2}
                            y={rowY + cellSize * 0.78}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={cellSize * 0.14}
                            fill="#888888"
                            fontFamily="Inter, sans-serif"
                          >
                            {cell.character!.romaji}
                          </text>
                        )}
                      </g>
                    );

                  case "font-sample":
                    return (
                      <FontSampleCellSvg
                        key={`cell-${cellIdx}`}
                        x={cellX}
                        y={rowY}
                        size={cellSize}
                        character={cell.character!}
                        fontFamily={settings.selectedFontFamily}
                        guideLineOpacity={settings.guideLineOpacity}
                      />
                    );

                  case "stroke-order-full":
                    if (strokeData) {
                      return (
                        <StrokeOrderCellSvg
                          key={`cell-${cellIdx}`}
                          x={cellX}
                          y={rowY}
                          size={cellSize}
                          strokeData={strokeData}
                          showNumbers={settings.showStrokeNumbers}
                          guideLineOpacity={settings.guideLineOpacity}
                        />
                      );
                    }
                    return (
                      <MissingDataCellSvg
                        key={`cell-${cellIdx}`}
                        x={cellX}
                        y={rowY}
                        size={cellSize}
                        character={cell.character!}
                        reason="No stroke data"
                        guideLineOpacity={settings.guideLineOpacity}
                      />
                    );

                  case "progressive-stroke":
                    if (strokeData) {
                      return (
                        <ProgressiveStrokeCellSvg
                          key={`cell-${cellIdx}`}
                          x={cellX}
                          y={rowY}
                          size={cellSize}
                          strokeData={strokeData}
                          step={cell.step!}
                          showNumbers={settings.showStrokeNumbers}
                          guideLineOpacity={settings.guideLineOpacity}
                        />
                      );
                    }
                    return null;

                  case "trace":
                    return (
                      <TraceCellSvg
                        key={`cell-${cellIdx}`}
                        x={cellX}
                        y={rowY}
                        size={cellSize}
                        character={cell.character!}
                        fontFamily={settings.selectedFontFamily}
                        traceOpacity={settings.traceOpacity}
                        guideLineOpacity={settings.guideLineOpacity}
                      />
                    );

                  case "blank":
                    return (
                      <GridGuidesSvg
                        key={`cell-${cellIdx}`}
                        x={cellX}
                        y={rowY}
                        size={cellSize}
                        opacity={settings.guideLineOpacity}
                      />
                    );

                  case "missing-data":
                    return (
                      <MissingDataCellSvg
                        key={`cell-${cellIdx}`}
                        x={cellX}
                        y={rowY}
                        size={cellSize}
                        character={cell.character!}
                        reason={cell.reason || "Missing data"}
                        guideLineOpacity={settings.guideLineOpacity}
                      />
                    );

                  default:
                    return null;
                }
              })}
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
          Practice Sheet Builder
        </text>
      </svg>
    );
  }
);

WorksheetSvg.displayName = "WorksheetSvg";
