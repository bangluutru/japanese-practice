import kanjiIndexData from "../../data/generated/kanjiIndex.json";
import type { JapaneseCharacterEntry } from "./characterTypes";

// ============================================================
// Kanji Library — Generated from local KanjiVG SVG files
// Source: src/data/generated/kanjiIndex.json
// To regenerate: npm run generate:kanji
// ============================================================

export const kanjiLibrary = kanjiIndexData as unknown as JapaneseCharacterEntry[];
