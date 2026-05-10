/**
 * generate-kanji-index.mjs
 * Scans /public/kanjivg/*.svg, cross-references Jouyou and JLPT source data,
 * and outputs src/data/generated/{kanjiIndex,kanjiGroups,generationReport}.json
 *
 * Run: node scripts/generate-kanji-index.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// ── Paths ─────────────────────────────────────────────────────────────────────
const KANJIVG_DIR   = join(root, 'public', 'kanjivg');
const JOYO_SRC      = join(root, 'src', 'data', 'source', 'joyoKanji.json');
const JLPT_SRC      = join(root, 'src', 'data', 'source', 'jlptKanji.json');
const OUT_DIR       = join(root, 'src', 'data', 'generated');

// ── Supplementary readings lookup (for the 46 known local kanji) ──────────────
const READINGS = {
  '一': { reading: 'いち/ひと', romaji: 'ichi' },
  '二': { reading: 'に/ふた',   romaji: 'ni'   },
  '三': { reading: 'さん/み',   romaji: 'san'  },
  '四': { reading: 'し/よん',   romaji: 'shi'  },
  '五': { reading: 'ご/いつ',   romaji: 'go'   },
  '六': { reading: 'ろく',      romaji: 'roku' },
  '七': { reading: 'しち/なな', romaji: 'shichi' },
  '八': { reading: 'はち',      romaji: 'hachi' },
  '九': { reading: 'きゅう/く', romaji: 'kyuu' },
  '十': { reading: 'じゅう',    romaji: 'juu'  },
  '百': { reading: 'ひゃく',    romaji: 'hyaku' },
  '千': { reading: 'せん',      romaji: 'sen'  },
  '万': { reading: 'まん',      romaji: 'man'  },
  '日': { reading: 'にち/ひ',   romaji: 'nichi' },
  '月': { reading: 'げつ/つき', romaji: 'getsu' },
  '火': { reading: 'か/ひ',     romaji: 'ka'   },
  '水': { reading: 'すい/みず', romaji: 'sui'  },
  '木': { reading: 'もく/き',   romaji: 'moku' },
  '金': { reading: 'きん/かね', romaji: 'kin'  },
  '土': { reading: 'ど/つち',   romaji: 'do'   },
  '山': { reading: 'さん/やま', romaji: 'san'  },
  '川': { reading: 'せん/かわ', romaji: 'sen'  },
  '田': { reading: 'でん/た',   romaji: 'den'  },
  '人': { reading: 'じん/ひと', romaji: 'jin'  },
  '口': { reading: 'こう/くち', romaji: 'kou'  },
  '目': { reading: 'もく/め',   romaji: 'moku' },
  '耳': { reading: 'じ/みみ',   romaji: 'ji'   },
  '手': { reading: 'しゅ/て',   romaji: 'shu'  },
  '足': { reading: 'そく/あし', romaji: 'soku' },
  '大': { reading: 'だい/おお', romaji: 'dai'  },
  '小': { reading: 'しょう/ちい', romaji: 'shou' },
  '中': { reading: 'ちゅう/なか', romaji: 'chuu' },
  '上': { reading: 'じょう/うえ', romaji: 'jou' },
  '下': { reading: 'か/した',   romaji: 'ka'   },
  '左': { reading: 'さ/ひだり', romaji: 'sa'   },
  '右': { reading: 'う/みぎ',   romaji: 'u'    },
  '年': { reading: 'ねん/とし', romaji: 'nen'  },
  '先': { reading: 'せん/さき', romaji: 'sen'  },
  '生': { reading: 'せい/い',   romaji: 'sei'  },
  '学': { reading: 'がく/まな', romaji: 'gaku' },
  '校': { reading: 'こう',      romaji: 'kou'  },
  '本': { reading: 'ほん/もと', romaji: 'hon'  },
  '語': { reading: 'ご/かた',   romaji: 'go'   },
  '感': { reading: 'かん',      romaji: 'kan'  },
  '張': { reading: 'ちょう/は', romaji: 'chou' },
  '緊': { reading: 'きん',      romaji: 'kin'  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert 5-digit hex filename (without .svg) to Unicode code point integer */
function hexToCodePoint(hex) {
  return parseInt(hex, 16);
}

/**
 * Returns true if a code point is a CJK kanji character we want to index.
 * Includes: CJK Unified, CJK Extension A/B/C/D/E/F, CJK Compatibility Ideographs.
 * Excludes: ASCII, Latin, Hiragana, Katakana, CJK Symbols, Bopomofo, etc.
 */
function isIndexableKanji(cp) {
  return (
    (cp >= 0x4E00 && cp <= 0x9FFF) ||   // CJK Unified Ideographs (main block ~20902 chars)
    (cp >= 0x3400 && cp <= 0x4DBF) ||   // CJK Extension A
    (cp >= 0xF900 && cp <= 0xFAFF) ||   // CJK Compatibility Ideographs
    (cp >= 0x20000 && cp <= 0x2A6DF) || // CJK Extension B
    (cp >= 0x2A700 && cp <= 0x2CEAF) || // CJK Extension C/D/E
    (cp >= 0x2CEB0 && cp <= 0x2EBEF)    // CJK Extension F
  );
}

/** Convert code point integer to 5-digit padded hex string */
function cpToHex(cp) {
  return cp.toString(16).padStart(5, '0');
}

// ── Load source data ──────────────────────────────────────────────────────────

const joyoSource = JSON.parse(readFileSync(JOYO_SRC, 'utf8'));
const jlptSource  = JSON.parse(readFileSync(JLPT_SRC, 'utf8'));

/** Map: char -> { grade } */
const joyoMap = new Map(joyoSource.items.map(item => [item.char, item.grade]));

/** Map: char -> JLPT level string */
const jlptMap = new Map();
const jlptDuplicates = [];
for (const [level, chars] of Object.entries(jlptSource.levels)) {
  for (const char of chars) {
    if (jlptMap.has(char)) {
      jlptDuplicates.push({ char, levels: [jlptMap.get(char), level] });
      // Keep easier level (N5 < N4 < N3 < N2 < N1)
      const order = ['N5','N4','N3','N2','N1'];
      const existing = jlptMap.get(char);
      if (order.indexOf(level) < order.indexOf(existing)) {
        jlptMap.set(char, level);
      }
    } else {
      jlptMap.set(char, level);
    }
  }
}

// ── Scan KanjiVG directory ────────────────────────────────────────────────────

const allSvgFiles = readdirSync(KANJIVG_DIR).filter(f => f.endsWith('.svg'));
const skipped = [];
const entries = [];

for (const file of allSvgFiles) {
  const hexStr = file.replace('.svg', '');

  // Validate: must be exactly 5 hex chars
  if (!/^[0-9a-f]{5}$/.test(hexStr)) {
    skipped.push({ file, reason: 'filename is not 5-hex-char format' });
    continue;
  }

  const cp = hexToCodePoint(hexStr);

  // Skip non-kanji code points
  if (!isIndexableKanji(cp)) {
    const rangeNote =
      cp <= 0x007F ? 'ASCII' :
      cp >= 0x3040 && cp <= 0x309F ? 'hiragana (kana pipeline)' :
      cp >= 0x30A0 && cp <= 0x30FF ? 'katakana (kana pipeline)' :
      `non-kanji (U+${hexStr.toUpperCase()})`;
    skipped.push({ file, reason: rangeNote });
    continue;
  }

  // Attempt to convert code point to character
  let char;
  try {
    char = String.fromCodePoint(cp);
  } catch {
    skipped.push({ file, reason: `invalid code point 0x${hexStr}` });
    continue;
  }

  // Classify
  const isJouyou = joyoMap.has(char);
  const jouyouGrade = isJouyou ? joyoMap.get(char) : null;
  const jlptLevel = jlptMap.get(char) ?? null;

  const categories = ['all-kanjivg'];
  if (isJouyou)   categories.push('jouyou');
  if (jlptLevel)  categories.push(`jlpt-${jlptLevel.toLowerCase()}`);
  if (!isJouyou && !jlptLevel) categories.push('other-kanjivg');

  const tags = ['kanji', 'kanjivg'];
  if (isJouyou)  tags.push('joyo');
  if (jlptLevel) tags.push(jlptLevel.toLowerCase());
  if (!isJouyou && !jlptLevel) tags.push('other');

  // Determine group label
  let group;
  if (jlptLevel)       group = `JLPT ${jlptLevel}`;
  else if (isJouyou)   group = 'Jouyou';
  else                  group = 'Other KanjiVG';

  const reading = READINGS[char];

  entries.push({
    id: `kanji-${char}`,
    char,
    type: 'kanji',
    reading:  reading?.reading  ?? '',
    romaji:   reading?.romaji   ?? '',
    group,
    tags,
    strokeDataSource: 'kanjivg',
    codePointHex:    hexStr,
    kanjiVgFileName: file,
    isJouyou,
    jouyouGrade:     jouyouGrade ?? null,
    jlptLevel,
    categories,
  });
}

// Sort entries: N5 first, then N4…N1, then Jouyou, then Other
const levelOrder = ['N5','N4','N3','N2','N1'];
entries.sort((a, b) => {
  const la = a.jlptLevel ? levelOrder.indexOf(a.jlptLevel) : 99;
  const lb = b.jlptLevel ? levelOrder.indexOf(b.jlptLevel) : 99;
  if (la !== lb) return la - lb;
  if (a.isJouyou !== b.isJouyou) return a.isJouyou ? -1 : 1;
  return a.char.localeCompare(b.char);
});

// ── Build groups counts ───────────────────────────────────────────────────────

const kanjiGroups = {
  generatedAt: new Date().toISOString(),
  allKanjiVg: entries.length,
  jouyou:  entries.filter(e => e.isJouyou).length,
  jlptN5:  entries.filter(e => e.jlptLevel === 'N5').length,
  jlptN4:  entries.filter(e => e.jlptLevel === 'N4').length,
  jlptN3:  entries.filter(e => e.jlptLevel === 'N3').length,
  jlptN2:  entries.filter(e => e.jlptLevel === 'N2').length,
  jlptN1:  entries.filter(e => e.jlptLevel === 'N1').length,
  other:   entries.filter(e => !e.isJouyou && !e.jlptLevel).length,
};

// ── Build generation report ───────────────────────────────────────────────────

const generationReport = {
  generatedAt: new Date().toISOString(),
  kanjivgDirScanned: KANJIVG_DIR,
  totalSvgFilesFound: allSvgFiles.length,
  skippedFiles: skipped.length,
  skippedDetails: skipped,
  validKanjiIndexed: entries.length,
  joyoSourceCount: joyoSource.items.length,
  joyoCountExpected: joyoSource.countExpected,
  joyoMatchedWithKanjiVg: entries.filter(e => e.isJouyou).length,
  joyoMissingSvg: joyoSource.items
    .filter(item => !entries.find(e => e.char === item.char))
    .map(item => item.char),
  jlptCounts: {
    N5: kanjiGroups.jlptN5,
    N4: kanjiGroups.jlptN4,
    N3: kanjiGroups.jlptN3,
    N2: kanjiGroups.jlptN2,
    N1: kanjiGroups.jlptN1,
  },
  jlptMissingSvg: {
    N5: jlptSource.levels.N5.filter(c => !entries.find(e => e.char === c)),
    N4: jlptSource.levels.N4.filter(c => !entries.find(e => e.char === c)),
    N3: jlptSource.levels.N3.filter(c => !entries.find(e => e.char === c)),
    N2: jlptSource.levels.N2.filter(c => !entries.find(e => e.char === c)),
    N1: jlptSource.levels.N1.filter(c => !entries.find(e => e.char === c)),
  },
  duplicateJlptClassifications: jlptDuplicates,
  otherKanjiVg: kanjiGroups.other,
  notes: [
    'joyoKanji.json is a local subset — not the full 2136 Jouyou list.',
    'jlptKanji.json is a curated reference — not official JLPT data.',
    'Stroke order data comes from KanjiVG SVG files only.',
    'Add more SVGs to /public/kanjivg/ and re-run this script to expand coverage.',
  ],
};

// ── Write output files ────────────────────────────────────────────────────────

mkdirSync(OUT_DIR, { recursive: true });

writeFileSync(join(OUT_DIR, 'kanjiIndex.json'),       JSON.stringify(entries, null, 2), 'utf8');
writeFileSync(join(OUT_DIR, 'kanjiGroups.json'),      JSON.stringify(kanjiGroups, null, 2), 'utf8');
writeFileSync(join(OUT_DIR, 'generationReport.json'), JSON.stringify(generationReport, null, 2), 'utf8');

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('\n✅ Kanji Index Generation Complete\n');
console.log(`  SVG files scanned     : ${allSvgFiles.length}`);
console.log(`  Non-kanji skipped     : ${skipped.length}`);
console.log(`  Kanji indexed     : ${entries.length}`);
console.log(`  Jouyou matched    : ${kanjiGroups.jouyou}`);
console.log(`  JLPT N5           : ${kanjiGroups.jlptN5}`);
console.log(`  JLPT N4           : ${kanjiGroups.jlptN4}`);
console.log(`  JLPT N3           : ${kanjiGroups.jlptN3}`);
console.log(`  JLPT N2           : ${kanjiGroups.jlptN2}`);
console.log(`  JLPT N1           : ${kanjiGroups.jlptN1}`);
console.log(`  Other KanjiVG     : ${kanjiGroups.other}`);
if (jlptDuplicates.length > 0) {
  console.warn(`\n⚠ Duplicate JLPT classifications: ${JSON.stringify(jlptDuplicates)}`);
}
console.log(`\n  Output → src/data/generated/\n`);
