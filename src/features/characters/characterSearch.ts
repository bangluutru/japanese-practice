import type { JapaneseCharacterEntry, CharacterCategory } from "./characterTypes";
import { getCharactersByCategory } from "./characterLibrary";

// ============================================================
// Character Search
// ============================================================

/** Search characters across char, reading, romaji, group, and tags */
export function searchCharacters(
  query: string,
  category: CharacterCategory
): JapaneseCharacterEntry[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return getCharactersByCategory(category);

  const pool = getCharactersByCategory(category);

  return pool.filter((entry) => {
    // Match char exactly
    if (entry.char === trimmed) return true;

    // Match reading
    if (entry.reading && entry.reading.toLowerCase().includes(trimmed)) return true;

    // Match romaji
    if (entry.romaji && entry.romaji.toLowerCase().includes(trimmed)) return true;

    // Match group
    if (entry.group && entry.group.toLowerCase().includes(trimmed)) return true;

    // Match tags
    if (entry.tags && entry.tags.some((t) => t.toLowerCase().includes(trimmed))) return true;

    // Match id
    if (entry.id.toLowerCase().includes(trimmed)) return true;

    return false;
  });
}
