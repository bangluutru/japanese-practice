import { kanjiToKanjiVgFileName } from "../kanji/kanjiVgFileName";
import { parseKanjiVgSvg } from "./kanjiVgParser";
import type { CharacterStrokeData } from "./strokeTypes";

// ============================================================
// KanjiVG Loader — Fetches and caches KanjiVG files from /public
// ============================================================

const kanjiVgCache = new Map<string, CharacterStrokeData | null>();
const pendingLoads = new Map<string, Promise<CharacterStrokeData | null>>();

function inferCharacterType(char: string): "hiragana" | "katakana" | "kanji" {
  const cp = char.codePointAt(0) ?? 0;
  if (cp >= 0x3041 && cp <= 0x309F) return "hiragana";
  if (cp >= 0x30A0 && cp <= 0x30FF) return "katakana";
  return "kanji";
}

/** Load KanjiVG data for a kanji character */
export async function loadKanjiVgData(char: string): Promise<CharacterStrokeData | null> {
  // Check cache first
  if (kanjiVgCache.has(char)) {
    return kanjiVgCache.get(char) ?? null;
  }

  // Check if already loading
  if (pendingLoads.has(char)) {
    return pendingLoads.get(char)!;
  }

  const loadPromise = (async () => {
    try {
      const filename = kanjiToKanjiVgFileName(char);
      const url = `/kanjivg/${filename}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`KanjiVG file not found for ${char}: ${url}`);
        kanjiVgCache.set(char, null);
        return null;
      }

      const svgContent = await response.text();
      const data = parseKanjiVgSvg(svgContent, char, inferCharacterType(char));
      kanjiVgCache.set(char, data);
      return data;
    } catch (error) {
      console.warn(`Failed to load KanjiVG for ${char}:`, error);
      kanjiVgCache.set(char, null);
      return null;
    } finally {
      pendingLoads.delete(char);
    }
  })();

  pendingLoads.set(char, loadPromise);
  return loadPromise;
}

/** Clear the KanjiVG cache */
export function clearKanjiVgCache(): void {
  kanjiVgCache.clear();
}
