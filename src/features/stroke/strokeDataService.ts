import type { CharacterStrokeData } from "./strokeTypes";
import type { JapaneseCharacterEntry } from "../characters/characterTypes";
import { getKanaStrokeData } from "./kanaStrokeData";
import { loadKanjiVgData } from "./kanjiVgLoader";

// ============================================================
// Stroke Data Service — Unified access to stroke data
// ============================================================

/** Load stroke data for a character entry */
export async function loadStrokeData(
  entry: JapaneseCharacterEntry
): Promise<CharacterStrokeData | null> {
  if (entry.type === "hiragana" || entry.type === "katakana") {
    // Try built-in kana stroke data first (instant, no network)
    const kanaData = getKanaStrokeData(entry.char);
    if (kanaData) return kanaData;

    // Fall back to KanjiVG (has full hiragana + katakana coverage)
    return loadKanjiVgData(entry.char);
  }

  if (entry.type === "kanji") {
    // Load from KanjiVG
    return loadKanjiVgData(entry.char);
  }

  return null;
}

/** Load stroke data for multiple characters in parallel */
export async function loadStrokeDataBatch(
  entries: JapaneseCharacterEntry[]
): Promise<Map<string, CharacterStrokeData | null>> {
  const results = new Map<string, CharacterStrokeData | null>();

  const promises = entries.map(async (entry) => {
    const data = await loadStrokeData(entry);
    results.set(entry.char, data);
  });

  await Promise.all(promises);
  return results;
}
