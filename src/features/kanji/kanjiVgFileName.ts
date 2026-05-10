// ============================================================
// KanjiVG Filename Utility
// ============================================================

/** Convert a Kanji character to its KanjiVG filename */
export function kanjiToKanjiVgFileName(char: string): string {
  const codePoint = char.codePointAt(0);
  if (!codePoint) throw new Error(`Invalid character: ${char}`);
  return codePoint.toString(16).padStart(5, "0") + ".svg";
}
