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
  // Kanji classification metadata (populated by generation script)
  codePointHex?: string;
  kanjiVgFileName?: string;
  isJouyou?: boolean;
  jouyouGrade?: number | "S" | null;
  jlptLevel?: "N5" | "N4" | "N3" | "N2" | "N1" | null;
  categories?: string[];
}

export type KanjiGroupFilter =
  | "all-kanjivg"
  | "jouyou"
  | "jlpt-n5"
  | "jlpt-n4"
  | "jlpt-n3"
  | "jlpt-n2"
  | "jlpt-n1"
  | "other";
