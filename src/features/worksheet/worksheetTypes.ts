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

export interface WorksheetRow {
  character: JapaneseCharacterEntry;
  /** Number of progressive stroke steps shown in the header row (0 = no stroke data) */
  strokeStepCount: number;
  /** Number of faded trace cells in the practice row */
  traceCellCount: number;
  /** Number of blank cells (auto-fills remaining columns to end of row) */
  blankCellCount: number;
}

export interface WorksheetPage {
  pageIndex: number;
  rows: WorksheetRow[];
}

// A4 dimensions in mm
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
