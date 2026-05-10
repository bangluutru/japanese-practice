import type { JapaneseCharacterEntry } from "./characterTypes";

// ============================================================
// Katakana Library — Full gojūon + dakuten + handakuten + small kana
// ============================================================

export const katakanaLibrary: JapaneseCharacterEntry[] = [
  // ア行
  { id: "katakana-a", char: "ア", type: "katakana", reading: "ア", romaji: "a", group: "ア行", strokeDataSource: "builtin-kana" },
  { id: "katakana-i", char: "イ", type: "katakana", reading: "イ", romaji: "i", group: "ア行", strokeDataSource: "builtin-kana" },
  { id: "katakana-u", char: "ウ", type: "katakana", reading: "ウ", romaji: "u", group: "ア行", strokeDataSource: "builtin-kana" },
  { id: "katakana-e", char: "エ", type: "katakana", reading: "エ", romaji: "e", group: "ア行", strokeDataSource: "builtin-kana" },
  { id: "katakana-o", char: "オ", type: "katakana", reading: "オ", romaji: "o", group: "ア行", strokeDataSource: "builtin-kana" },
  // カ行
  { id: "katakana-ka", char: "カ", type: "katakana", reading: "カ", romaji: "ka", group: "カ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-ki", char: "キ", type: "katakana", reading: "キ", romaji: "ki", group: "カ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-ku", char: "ク", type: "katakana", reading: "ク", romaji: "ku", group: "カ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-ke", char: "ケ", type: "katakana", reading: "ケ", romaji: "ke", group: "カ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-ko", char: "コ", type: "katakana", reading: "コ", romaji: "ko", group: "カ行", strokeDataSource: "builtin-kana" },
  // サ行
  { id: "katakana-sa", char: "サ", type: "katakana", reading: "サ", romaji: "sa", group: "サ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-shi", char: "シ", type: "katakana", reading: "シ", romaji: "shi", group: "サ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-su", char: "ス", type: "katakana", reading: "ス", romaji: "su", group: "サ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-se", char: "セ", type: "katakana", reading: "セ", romaji: "se", group: "サ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-so", char: "ソ", type: "katakana", reading: "ソ", romaji: "so", group: "サ行", strokeDataSource: "builtin-kana" },
  // タ行
  { id: "katakana-ta", char: "タ", type: "katakana", reading: "タ", romaji: "ta", group: "タ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-chi", char: "チ", type: "katakana", reading: "チ", romaji: "chi", group: "タ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-tsu", char: "ツ", type: "katakana", reading: "ツ", romaji: "tsu", group: "タ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-te", char: "テ", type: "katakana", reading: "テ", romaji: "te", group: "タ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-to", char: "ト", type: "katakana", reading: "ト", romaji: "to", group: "タ行", strokeDataSource: "builtin-kana" },
  // ナ行
  { id: "katakana-na", char: "ナ", type: "katakana", reading: "ナ", romaji: "na", group: "ナ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-ni", char: "ニ", type: "katakana", reading: "ニ", romaji: "ni", group: "ナ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-nu", char: "ヌ", type: "katakana", reading: "ヌ", romaji: "nu", group: "ナ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-ne", char: "ネ", type: "katakana", reading: "ネ", romaji: "ne", group: "ナ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-no", char: "ノ", type: "katakana", reading: "ノ", romaji: "no", group: "ナ行", strokeDataSource: "builtin-kana" },
  // ハ行
  { id: "katakana-ha", char: "ハ", type: "katakana", reading: "ハ", romaji: "ha", group: "ハ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-hi", char: "ヒ", type: "katakana", reading: "ヒ", romaji: "hi", group: "ハ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-fu", char: "フ", type: "katakana", reading: "フ", romaji: "fu", group: "ハ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-he", char: "ヘ", type: "katakana", reading: "ヘ", romaji: "he", group: "ハ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-ho", char: "ホ", type: "katakana", reading: "ホ", romaji: "ho", group: "ハ行", strokeDataSource: "builtin-kana" },
  // マ行
  { id: "katakana-ma", char: "マ", type: "katakana", reading: "マ", romaji: "ma", group: "マ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-mi", char: "ミ", type: "katakana", reading: "ミ", romaji: "mi", group: "マ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-mu", char: "ム", type: "katakana", reading: "ム", romaji: "mu", group: "マ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-me", char: "メ", type: "katakana", reading: "メ", romaji: "me", group: "マ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-mo", char: "モ", type: "katakana", reading: "モ", romaji: "mo", group: "マ行", strokeDataSource: "builtin-kana" },
  // ヤ行
  { id: "katakana-ya", char: "ヤ", type: "katakana", reading: "ヤ", romaji: "ya", group: "ヤ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-yu", char: "ユ", type: "katakana", reading: "ユ", romaji: "yu", group: "ヤ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-yo", char: "ヨ", type: "katakana", reading: "ヨ", romaji: "yo", group: "ヤ行", strokeDataSource: "builtin-kana" },
  // ラ行
  { id: "katakana-ra", char: "ラ", type: "katakana", reading: "ラ", romaji: "ra", group: "ラ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-ri", char: "リ", type: "katakana", reading: "リ", romaji: "ri", group: "ラ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-ru", char: "ル", type: "katakana", reading: "ル", romaji: "ru", group: "ラ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-re", char: "レ", type: "katakana", reading: "レ", romaji: "re", group: "ラ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-ro", char: "ロ", type: "katakana", reading: "ロ", romaji: "ro", group: "ラ行", strokeDataSource: "builtin-kana" },
  // ワ行
  { id: "katakana-wa", char: "ワ", type: "katakana", reading: "ワ", romaji: "wa", group: "ワ行", strokeDataSource: "builtin-kana" },
  { id: "katakana-wo", char: "ヲ", type: "katakana", reading: "ヲ", romaji: "wo", group: "ワ行", strokeDataSource: "builtin-kana" },
  // ン
  { id: "katakana-n", char: "ン", type: "katakana", reading: "ン", romaji: "n", group: "ン", strokeDataSource: "builtin-kana" },

  // Dakuten ガ行
  { id: "katakana-ga", char: "ガ", type: "katakana", reading: "ガ", romaji: "ga", group: "ガ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-gi", char: "ギ", type: "katakana", reading: "ギ", romaji: "gi", group: "ガ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-gu", char: "グ", type: "katakana", reading: "グ", romaji: "gu", group: "ガ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-ge", char: "ゲ", type: "katakana", reading: "ゲ", romaji: "ge", group: "ガ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-go", char: "ゴ", type: "katakana", reading: "ゴ", romaji: "go", group: "ガ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  // ザ行
  { id: "katakana-za", char: "ザ", type: "katakana", reading: "ザ", romaji: "za", group: "ザ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-ji", char: "ジ", type: "katakana", reading: "ジ", romaji: "ji", group: "ザ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-zu", char: "ズ", type: "katakana", reading: "ズ", romaji: "zu", group: "ザ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-ze", char: "ゼ", type: "katakana", reading: "ゼ", romaji: "ze", group: "ザ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-zo", char: "ゾ", type: "katakana", reading: "ゾ", romaji: "zo", group: "ザ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  // ダ行
  { id: "katakana-da", char: "ダ", type: "katakana", reading: "ダ", romaji: "da", group: "ダ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-dji", char: "ヂ", type: "katakana", reading: "ヂ", romaji: "dji", group: "ダ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-dzu", char: "ヅ", type: "katakana", reading: "ヅ", romaji: "dzu", group: "ダ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-de", char: "デ", type: "katakana", reading: "デ", romaji: "de", group: "ダ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-do", char: "ド", type: "katakana", reading: "ド", romaji: "do", group: "ダ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  // バ行
  { id: "katakana-ba", char: "バ", type: "katakana", reading: "バ", romaji: "ba", group: "バ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-bi", char: "ビ", type: "katakana", reading: "ビ", romaji: "bi", group: "バ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-bu", char: "ブ", type: "katakana", reading: "ブ", romaji: "bu", group: "バ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-be", char: "ベ", type: "katakana", reading: "ベ", romaji: "be", group: "バ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-bo", char: "ボ", type: "katakana", reading: "ボ", romaji: "bo", group: "バ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  // パ行 (handakuten)
  { id: "katakana-pa", char: "パ", type: "katakana", reading: "パ", romaji: "pa", group: "パ行", tags: ["handakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-pi", char: "ピ", type: "katakana", reading: "ピ", romaji: "pi", group: "パ行", tags: ["handakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-pu", char: "プ", type: "katakana", reading: "プ", romaji: "pu", group: "パ行", tags: ["handakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-pe", char: "ペ", type: "katakana", reading: "ペ", romaji: "pe", group: "パ行", tags: ["handakuten"], strokeDataSource: "builtin-kana" },
  { id: "katakana-po", char: "ポ", type: "katakana", reading: "ポ", romaji: "po", group: "パ行", tags: ["handakuten"], strokeDataSource: "builtin-kana" },

  // Small kana
  { id: "katakana-small-a", char: "ァ", type: "katakana", reading: "ァ", romaji: "a", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "katakana-small-i", char: "ィ", type: "katakana", reading: "ィ", romaji: "i", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "katakana-small-u", char: "ゥ", type: "katakana", reading: "ゥ", romaji: "u", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "katakana-small-e", char: "ェ", type: "katakana", reading: "ェ", romaji: "e", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "katakana-small-o", char: "ォ", type: "katakana", reading: "ォ", romaji: "o", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "katakana-small-ya", char: "ャ", type: "katakana", reading: "ャ", romaji: "ya", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "katakana-small-yu", char: "ュ", type: "katakana", reading: "ュ", romaji: "yu", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "katakana-small-yo", char: "ョ", type: "katakana", reading: "ョ", romaji: "yo", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "katakana-small-tsu", char: "ッ", type: "katakana", reading: "ッ", romaji: "tsu", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },

  // ヴ
  { id: "katakana-vu", char: "ヴ", type: "katakana", reading: "ヴ", romaji: "vu", group: "その他", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
];
