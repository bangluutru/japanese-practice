import type { JapaneseCharacterEntry } from "./characterTypes";
import { classifyJapaneseCharacter } from "./characterClassifier";
import { findCharacterEntry } from "./characterLibrary";

// ============================================================
// Practice List Utilities
// ============================================================

/** Parse manual input text into character entries */
export function parseManualInput(input: string): JapaneseCharacterEntry[] {
  // Remove whitespace
  const cleaned = input.replace(/\s/g, "");
  const chars = Array.from(cleaned);
  const results: JapaneseCharacterEntry[] = [];

  for (const char of chars) {
    const existing = findCharacterEntry(char);
    if (existing) {
      results.push(existing);
    } else {
      const type = classifyJapaneseCharacter(char);
      results.push({
        id: `manual-${char}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        char,
        type,
        strokeDataSource:
          type === "kanji"
            ? "kanjivg"
            : type === "hiragana" || type === "katakana"
            ? "builtin-kana"
            : "missing",
      });
    }
  }

  return results;
}
