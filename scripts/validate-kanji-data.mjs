/**
 * validate-kanji-data.mjs
 * Validates the generated kanjiIndex.json against schema rules and SVG file presence.
 * Run: node scripts/validate-kanji-data.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const INDEX_PATH  = join(root, 'src', 'data', 'generated', 'kanjiIndex.json');
const GROUPS_PATH = join(root, 'src', 'data', 'generated', 'kanjiGroups.json');
const KANJIVG_DIR = join(root, 'public', 'kanjivg');

let errors   = 0;
let warnings = 0;
const report = [];

function fail(msg)  { errors++;   report.push(`  ✗ FAIL  : ${msg}`); }
function warn(msg)  { warnings++; report.push(`  ⚠ WARN  : ${msg}`); }
function pass(msg)  {             report.push(`  ✓ PASS  : ${msg}`); }
function info(msg)  {             report.push(`  ℹ INFO  : ${msg}`); }

// 1. kanjiIndex.json exists
if (!existsSync(INDEX_PATH)) {
  fail('kanjiIndex.json not found — run: node scripts/generate-kanji-index.mjs');
  console.log(report.join('\n'));
  console.log('\n❌ FAIL (0/1 checks passed)\n');
  process.exit(1);
}
pass('kanjiIndex.json exists');

// 2. kanjiGroups.json exists
if (!existsSync(GROUPS_PATH)) {
  warn('kanjiGroups.json not found');
} else {
  pass('kanjiGroups.json exists');
}

// 3. Parse index
let index;
try {
  index = JSON.parse(readFileSync(INDEX_PATH, 'utf8'));
} catch (e) {
  fail(`kanjiIndex.json is not valid JSON: ${e.message}`);
  console.log(report.join('\n'));
  process.exit(1);
}
pass(`kanjiIndex.json parsed — ${index.length} entries`);

// 4. Array check
if (!Array.isArray(index)) {
  fail('kanjiIndex.json top-level is not an array');
  console.log(report.join('\n'));
  process.exit(1);
}

// 5. No duplicate chars
const charSet = new Set();
const dupeChars = [];
for (const entry of index) {
  if (charSet.has(entry.char)) dupeChars.push(entry.char);
  charSet.add(entry.char);
}
if (dupeChars.length > 0) {
  fail(`Duplicate chars found: ${dupeChars.join(', ')}`);
} else {
  pass('No duplicate chars');
}

// 6. Required fields per entry
const requiredFields = ['id', 'char', 'type', 'strokeDataSource', 'codePointHex', 'kanjiVgFileName'];
let missingFieldCount = 0;
let wrongTypeCount = 0;
let missingSvgCount = 0;

for (const entry of index) {
  for (const field of requiredFields) {
    if (entry[field] === undefined || entry[field] === null || entry[field] === '') {
      missingFieldCount++;
      warn(`Entry "${entry.char}" missing field: ${field}`);
    }
  }
  if (entry.type !== 'kanji') {
    wrongTypeCount++;
    warn(`Entry "${entry.char}" has type="${entry.type}", expected "kanji"`);
  }
  if (entry.strokeDataSource !== 'kanjivg') {
    wrongTypeCount++;
    warn(`Entry "${entry.char}" has strokeDataSource="${entry.strokeDataSource}", expected "kanjivg"`);
  }
  // 7. SVG file exists on disk
  const svgPath = join(KANJIVG_DIR, entry.kanjiVgFileName);
  if (!existsSync(svgPath)) {
    missingSvgCount++;
    fail(`SVG file missing for "${entry.char}": ${entry.kanjiVgFileName}`);
  }
}

if (missingFieldCount === 0) pass('All entries have required fields');
if (wrongTypeCount === 0)    pass('All entries have correct type/strokeDataSource');
if (missingSvgCount === 0)   pass('All kanjiVgFileName references exist in /public/kanjivg/');

// 8. Classification stats
const jouyouCount = index.filter(e => e.isJouyou).length;
const n5 = index.filter(e => e.jlptLevel === 'N5').length;
const n4 = index.filter(e => e.jlptLevel === 'N4').length;
const n3 = index.filter(e => e.jlptLevel === 'N3').length;
const n2 = index.filter(e => e.jlptLevel === 'N2').length;
const n1 = index.filter(e => e.jlptLevel === 'N1').length;
const other = index.filter(e => !e.isJouyou && !e.jlptLevel).length;

info(`Jouyou matched : ${jouyouCount}`);
info(`JLPT N5        : ${n5}`);
info(`JLPT N4        : ${n4}`);
info(`JLPT N3        : ${n3}`);
info(`JLPT N2        : ${n2}`);
info(`JLPT N1        : ${n1}`);
info(`Other KanjiVG  : ${other}`);

if (jouyouCount === 0) warn('No Jouyou kanji found — check joyoKanji.json');
if (n5 === 0 && n4 === 0 && n3 === 0 && n2 === 0 && n1 === 0) {
  warn('No JLPT classifications found — check jlptKanji.json');
}

// ── Final result ──────────────────────────────────────────────────────────────

console.log('\n📋 Kanji Data Validation Report\n');
console.log(report.join('\n'));
console.log('');

if (errors === 0 && warnings === 0) {
  console.log('✅ PASS — All checks passed with no warnings.\n');
  process.exit(0);
} else if (errors === 0) {
  console.log(`⚠  PARTIAL — 0 errors, ${warnings} warning(s).\n`);
  process.exit(0);
} else {
  console.log(`❌ FAIL — ${errors} error(s), ${warnings} warning(s).\n`);
  process.exit(1);
}
