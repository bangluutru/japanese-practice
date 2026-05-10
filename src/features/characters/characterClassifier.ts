import type { JapaneseCharacterType } from "./characterTypes";

// ============================================================
// Character Classification
// ============================================================

/** Classify a single character into its Japanese type */
export function classifyJapaneseCharacter(char: string): JapaneseCharacterType {
  const code = char.codePointAt(0);
  if (!code) return "unsupported";

  // Hiragana: U+3040–U+309F
  if (code >= 0x3040 && code <= 0x309f) return "hiragana";

  // Katakana: U+30A0–U+30FF
  if (code >= 0x30a0 && code <= 0x30ff) return "katakana";

  // CJK Unified Ideographs: U+4E00–U+9FFF (most common)
  if (code >= 0x4e00 && code <= 0x9fff) return "kanji";

  // CJK Extension A: U+3400–U+4DBF
  if (code >= 0x3400 && code <= 0x4dbf) return "kanji";

  // CJK Compatibility Ideographs: U+F900–U+FAFF
  if (code >= 0xf900 && code <= 0xfaff) return "kanji";

  return "unsupported";
}
