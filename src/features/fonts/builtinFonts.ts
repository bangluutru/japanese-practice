// ============================================================
// Font Types & Built-in Font Options
// ============================================================

export interface FontOption {
  label: string;
  value: string;
}

export const builtinFonts: FontOption[] = [
  { label: "Noto Sans JP", value: '"Noto Sans JP", sans-serif' },
  { label: "Noto Serif JP", value: '"Noto Serif JP", serif' },
  { label: "System UI", value: "system-ui, sans-serif" },
  { label: "Sans-serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Yu Gothic", value: '"Yu Gothic", sans-serif' },
  { label: "Yu Mincho", value: '"Yu Mincho", serif' },
  { label: "Hiragino Sans", value: '"Hiragino Sans", sans-serif' },
  { label: "Hiragino Mincho ProN", value: '"Hiragino Mincho ProN", serif' },
];
