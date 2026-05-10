import type { CharacterStrokeData, StrokePath } from "./strokeTypes";

// ============================================================
// KanjiVG Parser — Extracts stroke paths from KanjiVG SVG XML
// ============================================================

/**
 * Parse KanjiVG SVG content into normalized CharacterStrokeData.
 * KanjiVG files have structure like:
 * <svg ...>
 *   <g id="kvg:StrokePaths_..." ...>
 *     <g id="kvg:0abcd" ...>
 *       <path id="kvg:0abcd-s1" d="..." />
 *       <path id="kvg:0abcd-s2" d="..." />
 *       ...
 *     </g>
 *   </g>
 * </svg>
 */
export function parseKanjiVgSvg(
  svgContent: string,
  character: string,
  characterType: "hiragana" | "katakana" | "kanji" = "kanji"
): CharacterStrokeData | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");

    // Check for parse errors
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      console.warn(`KanjiVG parse error for ${character}:`, parseError.textContent);
      return null;
    }

    const svgEl = doc.querySelector("svg");
    if (!svgEl) return null;

    const viewBox = svgEl.getAttribute("viewBox") || "0 0 109 109";

    // Find all path elements — KanjiVG has paths nested in groups
    const pathElements = doc.querySelectorAll("path");
    const strokes: StrokePath[] = [];
    let order = 1;

    pathElements.forEach((pathEl) => {
      const d = pathEl.getAttribute("d");
      const id = pathEl.getAttribute("id") || `stroke-${order}`;

      if (d) {
        const rawAttributes: Record<string, string> = {};
        for (const attr of Array.from(pathEl.attributes)) {
          rawAttributes[attr.name] = attr.value;
        }

        strokes.push({
          id,
          d,
          order,
          rawAttributes,
        });
        order++;
      }
    });

    if (strokes.length === 0) return null;

    return {
      character,
      type: characterType,
      source: "kanjivg",
      viewBox,
      strokes,
    };
  } catch (error) {
    console.warn(`Failed to parse KanjiVG SVG for ${character}:`, error);
    return null;
  }
}
