import { hiraganaLibrary } from "./hiraganaLibrary";
import { katakanaLibrary } from "./katakanaLibrary";
import { kanjiLibrary } from "./kanjiLibrary";
import type { JapaneseCharacterEntry, CharacterCategory } from "./characterTypes";

// ============================================================
// Unified character library
// ============================================================

export const allCharacters: JapaneseCharacterEntry[] = [
  ...hiraganaLibrary,
  ...katakanaLibrary,
  ...kanjiLibrary,
];

/** Look up a character entry by its char string */
const charMap = new Map<string, JapaneseCharacterEntry>();
allCharacters.forEach((entry) => {
  charMap.set(entry.char, entry);
});

export function findCharacterEntry(char: string): JapaneseCharacterEntry | undefined {
  return charMap.get(char);
}

export function getCharactersByCategory(category: CharacterCategory): JapaneseCharacterEntry[] {
  if (category === "all") return allCharacters;
  return allCharacters.filter((c) => c.type === category);
}
