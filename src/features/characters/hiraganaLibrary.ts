import type { JapaneseCharacterEntry } from "./characterTypes";

// ============================================================
// Hiragana Library — Full gojūon + dakuten + handakuten + small kana
// ============================================================

export const hiraganaLibrary: JapaneseCharacterEntry[] = [
  // あ行
  { id: "hiragana-a", char: "あ", type: "hiragana", reading: "あ", romaji: "a", group: "あ行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-i", char: "い", type: "hiragana", reading: "い", romaji: "i", group: "あ行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-u", char: "う", type: "hiragana", reading: "う", romaji: "u", group: "あ行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-e", char: "え", type: "hiragana", reading: "え", romaji: "e", group: "あ行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-o", char: "お", type: "hiragana", reading: "お", romaji: "o", group: "あ行", strokeDataSource: "builtin-kana" },
  // か行
  { id: "hiragana-ka", char: "か", type: "hiragana", reading: "か", romaji: "ka", group: "か行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-ki", char: "き", type: "hiragana", reading: "き", romaji: "ki", group: "か行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-ku", char: "く", type: "hiragana", reading: "く", romaji: "ku", group: "か行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-ke", char: "け", type: "hiragana", reading: "け", romaji: "ke", group: "か行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-ko", char: "こ", type: "hiragana", reading: "こ", romaji: "ko", group: "か行", strokeDataSource: "builtin-kana" },
  // さ行
  { id: "hiragana-sa", char: "さ", type: "hiragana", reading: "さ", romaji: "sa", group: "さ行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-shi", char: "し", type: "hiragana", reading: "し", romaji: "shi", group: "さ行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-su", char: "す", type: "hiragana", reading: "す", romaji: "su", group: "さ行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-se", char: "せ", type: "hiragana", reading: "せ", romaji: "se", group: "さ行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-so", char: "そ", type: "hiragana", reading: "そ", romaji: "so", group: "さ行", strokeDataSource: "builtin-kana" },
  // た行
  { id: "hiragana-ta", char: "た", type: "hiragana", reading: "た", romaji: "ta", group: "た行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-chi", char: "ち", type: "hiragana", reading: "ち", romaji: "chi", group: "た行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-tsu", char: "つ", type: "hiragana", reading: "つ", romaji: "tsu", group: "た行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-te", char: "て", type: "hiragana", reading: "て", romaji: "te", group: "た行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-to", char: "と", type: "hiragana", reading: "と", romaji: "to", group: "た行", strokeDataSource: "builtin-kana" },
  // な行
  { id: "hiragana-na", char: "な", type: "hiragana", reading: "な", romaji: "na", group: "な行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-ni", char: "に", type: "hiragana", reading: "に", romaji: "ni", group: "な行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-nu", char: "ぬ", type: "hiragana", reading: "ぬ", romaji: "nu", group: "な行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-ne", char: "ね", type: "hiragana", reading: "ね", romaji: "ne", group: "な行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-no", char: "の", type: "hiragana", reading: "の", romaji: "no", group: "な行", strokeDataSource: "builtin-kana" },
  // は行
  { id: "hiragana-ha", char: "は", type: "hiragana", reading: "は", romaji: "ha", group: "は行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-hi", char: "ひ", type: "hiragana", reading: "ひ", romaji: "hi", group: "は行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-fu", char: "ふ", type: "hiragana", reading: "ふ", romaji: "fu", group: "は行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-he", char: "へ", type: "hiragana", reading: "へ", romaji: "he", group: "は行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-ho", char: "ほ", type: "hiragana", reading: "ほ", romaji: "ho", group: "は行", strokeDataSource: "builtin-kana" },
  // ま行
  { id: "hiragana-ma", char: "ま", type: "hiragana", reading: "ま", romaji: "ma", group: "ま行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-mi", char: "み", type: "hiragana", reading: "み", romaji: "mi", group: "ま行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-mu", char: "む", type: "hiragana", reading: "む", romaji: "mu", group: "ま行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-me", char: "め", type: "hiragana", reading: "め", romaji: "me", group: "ま行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-mo", char: "も", type: "hiragana", reading: "も", romaji: "mo", group: "ま行", strokeDataSource: "builtin-kana" },
  // や行
  { id: "hiragana-ya", char: "や", type: "hiragana", reading: "や", romaji: "ya", group: "や行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-yu", char: "ゆ", type: "hiragana", reading: "ゆ", romaji: "yu", group: "や行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-yo", char: "よ", type: "hiragana", reading: "よ", romaji: "yo", group: "や行", strokeDataSource: "builtin-kana" },
  // ら行
  { id: "hiragana-ra", char: "ら", type: "hiragana", reading: "ら", romaji: "ra", group: "ら行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-ri", char: "り", type: "hiragana", reading: "り", romaji: "ri", group: "ら行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-ru", char: "る", type: "hiragana", reading: "る", romaji: "ru", group: "ら行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-re", char: "れ", type: "hiragana", reading: "れ", romaji: "re", group: "ら行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-ro", char: "ろ", type: "hiragana", reading: "ろ", romaji: "ro", group: "ら行", strokeDataSource: "builtin-kana" },
  // わ行
  { id: "hiragana-wa", char: "わ", type: "hiragana", reading: "わ", romaji: "wa", group: "わ行", strokeDataSource: "builtin-kana" },
  { id: "hiragana-wo", char: "を", type: "hiragana", reading: "を", romaji: "wo", group: "わ行", strokeDataSource: "builtin-kana" },
  // ん
  { id: "hiragana-n", char: "ん", type: "hiragana", reading: "ん", romaji: "n", group: "ん", strokeDataSource: "builtin-kana" },

  // Dakuten が行
  { id: "hiragana-ga", char: "が", type: "hiragana", reading: "が", romaji: "ga", group: "が行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-gi", char: "ぎ", type: "hiragana", reading: "ぎ", romaji: "gi", group: "が行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-gu", char: "ぐ", type: "hiragana", reading: "ぐ", romaji: "gu", group: "が行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-ge", char: "げ", type: "hiragana", reading: "げ", romaji: "ge", group: "が行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-go", char: "ご", type: "hiragana", reading: "ご", romaji: "go", group: "が行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  // ざ行
  { id: "hiragana-za", char: "ざ", type: "hiragana", reading: "ざ", romaji: "za", group: "ざ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-ji", char: "じ", type: "hiragana", reading: "じ", romaji: "ji", group: "ざ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-zu", char: "ず", type: "hiragana", reading: "ず", romaji: "zu", group: "ざ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-ze", char: "ぜ", type: "hiragana", reading: "ぜ", romaji: "ze", group: "ざ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-zo", char: "ぞ", type: "hiragana", reading: "ぞ", romaji: "zo", group: "ざ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  // だ行
  { id: "hiragana-da", char: "だ", type: "hiragana", reading: "だ", romaji: "da", group: "だ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-dji", char: "ぢ", type: "hiragana", reading: "ぢ", romaji: "dji", group: "だ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-dzu", char: "づ", type: "hiragana", reading: "づ", romaji: "dzu", group: "だ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-de", char: "で", type: "hiragana", reading: "で", romaji: "de", group: "だ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-do", char: "ど", type: "hiragana", reading: "ど", romaji: "do", group: "だ行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  // ば行
  { id: "hiragana-ba", char: "ば", type: "hiragana", reading: "ば", romaji: "ba", group: "ば行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-bi", char: "び", type: "hiragana", reading: "び", romaji: "bi", group: "ば行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-bu", char: "ぶ", type: "hiragana", reading: "ぶ", romaji: "bu", group: "ば行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-be", char: "べ", type: "hiragana", reading: "べ", romaji: "be", group: "ば行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-bo", char: "ぼ", type: "hiragana", reading: "ぼ", romaji: "bo", group: "ば行", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
  // ぱ行 (handakuten)
  { id: "hiragana-pa", char: "ぱ", type: "hiragana", reading: "ぱ", romaji: "pa", group: "ぱ行", tags: ["handakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-pi", char: "ぴ", type: "hiragana", reading: "ぴ", romaji: "pi", group: "ぱ行", tags: ["handakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-pu", char: "ぷ", type: "hiragana", reading: "ぷ", romaji: "pu", group: "ぱ行", tags: ["handakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-pe", char: "ぺ", type: "hiragana", reading: "ぺ", romaji: "pe", group: "ぱ行", tags: ["handakuten"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-po", char: "ぽ", type: "hiragana", reading: "ぽ", romaji: "po", group: "ぱ行", tags: ["handakuten"], strokeDataSource: "builtin-kana" },

  // Small kana
  { id: "hiragana-small-a", char: "ぁ", type: "hiragana", reading: "ぁ", romaji: "a", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-small-i", char: "ぃ", type: "hiragana", reading: "ぃ", romaji: "i", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-small-u", char: "ぅ", type: "hiragana", reading: "ぅ", romaji: "u", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-small-e", char: "ぇ", type: "hiragana", reading: "ぇ", romaji: "e", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-small-o", char: "ぉ", type: "hiragana", reading: "ぉ", romaji: "o", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-small-ya", char: "ゃ", type: "hiragana", reading: "ゃ", romaji: "ya", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-small-yu", char: "ゅ", type: "hiragana", reading: "ゅ", romaji: "yu", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-small-yo", char: "ょ", type: "hiragana", reading: "ょ", romaji: "yo", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },
  { id: "hiragana-small-tsu", char: "っ", type: "hiragana", reading: "っ", romaji: "tsu", group: "小文字", tags: ["small"], strokeDataSource: "builtin-kana" },

  // ゔ
  { id: "hiragana-vu", char: "ゔ", type: "hiragana", reading: "ゔ", romaji: "vu", group: "その他", tags: ["dakuten"], strokeDataSource: "builtin-kana" },
];
