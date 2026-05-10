import type { JapaneseCharacterEntry, KanjiGroupFilter } from "./characterTypes";
import { kanjiLibrary } from "./kanjiLibrary";

// ============================================================
// Kanji Group Filter — Returns subsets of the kanji library
// by Jouyou/JLPT classification.
// ============================================================

export interface KanjiGroupOption {
  key: KanjiGroupFilter;
  label: string;
  countKey: keyof KanjiGroupCounts;
}

export interface KanjiGroupCounts {
  allKanjiVg: number;
  jouyou: number;
  jlptN5: number;
  jlptN4: number;
  jlptN3: number;
  jlptN2: number;
  jlptN1: number;
  other: number;
}

/** All Kanji group filter options with labels */
export const KANJI_GROUP_OPTIONS: KanjiGroupOption[] = [
  { key: "jlpt-n5",    label: "JLPT N5",      countKey: "jlptN5"    },
  { key: "jlpt-n4",    label: "JLPT N4",      countKey: "jlptN4"    },
  { key: "jlpt-n3",    label: "JLPT N3",      countKey: "jlptN3"    },
  { key: "jlpt-n2",    label: "JLPT N2",      countKey: "jlptN2"    },
  { key: "jlpt-n1",    label: "JLPT N1",      countKey: "jlptN1"    },
  { key: "jouyou",     label: "Jouyou",       countKey: "jouyou"    },
  { key: "all-kanjivg",label: "All KanjiVG",  countKey: "allKanjiVg"},
  { key: "other",      label: "Other",        countKey: "other"     },
];

/** Return kanji entries for a given group filter */
export function getKanjiByGroup(group: KanjiGroupFilter): JapaneseCharacterEntry[] {
  switch (group) {
    case "all-kanjivg":  return kanjiLibrary;
    case "jouyou":       return kanjiLibrary.filter((e) => e.isJouyou);
    case "jlpt-n5":      return kanjiLibrary.filter((e) => e.jlptLevel === "N5");
    case "jlpt-n4":      return kanjiLibrary.filter((e) => e.jlptLevel === "N4");
    case "jlpt-n3":      return kanjiLibrary.filter((e) => e.jlptLevel === "N3");
    case "jlpt-n2":      return kanjiLibrary.filter((e) => e.jlptLevel === "N2");
    case "jlpt-n1":      return kanjiLibrary.filter((e) => e.jlptLevel === "N1");
    case "other":        return kanjiLibrary.filter((e) => !e.isJouyou && !e.jlptLevel);
    default:             return kanjiLibrary;
  }
}

/** Compute counts for every group (computed once at module init) */
export function getKanjiGroupCounts(): KanjiGroupCounts {
  return {
    allKanjiVg: kanjiLibrary.length,
    jouyou:     kanjiLibrary.filter((e) => e.isJouyou).length,
    jlptN5:     kanjiLibrary.filter((e) => e.jlptLevel === "N5").length,
    jlptN4:     kanjiLibrary.filter((e) => e.jlptLevel === "N4").length,
    jlptN3:     kanjiLibrary.filter((e) => e.jlptLevel === "N3").length,
    jlptN2:     kanjiLibrary.filter((e) => e.jlptLevel === "N2").length,
    jlptN1:     kanjiLibrary.filter((e) => e.jlptLevel === "N1").length,
    other:      kanjiLibrary.filter((e) => !e.isJouyou && !e.jlptLevel).length,
  };
}
