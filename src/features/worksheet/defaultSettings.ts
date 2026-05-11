import type { WorksheetSettings } from "./worksheetTypes";

// ============================================================
// Default Worksheet Settings
// ============================================================

export const defaultSettings: WorksheetSettings = {
  pageSize: "A4",
  orientation: "portrait",
  marginMm: 12,
  layoutMode: "one-character-per-row",
  cellSizeMm: 18,
  blankPracticeCells: 3,
  traceCells: 3,
  maxProgressiveCells: "all",
  showStrokeNumbers: true,
  traceOpacity: 0.22,
  guideLineOpacity: 0.45,
  selectedFontFamily: '"Noto Sans JP", sans-serif',
};
