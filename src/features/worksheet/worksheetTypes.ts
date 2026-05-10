import type { JapaneseCharacterEntry } from "../characters/characterTypes";

// ============================================================
// Worksheet Types
// ============================================================

export type LayoutMode =
  | "one-character-per-row"
  | "one-character-per-page"
  | "multi-character-per-page"
  | "custom";

export interface WorksheetSettings {
  pageSize: "A4";
  orientation: "portrait" | "landscape";
  marginMm: number;
  layoutMode: LayoutMode;
  cellSizeMm: number;
  blankPracticeCells: number;
  traceCells: number;
  maxProgressiveCells: number | "all";
  showStrokeNumbers: boolean;
  traceOpacity: number;
  guideLineOpacity: number;
  selectedFontFamily: string;
}

export type WorksheetCellType =
  | "label"
  | "font-sample"
  | "stroke-order-full"
  | "progressive-stroke"
  | "trace"
  | "blank"
  | "missing-data";

export interface WorksheetCell {
  type: WorksheetCellType;
  character?: JapaneseCharacterEntry;
  step?: number; // for progressive stroke
  reason?: string; // for missing-data
}

export interface WorksheetRow {
  character: JapaneseCharacterEntry;
  cells: WorksheetCell[];
}

export interface WorksheetPage {
  pageIndex: number;
  rows: WorksheetRow[];
}

// A4 dimensions in mm
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
