// ============================================================
// Character Types
// ============================================================

export type JapaneseCharacterType = "hiragana" | "katakana" | "kanji" | "unsupported";

export type StrokeDataSource = "builtin-kana" | "kanjivg" | "missing";

export type CharacterCategory = "hiragana" | "katakana" | "kanji" | "all";

export interface JapaneseCharacterEntry {
  id: string;
  char: string;
  type: JapaneseCharacterType;
  reading?: string;
  romaji?: string;
  group?: string;
  tags?: string[];
  strokeDataSource: StrokeDataSource;
}
