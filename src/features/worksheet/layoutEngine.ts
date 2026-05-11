import type { JapaneseCharacterEntry } from "../characters/characterTypes";
import type { CharacterStrokeData } from "../stroke/strokeTypes";
import type {
  WorksheetSettings,
  WorksheetPage,
  WorksheetRow,
} from "./worksheetTypes";

// ============================================================
// Layout Engine — Two-row-per-character layout
// ============================================================

// Each character block = header area (stroke order) + practice row (trace/blank)
// Header area is always 2× mini-cell height so block height is constant regardless of stroke count.
// Few strokes → single row of full-width cells (clearer); many strokes → 2 rows of half-width cells.
const HEADER_RATIO = 0.45;       // mini-cell height as fraction of cellSizeMm
const HEADER_ROWS = 2;           // header area = HEADER_ROWS × mini-cell height (fixed)
const HEADER_PRACTICE_GAP = 0.5; // mm gap between header area and practice sub-row
const BLOCK_GAP = 1.5;           // mm gap between character blocks

/** Get page dimensions based on settings */
export function getPageDimensions(settings: WorksheetSettings): {
  widthMm: number;
  heightMm: number;
} {
  const isPortrait = settings.orientation === "portrait";
  return {
    widthMm: isPortrait ? 210 : 297,
    heightMm: isPortrait ? 297 : 210,
  };
}

/** Get printable area dimensions (page minus margins) */
export function getPrintableArea(settings: WorksheetSettings): {
  x: number;
  y: number;
  widthMm: number;
  heightMm: number;
} {
  const page = getPageDimensions(settings);
  return {
    x: settings.marginMm,
    y: settings.marginMm,
    widthMm: page.widthMm - 2 * settings.marginMm,
    heightMm: page.heightMm - 2 * settings.marginMm,
  };
}

/** Calculate how many cells fit in one row */
export function getCellsPerRow(settings: WorksheetSettings): number {
  const printable = getPrintableArea(settings);
  return Math.floor(printable.widthMm / settings.cellSizeMm);
}

/** Total height of the stroke-order header area (always 2× mini-cell height) */
export function getHeaderHeightMm(settings: WorksheetSettings): number {
  return settings.cellSizeMm * HEADER_RATIO * HEADER_ROWS;
}

/** Height of one mini stroke-step cell (half the header area height) */
export function getMiniCellHeightMm(settings: WorksheetSettings): number {
  return settings.cellSizeMm * HEADER_RATIO;
}

/** Total height of one character block (header + gap + practice + between-block gap) */
export function getRowHeightMm(settings: WorksheetSettings): number {
  return getHeaderHeightMm(settings) + HEADER_PRACTICE_GAP + settings.cellSizeMm + BLOCK_GAP;
}

/** Generate a single worksheet row for one character */
export function generateWorksheetRow(
  entry: JapaneseCharacterEntry,
  strokeData: CharacterStrokeData | null,
  settings: WorksheetSettings
): WorksheetRow {
  const maxCells = getCellsPerRow(settings);
  const singleRowCapacity = maxCells - 1; // full-width cells per header row
  // In double-row mode each cell is half-width → 2× per row, across 2 rows → 4× capacity
  const doubleRowCapacity = singleRowCapacity * 4;

  const totalStrokes = strokeData?.strokes.length ?? 0;
  const maxSteps =
    settings.maxProgressiveCells === "all"
      ? totalStrokes
      : Math.min(settings.maxProgressiveCells, totalStrokes);

  // Mode is determined by actual stroke count, not the user-capped maxSteps.
  // A 14-stroke kanji always uses double-row layout even if maxProgressiveCells=8.
  const useDoubleRow = totalStrokes > singleRowCapacity;
  const maxCapacity = useDoubleRow ? doubleRowCapacity : singleRowCapacity;
  const strokeStepCount = Math.min(maxSteps, maxCapacity);

  // Practice: 1 reference cell + N trace cells + auto-fill blank to end of row
  const traceCellCount = Math.min(settings.traceCells, maxCells - 1);
  const blankCellCount = maxCells - 1 - traceCellCount;

  return {
    character: entry,
    strokeStepCount: strokeData ? strokeStepCount : 0,
    traceCellCount,
    blankCellCount,
    headerRowMode: useDoubleRow ? "double" : "single",
  };
}

/** Generate all worksheet pages */
export function generateWorksheetPages(
  characters: JapaneseCharacterEntry[],
  strokeDataMap: Map<string, CharacterStrokeData | null>,
  settings: WorksheetSettings
): WorksheetPage[] {
  const printable = getPrintableArea(settings);
  const rowHeight = getRowHeightMm(settings);

  const titleHeightMm = 8;
  const availableHeight = printable.heightMm - titleHeightMm;
  const rowsPerPage = Math.floor(availableHeight / rowHeight);

  const allRows: WorksheetRow[] = characters.map((entry) => {
    const strokeData = strokeDataMap.get(entry.char) ?? null;
    return generateWorksheetRow(entry, strokeData, settings);
  });

  const pages: WorksheetPage[] = [];
  let pageIndex = 0;

  for (let i = 0; i < allRows.length; i += rowsPerPage) {
    pages.push({ pageIndex, rows: allRows.slice(i, i + rowsPerPage) });
    pageIndex++;
  }

  if (pages.length === 0) {
    pages.push({ pageIndex: 0, rows: [] });
  }

  return pages;
}
