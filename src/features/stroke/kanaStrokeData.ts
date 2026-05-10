import type { CharacterStrokeData } from "./strokeTypes";

// ============================================================
// Built-in Kana Stroke Data
// All kana now use KanjiVG via the KanjiVG fallback in strokeDataService.
// This map is intentionally empty — do not add simplified paths here.
// KanjiVG files in /public/kanjivg/ cover all 81 hiragana and 81 katakana
// with accurate calligraphic cubic bezier paths.
// ============================================================

const kanaStrokeDataMap: Record<string, CharacterStrokeData> = {};

/** Get stroke data for a kana character */
export function getKanaStrokeData(char: string): CharacterStrokeData | null {
  return kanaStrokeDataMap[char] ?? null;
}

/** Check if kana stroke data exists for a character */
export function hasKanaStrokeData(char: string): boolean {
  return char in kanaStrokeDataMap;
}

/** List all characters with available kana stroke data */
export function getAvailableKanaStrokes(): string[] {
  return Object.keys(kanaStrokeDataMap);
}
