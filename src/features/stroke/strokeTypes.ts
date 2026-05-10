// ============================================================
// Stroke Data Types
// ============================================================

export interface StrokePath {
  id: string;
  d: string;
  order: number;
  element?: string;
  rawAttributes?: Record<string, string>;
}

export interface CharacterStrokeData {
  character: string;
  type: "hiragana" | "katakana" | "kanji";
  source: "builtin-kana" | "kanjivg";
  viewBox: string;
  strokes: StrokePath[];
}
