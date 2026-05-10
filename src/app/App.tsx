import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { JapaneseCharacterEntry, CharacterCategory, KanjiGroupFilter } from "../features/characters/characterTypes";
import type { WorksheetSettings, WorksheetPage } from "../features/worksheet/worksheetTypes";
import type { CharacterStrokeData } from "../features/stroke/strokeTypes";
import { searchCharacters } from "../features/characters/characterSearch";
import { parseManualInput } from "../features/characters/practiceListUtils";
import { defaultSettings } from "../features/worksheet/defaultSettings";
import { generateWorksheetPages } from "../features/worksheet/layoutEngine";
import { loadStrokeDataBatch } from "../features/stroke/strokeDataService";
import { builtinFonts } from "../features/fonts/builtinFonts";
import { exportToPdf } from "../features/export/pdfExportService";
import { WorksheetSvg } from "../features/worksheet/WorksheetSvg";
import { hasKanaStrokeData } from "../features/stroke/kanaStrokeData";
import { getKanjiByGroup, getKanjiGroupCounts, KANJI_GROUP_OPTIONS } from "../features/characters/kanjiGroups";

const DISPLAY_LIMIT = 300;

// ============================================================
// App — Main Application Component
// ============================================================

const App: React.FC = () => {
  // ── State ────────────────────────────────────────────────────────
  const [category, setCategory] = useState<CharacterCategory>("hiragana");
  const [kanjiGroup, setKanjiGroup] = useState<KanjiGroupFilter>("jlpt-n5");
  const [searchQuery, setSearchQuery] = useState("");
  const [practiceList, setPracticeList] = useState<JapaneseCharacterEntry[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [settings, setSettings] = useState<WorksheetSettings>(defaultSettings);
  const [pages, setPages] = useState<WorksheetPage[]>([]);
  const [strokeDataMap, setStrokeDataMap] = useState<Map<string, CharacterStrokeData | null>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);

  // ── Derived data ─────────────────────────────────────────────────
  const kanjiCounts = useMemo(() => getKanjiGroupCounts(), []);

  const activePool = useMemo(() => {
    if (category !== "kanji") return undefined;
    return getKanjiByGroup(kanjiGroup);
  }, [category, kanjiGroup]);

  const allSearchResults = useMemo(
    () => searchCharacters(searchQuery, category, activePool),
    [searchQuery, category, activePool]
  );

  const searchResults = allSearchResults.slice(0, DISPLAY_LIMIT);
  const isLimited = allSearchResults.length > DISPLAY_LIMIT;

  // ── Generate worksheet ───────────────────────────────────────────
  useEffect(() => {
    if (practiceList.length === 0) {
      setPages([{ pageIndex: 0, rows: [] }]);
      setStrokeDataMap(new Map());
      return;
    }

    const generateWorksheet = async () => {
      setIsLoading(true);
      const newWarnings: string[] = [];

      try {
        const dataMap = await loadStrokeDataBatch(practiceList);
        setStrokeDataMap(dataMap);

        practiceList.forEach((entry) => {
          const data = dataMap.get(entry.char);
          if (!data) {
            if (entry.type === "kanji") {
              newWarnings.push(`KanjiVG data not found for ${entry.char}. Place the file in /public/kanjivg/`);
            } else if (
              (entry.type === "hiragana" || entry.type === "katakana") &&
              !hasKanaStrokeData(entry.char)
            ) {
              newWarnings.push(`Stroke data not yet available for ${entry.char}`);
            }
          }
        });

        const generatedPages = generateWorksheetPages(practiceList, dataMap, settings);
        setPages(generatedPages);
      } catch (error) {
        console.error("Error generating worksheet:", error);
        newWarnings.push("Error generating worksheet. Please try again.");
      } finally {
        setWarnings(newWarnings);
        setIsLoading(false);
      }
    };

    generateWorksheet();
  }, [practiceList, settings]);

  // ── Handlers ─────────────────────────────────────────────────────
  const addCharacter = useCallback((entry: JapaneseCharacterEntry) => {
    setPracticeList((prev) => [...prev, entry]);
  }, []);

  const removeCharacter = useCallback((index: number) => {
    setPracticeList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearList = useCallback(() => {
    setPracticeList([]);
    setWarnings([]);
  }, []);

  const handleAddManualInput = useCallback(() => {
    if (!manualInput.trim()) return;
    const entries = parseManualInput(manualInput);
    const unsupported = entries.filter((e) => e.type === "unsupported");
    if (unsupported.length > 0) {
      setWarnings((prev) => [
        ...prev,
        `Unsupported characters skipped: ${unsupported.map((e) => e.char).join(", ")}`,
      ]);
    }
    const supported = entries.filter((e) => e.type !== "unsupported");
    setPracticeList((prev) => [...prev, ...supported]);
    setManualInput("");
  }, [manualInput]);

  const handleExportPdf = useCallback(async () => {
    const svgElements = svgRefs.current.filter(Boolean) as SVGSVGElement[];
    if (svgElements.length === 0) {
      setWarnings(["No pages to export"]);
      return;
    }

    setIsExporting(true);
    try {
      await exportToPdf(svgElements, settings);
    } catch (error) {
      console.error("PDF export error:", error);
      setWarnings((prev) => [...prev, `PDF export failed: ${(error as Error).message}`]);
    } finally {
      setIsExporting(false);
    }
  }, [settings]);

  const updateSetting = useCallback(
    <K extends keyof WorksheetSettings>(key: K, value: WorksheetSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const categories: { key: CharacterCategory; label: string; icon: string }[] = [
    { key: "hiragana", label: "Hiragana", icon: "あ" },
    { key: "katakana", label: "Katakana", icon: "ア" },
    { key: "kanji", label: "Kanji", icon: "漢" },
    { key: "all", label: "All", icon: "全" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background antialiased">

      {/* ==================== LEFT SIDEBAR ==================== */}
      <aside className="w-80 bg-surface-container border-r border-outline-variant flex flex-col h-full flex-shrink-0 z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-high/50 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-primary tracking-tight leading-tight">練習帳</h1>
          <h2 className="text-sm font-semibold text-on-surface">Practice Sheet Builder</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Generate printable Japanese writing worksheets</p>
        </div>

        {/* Scrollable area */}
        <div className="flex flex-col gap-4 p-4 overflow-y-auto custom-scrollbar flex-grow">

          {/* Category tabs */}
          <nav className="flex space-x-1 bg-surface-variant/30 p-1 rounded-xl border border-outline-variant/30">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setCategory(cat.key); setSearchQuery(""); setKanjiGroup("jlpt-n5"); }}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg font-bold transition-all ${
                  category === cat.key
                    ? "bg-primary-container text-on-primary-container shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
                }`}
              >
                <span
                  className="text-lg leading-none mb-1"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {cat.icon}
                </span>
                <span className="text-[11px] font-medium">{cat.label}</span>
              </button>
            ))}
          </nav>

          {/* Kanji JLPT group filter */}
          {category === "kanji" && (
            <div className="bg-surface-container-highest/40 border border-outline-variant/40 rounded-lg p-2.5">
              <p className="text-[10px] text-on-surface-variant mb-2 font-semibold uppercase tracking-wider">
                Kanji Level
              </p>
              <div className="flex flex-wrap gap-1">
                {KANJI_GROUP_OPTIONS.map((opt) => {
                  const count = kanjiCounts[opt.countKey];
                  const isActive = kanjiGroup === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => { setKanjiGroup(opt.key); setSearchQuery(""); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                        isActive
                          ? "bg-primary-container text-on-primary-container"
                          : count === 0
                            ? "text-on-surface-variant opacity-40 cursor-default"
                            : "text-on-surface-variant hover:bg-surface-variant border border-outline-variant"
                      }`}
                      disabled={count === 0 && !isActive}
                      title={`${opt.label}: ${count} kanji`}
                    >
                      {opt.label}
                      <span className="ml-1 opacity-60">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search: あ, a, ka, n5, joyo..."
              className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
            />
            <p className="text-[10px] text-on-surface-variant mt-1.5">
              {isLimited
                ? `Showing first ${DISPLAY_LIMIT} of ${allSearchResults.length} — use search to narrow`
                : `${searchResults.length} character${searchResults.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {/* Character grid */}
          <div className="grid grid-cols-5 gap-2 pb-4">
            {searchResults.map((entry) => (
              <button
                key={entry.id}
                onClick={() => addCharacter(entry)}
                title={`${entry.char} (${entry.romaji || ""})`}
                className="aspect-square flex flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-highest hover:bg-surface-variant hover:border-primary/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span
                  className="text-xl text-on-surface group-hover:text-primary transition-colors leading-none"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {entry.char}
                </span>
                {entry.romaji && (
                  <span className="text-[10px] text-on-surface-variant mt-1 truncate w-full text-center px-1">
                    {entry.romaji}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom: Manual input + Practice list */}
        <div className="border-t border-outline-variant bg-surface-container p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-on-surface-variant mb-2">
              Manual Input
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddManualInput()}
                placeholder="Type: あア緊張感"
                className="flex-1 bg-surface-container-highest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-on-surface-variant/50 text-on-surface"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              />
              <button
                onClick={handleAddManualInput}
                className="bg-primary-container text-white px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] font-medium text-on-surface-variant">
                Practice List ({practiceList.length})
              </span>
              {practiceList.length > 0 && (
                <button
                  onClick={clearList}
                  className="text-primary hover:text-primary-fixed text-xs font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            {practiceList.length === 0 ? (
              <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg p-4 min-h-[72px] flex items-center justify-center">
                <span className="text-sm text-on-surface-variant italic text-center">
                  Click characters above or type manually to add
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 max-h-[96px] overflow-y-auto custom-scrollbar">
                {practiceList.map((entry, idx) => (
                  <div
                    key={`${entry.id}-${idx}`}
                    className="group relative flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container-highest border border-outline-variant text-sm hover:border-error/60 transition-colors cursor-pointer"
                    onClick={() => removeCharacter(idx)}
                    title="Click to remove"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    <span className="text-on-surface">{entry.char}</span>
                    <span className="hidden group-hover:inline text-[9px] text-error">✕</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ==================== MAIN AREA ==================== */}
      <main className="flex-1 bg-background flex flex-col min-w-0 relative">
        {/* Toolbar */}
        <header className="h-16 bg-surface-container-low border-b border-outline-variant flex justify-between items-center px-12 shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "22px" }}>preview</span>
            <h2 className="text-lg font-bold text-on-surface">Worksheet Preview</h2>
            {isLoading && (
              <span className="text-xs text-primary animate-pulse ml-2">Generating...</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface-variant text-sm font-medium cursor-not-allowed opacity-50"
              title="DOCX export coming soon"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>description</span>
              DOCX (Coming Soon)
            </button>
            <button
              onClick={handleExportPdf}
              disabled={practiceList.length === 0 || isExporting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary-container text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>picture_as_pdf</span>
              {isExporting ? "Exporting..." : "Export PDF"}
            </button>
          </div>
        </header>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mx-4 mt-3 p-3 rounded-lg bg-error-container/20 border border-error/30 flex-shrink-0">
            <div className="flex items-start gap-2">
              <span className="text-error text-sm mt-0.5">⚠</span>
              <div className="flex-1">
                {warnings.map((w, i) => (
                  <p key={i} className="text-xs text-on-error-container">{w}</p>
                ))}
              </div>
              <button
                onClick={() => setWarnings([])}
                className="text-error hover:text-on-error-container text-xs transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Canvas area */}
        <div className="flex-1 overflow-auto p-8 flex flex-col items-center gap-6 genkouyoushi-grid">
          {practiceList.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center text-center max-w-md bg-surface-container/80 backdrop-blur-md p-8 rounded-2xl border border-outline-variant shadow-lg">
                <div className="w-16 h-16 bg-surface-variant rounded-2xl flex items-center justify-center mb-6 relative">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "40px" }}>edit_document</span>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary-container rounded-full flex items-center justify-center border-2 border-surface-container">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: "14px" }}>add</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">No characters selected</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Select characters from the library on the left, or type Japanese characters manually to generate your practice worksheet.
                </p>
              </div>
            </div>
          ) : (
            pages.map((page, pageIdx) => (
              <div
                key={pageIdx}
                className="a4-page-shadow rounded-lg overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: settings.orientation === "portrait" ? "620px" : "860px",
                  aspectRatio: settings.orientation === "portrait" ? "210 / 297" : "297 / 210",
                  flexShrink: 0,
                }}
              >
                <WorksheetSvg
                  ref={(el: SVGSVGElement | null) => { svgRefs.current[pageIdx] = el; }}
                  page={page}
                  settings={settings}
                  strokeDataMap={strokeDataMap}
                  style={{ width: "100%", height: "100%", display: "block" }}
                />
              </div>
            ))
          )}
        </div>
      </main>

      {/* ==================== RIGHT SIDEBAR ==================== */}
      <aside className="w-80 bg-surface-container border-l border-outline-variant flex flex-col h-full flex-shrink-0 z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.15)]">
        {/* Settings header */}
        <div className="p-4 border-b border-outline-variant flex items-center gap-3 bg-surface-container-high/50 backdrop-blur-sm">
          <div className="w-8 h-8 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>settings</span>
          </div>
          <h2 className="text-lg font-semibold text-secondary">Settings</h2>
        </div>

        {/* Settings content */}
        <div className="flex flex-col p-4 overflow-y-auto custom-scrollbar flex-grow gap-6 pb-8">

          {/* Layout */}
          <SettingSection icon="crop_rotate" label="Layout">
            <div>
              <label className="block text-[13px] font-medium text-on-surface-variant mb-2">
                Orientation
              </label>
              <SelectField
                value={settings.orientation}
                onChange={(v) => updateSetting("orientation", v as "portrait" | "landscape")}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </SelectField>
            </div>
            <SliderSetting
              label="Margin"
              displayValue={`${settings.marginMm}mm`}
              min={5}
              max={25}
              inputValue={settings.marginMm}
              onChange={(v) => updateSetting("marginMm", v)}
            />
          </SettingSection>

          {/* Grid Details */}
          <SettingSection icon="grid_on" label="Grid Details">
            <SliderSetting
              label="Cell Size"
              displayValue={`${settings.cellSizeMm}mm`}
              min={12}
              max={30}
              inputValue={settings.cellSizeMm}
              onChange={(v) => updateSetting("cellSizeMm", v)}
            />
            <SliderSetting
              label="Guide Lines Opacity"
              displayValue={`${Math.round(settings.guideLineOpacity * 100)}%`}
              min={10}
              max={80}
              inputValue={Math.round(settings.guideLineOpacity * 100)}
              onChange={(v) => updateSetting("guideLineOpacity", v / 100)}
            />
          </SettingSection>

          {/* Practice Content */}
          <SettingSection icon="draw" label="Practice Content">
            <SliderSetting
              label="Blank Practice Cells"
              displayValue={String(settings.blankPracticeCells)}
              min={0}
              max={12}
              inputValue={settings.blankPracticeCells}
              onChange={(v) => updateSetting("blankPracticeCells", v)}
            />
            <SliderSetting
              label="Trace Cells"
              displayValue={String(settings.traceCells)}
              min={0}
              max={4}
              inputValue={settings.traceCells}
              onChange={(v) => updateSetting("traceCells", v)}
            />
            <SliderSetting
              label="Trace Opacity"
              displayValue={`${Math.round(settings.traceOpacity * 100)}%`}
              min={5}
              max={60}
              inputValue={Math.round(settings.traceOpacity * 100)}
              onChange={(v) => updateSetting("traceOpacity", v / 100)}
            />
            <SliderSetting
              label="Max Progressive Steps"
              displayValue={settings.maxProgressiveCells === "all" ? "All" : String(settings.maxProgressiveCells)}
              min={0}
              max={12}
              inputValue={settings.maxProgressiveCells === "all" ? 12 : settings.maxProgressiveCells}
              onChange={(v) => updateSetting("maxProgressiveCells", v >= 12 ? "all" : v)}
            />
            {/* Show stroke numbers */}
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={settings.showStrokeNumbers}
                  onChange={(e) => updateSetting("showStrokeNumbers", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 bg-surface-container-highest border border-outline-variant rounded peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                <span
                  className="material-symbols-outlined absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                  style={{ fontSize: "14px", color: "#1d00a5" }}
                >
                  check
                </span>
              </div>
              <span className="ml-3 text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                Show Stroke Numbers
              </span>
            </label>
          </SettingSection>

          {/* Typography */}
          <SettingSection icon="format_size" label="Typography">
            <div>
              <label className="block text-[13px] font-medium text-on-surface-variant mb-2">Font</label>
              <SelectField
                value={settings.selectedFontFamily}
                onChange={(v) => updateSetting("selectedFontFamily", v)}
              >
                {builtinFonts.map((font) => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </SelectField>
            </div>
            <div className="bg-surface-variant/30 border border-primary/20 rounded-lg p-3 flex gap-3">
              <span className="material-symbols-outlined text-primary shrink-0 mt-0.5" style={{ fontSize: "18px" }}>info</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Font affects sample and trace characters only. Stroke order uses standard stroke data (KanjiVG / built-in kana).
              </p>
            </div>
          </SettingSection>

        </div>
      </aside>
    </div>
  );
};

// ============================================================
// Helper Components
// ============================================================

const SettingSection: React.FC<{
  icon: string;
  label: string;
  children: React.ReactNode;
}> = ({ icon, label, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/30 text-primary">
      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{icon}</span>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider">{label}</h3>
    </div>
    {children}
  </div>
);

const SliderSetting: React.FC<{
  label: string;
  displayValue: string;
  min: number;
  max: number;
  step?: number;
  inputValue: number;
  onChange: (v: number) => void;
}> = ({ label, displayValue, min, max, step = 1, inputValue, onChange }) => (
  <div>
    <div className="flex justify-between mb-2">
      <label className="text-[13px] font-medium text-on-surface-variant">{label}</label>
      <span className="text-xs text-primary font-medium">{displayValue}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={inputValue}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  </div>
);

const SelectField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}> = ({ value, onChange, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full pl-3 pr-10 py-2 text-sm bg-surface-container-highest border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-on-surface appearance-none cursor-pointer transition-colors hover:border-outline"
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant">
      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>expand_more</span>
    </div>
  </div>
);

export default App;
