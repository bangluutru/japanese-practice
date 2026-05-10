import type { JapaneseCharacterEntry } from "./characterTypes";

// ============================================================
// Kanji Library — Starter set for MVP
// Designed for extension via JSON import later
// ============================================================

export const kanjiLibrary: JapaneseCharacterEntry[] = [
  // Numbers
  { id: "kanji-一", char: "一", type: "kanji", reading: "いち", romaji: "ichi", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-二", char: "二", type: "kanji", reading: "に", romaji: "ni", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-三", char: "三", type: "kanji", reading: "さん", romaji: "san", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-四", char: "四", type: "kanji", reading: "し/よん", romaji: "shi", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-五", char: "五", type: "kanji", reading: "ご", romaji: "go", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-六", char: "六", type: "kanji", reading: "ろく", romaji: "roku", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-七", char: "七", type: "kanji", reading: "しち/なな", romaji: "shichi", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-八", char: "八", type: "kanji", reading: "はち", romaji: "hachi", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-九", char: "九", type: "kanji", reading: "きゅう/く", romaji: "kyuu", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-十", char: "十", type: "kanji", reading: "じゅう", romaji: "juu", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-百", char: "百", type: "kanji", reading: "ひゃく", romaji: "hyaku", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-千", char: "千", type: "kanji", reading: "せん", romaji: "sen", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-万", char: "万", type: "kanji", reading: "まん", romaji: "man", group: "数字", tags: ["number", "n5"], strokeDataSource: "kanjivg" },

  // Nature / Time
  { id: "kanji-日", char: "日", type: "kanji", reading: "にち/ひ", romaji: "nichi", group: "自然・時間", tags: ["nature", "time", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-月", char: "月", type: "kanji", reading: "げつ/つき", romaji: "getsu", group: "自然・時間", tags: ["nature", "time", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-火", char: "火", type: "kanji", reading: "か/ひ", romaji: "ka", group: "自然・時間", tags: ["nature", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-水", char: "水", type: "kanji", reading: "すい/みず", romaji: "sui", group: "自然・時間", tags: ["nature", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-木", char: "木", type: "kanji", reading: "もく/き", romaji: "moku", group: "自然・時間", tags: ["nature", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-金", char: "金", type: "kanji", reading: "きん/かね", romaji: "kin", group: "自然・時間", tags: ["nature", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-土", char: "土", type: "kanji", reading: "ど/つち", romaji: "do", group: "自然・時間", tags: ["nature", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-山", char: "山", type: "kanji", reading: "さん/やま", romaji: "san", group: "自然・時間", tags: ["nature", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-川", char: "川", type: "kanji", reading: "せん/かわ", romaji: "sen", group: "自然・時間", tags: ["nature", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-田", char: "田", type: "kanji", reading: "でん/た", romaji: "den", group: "自然・時間", tags: ["nature", "n5"], strokeDataSource: "kanjivg" },

  // Body parts
  { id: "kanji-人", char: "人", type: "kanji", reading: "じん/ひと", romaji: "jin", group: "身体", tags: ["body", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-口", char: "口", type: "kanji", reading: "こう/くち", romaji: "kou", group: "身体", tags: ["body", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-目", char: "目", type: "kanji", reading: "もく/め", romaji: "moku", group: "身体", tags: ["body", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-耳", char: "耳", type: "kanji", reading: "じ/みみ", romaji: "ji", group: "身体", tags: ["body", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-手", char: "手", type: "kanji", reading: "しゅ/て", romaji: "shu", group: "身体", tags: ["body", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-足", char: "足", type: "kanji", reading: "そく/あし", romaji: "soku", group: "身体", tags: ["body", "n5"], strokeDataSource: "kanjivg" },

  // Common school/basic kanji
  { id: "kanji-大", char: "大", type: "kanji", reading: "だい/おお", romaji: "dai", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-小", char: "小", type: "kanji", reading: "しょう/ちい", romaji: "shou", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-中", char: "中", type: "kanji", reading: "ちゅう/なか", romaji: "chuu", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-上", char: "上", type: "kanji", reading: "じょう/うえ", romaji: "jou", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-下", char: "下", type: "kanji", reading: "か/した", romaji: "ka", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-左", char: "左", type: "kanji", reading: "さ/ひだり", romaji: "sa", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-右", char: "右", type: "kanji", reading: "う/みぎ", romaji: "u", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-年", char: "年", type: "kanji", reading: "ねん/とし", romaji: "nen", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-先", char: "先", type: "kanji", reading: "せん/さき", romaji: "sen", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-生", char: "生", type: "kanji", reading: "せい/い", romaji: "sei", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-学", char: "学", type: "kanji", reading: "がく/まな", romaji: "gaku", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-校", char: "校", type: "kanji", reading: "こう", romaji: "kou", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-本", char: "本", type: "kanji", reading: "ほん/もと", romaji: "hon", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },
  { id: "kanji-語", char: "語", type: "kanji", reading: "ご/かた", romaji: "go", group: "基本", tags: ["basic", "n5"], strokeDataSource: "kanjivg" },

  // Complex test kanji
  { id: "kanji-緊", char: "緊", type: "kanji", reading: "きん", romaji: "kin", group: "テスト", tags: ["complex", "n1"], strokeDataSource: "kanjivg" },
  { id: "kanji-張", char: "張", type: "kanji", reading: "ちょう/は", romaji: "chou", group: "テスト", tags: ["complex", "n2"], strokeDataSource: "kanjivg" },
  { id: "kanji-感", char: "感", type: "kanji", reading: "かん", romaji: "kan", group: "テスト", tags: ["complex", "n3"], strokeDataSource: "kanjivg" },
];
