import type { JapaneseCharacterEntry, CharacterCategory } from "./characterTypes";
import { getCharactersByCategory } from "./characterLibrary";

// ============================================================
// Character Search
// ============================================================

/** Search characters across char, reading, romaji, group, tags, and codePointHex.
 *  Pass a custom `pool` to search within a pre-filtered set (e.g. a Kanji group). */
export function searchCharacters(
  query: string,
  category: CharacterCategory,
  pool?: JapaneseCharacterEntry[]
): JapaneseCharacterEntry[] {
  const trimmed = query.trim().toLowerCase();
  const activePool = pool ?? getCharactersByCategory(category);
  if (!trimmed) return activePool;

  return activePool.filter((entry) => {
    if (entry.char === trimmed) return true;
    if (entry.reading && entry.reading.toLowerCase().includes(trimmed)) return true;
    if (entry.romaji && entry.romaji.toLowerCase().includes(trimmed)) return true;
    if (entry.group && entry.group.toLowerCase().includes(trimmed)) return true;
    if (entry.tags && entry.tags.some((t) => t.toLowerCase().includes(trimmed))) return true;
    if (entry.id.toLowerCase().includes(trimmed)) return true;
    if (entry.codePointHex && entry.codePointHex.includes(trimmed)) return true;
    return false;
  });
}
