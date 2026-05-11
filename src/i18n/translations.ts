export type Language = 'en' | 'ja' | 'vi';

export type Translations = {
  app: {
    subtitle: string;
    description: string;
  };
  categories: {
    hiragana: string;
    katakana: string;
    kanji: string;
    all: string;
  };
  kanjiLevel: string;
  search: {
    placeholder: string;
    showing: (shown: number, total: number) => string;
    found: (count: number) => string;
  };
  manual: {
    label: string;
    placeholder: string;
    add: string;
  };
  practiceList: {
    label: (count: number) => string;
    clearAll: string;
    empty: string;
  };
  preview: {
    title: string;
    generating: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  export: {
    docx: string;
    pdf: string;
    exporting: string;
  };
  settings: {
    title: string;
    layout: {
      title: string;
      orientation: string;
      portrait: string;
      landscape: string;
      margin: string;
    };
    grid: {
      title: string;
      cellSize: string;
      guideOpacity: string;
    };
    practice: {
      title: string;
      blankCells: string;
      traceCells: string;
      traceOpacity: string;
      maxProgressive: string;
      allSteps: string;
      showStrokeNumbers: string;
    };
    typography: {
      title: string;
      font: string;
      note: string;
    };
  };
  theme: {
    system: string;
    light: string;
    dark: string;
  };
  warnings: {
    kanjiVgNotFound: (char: string) => string;
    strokeDataUnavailable: (char: string) => string;
    worksheetError: string;
    unsupportedChars: (chars: string) => string;
    noPagesToExport: string;
    pdfFailed: (msg: string) => string;
  };
};

export const translations: Record<Language, Translations> = {
  en: {
    app: {
      subtitle: 'Japanese Practice Sheet',
      description: 'Generate printable Japanese writing worksheets',
    },
    categories: {
      hiragana: 'Hiragana',
      katakana: 'Katakana',
      kanji: 'Kanji',
      all: 'All',
    },
    kanjiLevel: 'Kanji Level',
    search: {
      placeholder: 'Search: あ, a, ka, n5, joyo...',
      showing: (shown, total) => `Showing first ${shown} of ${total} — use search to narrow`,
      found: (count) => `${count} character${count !== 1 ? 's' : ''} found`,
    },
    manual: {
      label: 'Manual Input',
      placeholder: 'Type: あア緊張感',
      add: 'Add',
    },
    practiceList: {
      label: (count) => `Practice List (${count})`,
      clearAll: 'Clear All',
      empty: 'Click characters above or type manually to add',
    },
    preview: {
      title: 'Worksheet Preview',
      generating: 'Generating...',
      emptyTitle: 'No characters selected',
      emptyDesc: 'Select characters from the library on the left, or type Japanese characters manually to generate your practice worksheet.',
    },
    export: {
      docx: 'DOCX (Coming Soon)',
      pdf: 'Export PDF',
      exporting: 'Exporting...',
    },
    settings: {
      title: 'Settings',
      layout: {
        title: 'Layout',
        orientation: 'Orientation',
        portrait: 'Portrait',
        landscape: 'Landscape',
        margin: 'Margin',
      },
      grid: {
        title: 'Grid Details',
        cellSize: 'Cell Size',
        guideOpacity: 'Guide Lines Opacity',
      },
      practice: {
        title: 'Practice Content',
        blankCells: 'Blank Practice Cells',
        traceCells: 'Trace Cells',
        traceOpacity: 'Trace Opacity',
        maxProgressive: 'Max Progressive Steps',
        allSteps: 'All',
        showStrokeNumbers: 'Show Stroke Numbers',
      },
      typography: {
        title: 'Typography',
        font: 'Font',
        note: 'Font affects sample and trace characters only. Stroke order uses standard stroke data (KanjiVG / built-in kana).',
      },
    },
    theme: {
      system: 'System',
      light: 'Light',
      dark: 'Dark',
    },
    warnings: {
      kanjiVgNotFound: (char) => `KanjiVG data not found for ${char}. Place the file in /public/kanjivg/`,
      strokeDataUnavailable: (char) => `Stroke data not yet available for ${char}`,
      worksheetError: 'Error generating worksheet. Please try again.',
      unsupportedChars: (chars) => `Unsupported characters skipped: ${chars}`,
      noPagesToExport: 'No pages to export',
      pdfFailed: (msg) => `PDF export failed: ${msg}`,
    },
  },

  ja: {
    app: {
      subtitle: '練習シート作成',
      description: '印刷可能な日本語練習シートを生成します',
    },
    categories: {
      hiragana: 'ひらがな',
      katakana: 'カタカナ',
      kanji: '漢字',
      all: 'すべて',
    },
    kanjiLevel: '漢字レベル',
    search: {
      placeholder: '検索: あ, a, ka, n5, 常用...',
      showing: (shown, total) => `${total}件中${shown}件表示 — 絞り込むには検索`,
      found: (count) => `${count}文字見つかりました`,
    },
    manual: {
      label: '手入力',
      placeholder: '入力: あア緊張感',
      add: '追加',
    },
    practiceList: {
      label: (count) => `練習リスト（${count}）`,
      clearAll: 'すべてクリア',
      empty: '上の文字をクリックするか、直接入力して追加してください',
    },
    preview: {
      title: 'プレビュー',
      generating: '生成中...',
      emptyTitle: '文字が選択されていません',
      emptyDesc: '左のライブラリから文字を選ぶか、日本語文字を直接入力して練習シートを作成してください。',
    },
    export: {
      docx: 'DOCX（準備中）',
      pdf: 'PDFを出力',
      exporting: '出力中...',
    },
    settings: {
      title: '設定',
      layout: {
        title: 'レイアウト',
        orientation: '向き',
        portrait: '縦向き',
        landscape: '横向き',
        margin: '余白',
      },
      grid: {
        title: 'グリッド詳細',
        cellSize: 'セルサイズ',
        guideOpacity: 'ガイドライン透明度',
      },
      practice: {
        title: '練習内容',
        blankCells: '空白練習セル',
        traceCells: 'なぞりセル',
        traceOpacity: 'なぞり透明度',
        maxProgressive: '最大筆順ステップ',
        allSteps: 'すべて',
        showStrokeNumbers: '筆順番号を表示',
      },
      typography: {
        title: 'フォント',
        font: 'フォント',
        note: 'フォントはサンプルとなぞり文字のみに適用されます。筆順は標準データ（KanjiVG / 組み込みかな）を使用します。',
      },
    },
    theme: {
      system: 'システム',
      light: 'ライト',
      dark: 'ダーク',
    },
    warnings: {
      kanjiVgNotFound: (char) => `${char} のKanjiVGデータが見つかりません。/public/kanjivg/ にファイルを配置してください`,
      strokeDataUnavailable: (char) => `${char} の筆順データはまだ利用できません`,
      worksheetError: '練習シートの生成中にエラーが発生しました。もう一度お試しください。',
      unsupportedChars: (chars) => `サポートされていない文字をスキップしました: ${chars}`,
      noPagesToExport: '出力するページがありません',
      pdfFailed: (msg) => `PDF出力に失敗しました: ${msg}`,
    },
  },

  vi: {
    app: {
      subtitle: 'Tạo Bài Tập Viết',
      description: 'Tạo bảng luyện viết tiếng Nhật có thể in',
    },
    categories: {
      hiragana: 'Hiragana',
      katakana: 'Katakana',
      kanji: 'Kanji',
      all: 'Tất Cả',
    },
    kanjiLevel: 'Cấp Độ Kanji',
    search: {
      placeholder: 'Tìm: あ, a, ka, n5, joyo...',
      showing: (shown, total) => `Hiển thị ${shown}/${total} — tìm kiếm để thu hẹp`,
      found: (count) => `Tìm thấy ${count} ký tự`,
    },
    manual: {
      label: 'Nhập Thủ Công',
      placeholder: 'Nhập: あア緊張感',
      add: 'Thêm',
    },
    practiceList: {
      label: (count) => `Danh Sách (${count})`,
      clearAll: 'Xóa Tất Cả',
      empty: 'Chọn ký tự ở trên hoặc nhập trực tiếp để thêm vào danh sách',
    },
    preview: {
      title: 'Xem Trước Bài Tập',
      generating: 'Đang tạo...',
      emptyTitle: 'Chưa chọn ký tự nào',
      emptyDesc: 'Chọn ký tự từ thư viện bên trái hoặc nhập ký tự tiếng Nhật để tạo bài tập viết.',
    },
    export: {
      docx: 'DOCX (Sắp Ra Mắt)',
      pdf: 'Xuất PDF',
      exporting: 'Đang xuất...',
    },
    settings: {
      title: 'Cài Đặt',
      layout: {
        title: 'Bố Cục',
        orientation: 'Hướng Trang',
        portrait: 'Dọc',
        landscape: 'Ngang',
        margin: 'Lề',
      },
      grid: {
        title: 'Chi Tiết Ô',
        cellSize: 'Kích Thước Ô',
        guideOpacity: 'Độ Mờ Đường Kẻ',
      },
      practice: {
        title: 'Nội Dung Luyện Tập',
        blankCells: 'Ô Viết Trống',
        traceCells: 'Ô Tô Chữ',
        traceOpacity: 'Độ Mờ Tô Chữ',
        maxProgressive: 'Số Bước Nét Tối Đa',
        allSteps: 'Tất Cả',
        showStrokeNumbers: 'Hiển Thị Số Thứ Tự Nét',
      },
      typography: {
        title: 'Phông Chữ',
        font: 'Phông Chữ',
        note: 'Phông chữ chỉ ảnh hưởng đến ký tự mẫu và tô chữ. Thứ tự nét sử dụng dữ liệu chuẩn (KanjiVG / kana tích hợp).',
      },
    },
    theme: {
      system: 'Hệ Thống',
      light: 'Sáng',
      dark: 'Tối',
    },
    warnings: {
      kanjiVgNotFound: (char) => `Không tìm thấy dữ liệu KanjiVG cho ${char}. Đặt file vào /public/kanjivg/`,
      strokeDataUnavailable: (char) => `Dữ liệu thứ tự nét chưa có sẵn cho ${char}`,
      worksheetError: 'Lỗi khi tạo bài tập. Vui lòng thử lại.',
      unsupportedChars: (chars) => `Đã bỏ qua các ký tự không hỗ trợ: ${chars}`,
      noPagesToExport: 'Không có trang nào để xuất',
      pdfFailed: (msg) => `Xuất PDF thất bại: ${msg}`,
    },
  },
};
