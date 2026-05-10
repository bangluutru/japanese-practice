/**
 * bootstrap-kanji-sources.mjs
 *
 * Downloads kanjidic2.xml.gz from the EDRDG project (CC BY-SA 4.0),
 * parses it, and generates:
 *   src/data/source/joyoKanji.json  — full Jouyou kanji with school grades
 *   src/data/source/jlptKanji.json  — JLPT reference classification
 *
 * kanjidic2 JLPT field uses the old pre-2010 system (4=beginner, 1=advanced).
 * Mapping used:  old 4 → N5 | old 3 → N4 | old 2 → N3 | old 1 → N2
 * Note: N1 cannot be reliably distinguished from N2 using kanjidic2 alone.
 *       Characters in old level 1 that are NOT Jouyou are placed in N1.
 *       Characters in old level 1 that ARE Jouyou grade S are placed in N1.
 *       All remaining old level 1 → N2.
 *
 * License note: kanjidic2 is © James Breen and the Electronic Dictionary
 * Research and Development Group, licensed CC BY-SA 4.0.
 * See https://www.edrdg.org/edrdg/licence.html
 *
 * Run: node scripts/bootstrap-kanji-sources.mjs
 */

import { createWriteStream, writeFileSync, mkdirSync } from 'fs';
import { createGunzip } from 'zlib';
import { get } from 'https';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const OUT_DIR = join(root, 'src', 'data', 'source');

mkdirSync(OUT_DIR, { recursive: true });

const KANJIDIC2_URL = 'https://www.edrdg.org/kanjidic/kanjidic2.xml.gz';
const TMP_GZ  = '/tmp/kanjidic2.xml.gz';
const TMP_XML = '/tmp/kanjidic2.xml';

// ── Download ──────────────────────────────────────────────────────────────────

function download(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`  Downloading ${url} ...`);
    const file = createWriteStream(dest);
    get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

// ── Decompress ────────────────────────────────────────────────────────────────

async function decompress(src, dest) {
  console.log(`  Decompressing ...`);
  const { createReadStream } = await import('fs');
  const input  = createReadStream(src);
  const gunzip = createGunzip();
  const output = createWriteStream(dest);
  await pipeline(input, gunzip, output);
}

// ── Parse kanjidic2 XML ───────────────────────────────────────────────────────
// Uses simple regex parsing — no XML library needed for this predictable format.

function parseKanjidic2(xmlText) {
  const chars = [];
  // Match each <character> block
  const charRegex = /<character>([\s\S]*?)<\/character>/g;
  let m;
  while ((m = charRegex.exec(xmlText)) !== null) {
    const block = m[1];
    const literal = (block.match(/<literal>([\s\S]*?)<\/literal>/) || [])[1];
    if (!literal) continue;

    const gradeStr = (block.match(/<grade>(\d+)<\/grade>/) || [])[1];
    const jlptStr  = (block.match(/<jlpt>(\d+)<\/jlpt>/)  || [])[1];

    const grade = gradeStr ? parseInt(gradeStr) : null;
    const jlpt  = jlptStr  ? parseInt(jlptStr)  : null;

    chars.push({ char: literal, grade, jlpt });
  }
  return chars;
}

// ── Map kanjidic2 grade/jlpt to our schema ────────────────────────────────────

function toJoyouGrade(grade) {
  if (grade >= 1 && grade <= 6) return grade;
  if (grade === 8) return 'S';   // secondary-school Jouyou
  return null;                    // not Jouyou
}

function isJouyou(grade) {
  return grade !== null && (grade >= 1 && grade <= 6 || grade === 8);
}

/**
 * Map old JLPT (4=easy,1=hard) + Jouyou grade to new JLPT level.
 * N1 heuristic: old level 1, Jouyou grade S or not Jouyou at all.
 */
function toNewJlptLevel(jlpt, grade) {
  if (jlpt === 4) return 'N5';
  if (jlpt === 3) return 'N4';
  if (jlpt === 2) return 'N3';
  if (jlpt === 1) {
    // Grade S (secondary = advanced Jouyou) or non-Jouyou → N1
    // Grade 1-6 (basic Jouyou) → N2
    if (grade === null || grade === 8) return 'N1';
    return 'N2';
  }
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('\n🚀 Bootstrapping Kanji source data from kanjidic2\n');

await download(KANJIDIC2_URL, TMP_GZ);
console.log(`  Downloaded: ${TMP_GZ}`);

await decompress(TMP_GZ, TMP_XML);
console.log(`  Decompressed: ${TMP_XML}`);

console.log('  Parsing XML ...');
const { readFileSync } = await import('fs');
const xmlText = readFileSync(TMP_XML, 'utf8');
const chars = parseKanjidic2(xmlText);
console.log(`  Parsed ${chars.length} character entries`);

// ── Build Jouyou list ─────────────────────────────────────────────────────────

const joyoItems = [];
for (const { char, grade } of chars) {
  if (isJouyou(grade)) {
    joyoItems.push({ char, grade: toJoyouGrade(grade) });
  }
}
joyoItems.sort((a, b) => {
  const ga = typeof a.grade === 'number' ? a.grade : 7;
  const gb = typeof b.grade === 'number' ? b.grade : 7;
  return ga - gb || a.char.localeCompare(b.char);
});

const joyoJson = {
  source: 'kanjidic2 (EDRDG) — https://www.edrdg.org/kanjidic/kanjidic2.xml.gz',
  license: 'CC BY-SA 4.0 — https://www.edrdg.org/edrdg/licence.html',
  generatedAt: new Date().toISOString(),
  countExpected: 2136,
  countActual: joyoItems.length,
  note: 'Grade 1-6 = Kyouiku Kanji; S = secondary-school Jouyou (kanjidic2 grade 8).',
  items: joyoItems,
};

writeFileSync(join(OUT_DIR, 'joyoKanji.json'), JSON.stringify(joyoJson, null, 2), 'utf8');
console.log(`  ✓ joyoKanji.json — ${joyoItems.length} Jouyou kanji`);

// ── Build JLPT list ───────────────────────────────────────────────────────────

const jlptLevels = { N5: [], N4: [], N3: [], N2: [], N1: [] };
for (const { char, grade, jlpt } of chars) {
  const level = toNewJlptLevel(jlpt, grade);
  if (level) jlptLevels[level].push(char);
}

// Sort each level array
for (const level of Object.keys(jlptLevels)) {
  jlptLevels[level].sort((a, b) => a.localeCompare(b));
}

const jlptJson = {
  source: 'kanjidic2 (EDRDG) — JLPT field mapped from old (pre-2010) system to new N5-N1 levels',
  license: 'CC BY-SA 4.0 — https://www.edrdg.org/edrdg/licence.html',
  generatedAt: new Date().toISOString(),
  mappingNote: 'old 4→N5 | old 3→N4 | old 2→N3 | old 1 + grade S or non-Jouyou→N1 | old 1 + grade 1-6→N2',
  caveat: 'JLPT does not publish official kanji lists. These are reference classifications derived from kanjidic2.',
  counts: {
    N5: jlptLevels.N5.length,
    N4: jlptLevels.N4.length,
    N3: jlptLevels.N3.length,
    N2: jlptLevels.N2.length,
    N1: jlptLevels.N1.length,
  },
  levels: jlptLevels,
};

writeFileSync(join(OUT_DIR, 'jlptKanji.json'), JSON.stringify(jlptJson, null, 2), 'utf8');
console.log(`  ✓ jlptKanji.json — N5:${jlptLevels.N5.length} N4:${jlptLevels.N4.length} N3:${jlptLevels.N3.length} N2:${jlptLevels.N2.length} N1:${jlptLevels.N1.length}`);

console.log('\n✅ Source data bootstrap complete.\n');
console.log('  Next: npm run generate:kanji\n');
