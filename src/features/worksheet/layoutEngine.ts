import type { JapaneseCharacterEntry } from "../characters/characterTypes";
import type { CharacterStrokeData } from "../stroke/strokeTypes";
import type {
  WorksheetSettings,
  WorksheetPage,
  WorksheetRow,
  WorksheetCell,
} from "./worksheetTypes";

// ============================================================
// Layout Engine — Generates worksheet pages from characters
// ============================================================

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

/** Calculate the row height in mm */
export function getRowHeightMm(settings: WorksheetSettings): number {
  // One row of cells + small gap
  return settings.cellSizeMm + 1;
}

/** Generate cells for a single character row */
export function generateRowCells(
  entry: JapaneseCharacterEntry,
  strokeData: CharacterStrokeData | null,
  settings: WorksheetSettings
): WorksheetCell[] {
  const maxCells = getCellsPerRow(settings);
  const cells: WorksheetCell[] = [];

  // 1. Label cell
  cells.push({ type: "label", character: entry });

  // 2. Font sample cell
  cells.push({ type: "font-sample", character: entry });

  // 3. Stroke order full cell (if data available)
  if (strokeData) {
    cells.push({ type: "stroke-order-full", character: entry });

    // 4. Progressive stroke cells
    const totalStrokes = strokeData.strokes.length;
    const maxProg =
      settings.maxProgressiveCells === "all"
        ? totalStrokes
        : Math.min(settings.maxProgressiveCells, totalStrokes);

    // Calculate remaining cells for progressive, trace, and blank
    const usedSoFar = cells.length;
    const remainingForPractice = maxCells - usedSoFar - settings.traceCells - settings.blankPracticeCells;
    const actualProgressive = Math.max(0, Math.min(maxProg, remainingForPractice));

    for (let step = 1; step <= actualProgressive; step++) {
      cells.push({ type: "progressive-stroke", character: entry, step });
    }
  } else {
    // No stroke data
    cells.push({
      type: "missing-data",
      character: entry,
      reason: "Stroke data not available",
    });
  }

  // 5. Trace cells
  for (let i = 0; i < settings.traceCells; i++) {
    if (cells.length < maxCells) {
      cells.push({ type: "trace", character: entry });
    }
  }

  // 6. Blank practice cells — fill remaining
  const blanksToAdd = Math.min(
    settings.blankPracticeCells,
    maxCells - cells.length
  );
  for (let i = 0; i < blanksToAdd; i++) {
    cells.push({ type: "blank" });
  }

  return cells.slice(0, maxCells);
}

/** Generate all worksheet pages */
export function generateWorksheetPages(
  characters: JapaneseCharacterEntry[],
  strokeDataMap: Map<string, CharacterStrokeData | null>,
  settings: WorksheetSettings
): WorksheetPage[] {
  const printable = getPrintableArea(settings);
  const rowHeight = getRowHeightMm(settings);

  // Title area height
  const titleHeightMm = 8;
  const availableHeight = printable.heightMm - titleHeightMm;
  const rowsPerPage = Math.floor(availableHeight / rowHeight);

  const allRows: WorksheetRow[] = characters.map((entry) => {
    const strokeData = strokeDataMap.get(entry.char) ?? null;
    const cells = generateRowCells(entry, strokeData, settings);
    return { character: entry, cells };
  });

  const pages: WorksheetPage[] = [];
  let pageIndex = 0;

  for (let i = 0; i < allRows.length; i += rowsPerPage) {
    const pageRows = allRows.slice(i, i + rowsPerPage);
    pages.push({ pageIndex, rows: pageRows });
    pageIndex++;
  }

  // Ensure at least one page even if empty
  if (pages.length === 0) {
    pages.push({ pageIndex: 0, rows: [] });
  }

  return pages;
}
