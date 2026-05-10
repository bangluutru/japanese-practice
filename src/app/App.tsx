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
  // State
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

  // Kanji group counts (stable, computed once)
  const kanjiCounts = useMemo(() => getKanjiGroupCounts(), []);

  // Active pool: filtered by kanjiGroup when in kanji category
  const activePool = useMemo(() => {
    if (category !== "kanji") return undefined;
    return getKanjiByGroup(kanjiGroup);
  }, [category, kanjiGroup]);

  // Search results
  const allSearchResults = useMemo(
    () => searchCharacters(searchQuery, category, activePool),
    [searchQuery, category, activePool]
  );

  const searchResults = allSearchResults.slice(0, DISPLAY_LIMIT);
  const isLimited = allSearchResults.length > DISPLAY_LIMIT;

  // Generate worksheet whenever practice list or settings change
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
        // Load stroke data
        const dataMap = await loadStrokeDataBatch(practiceList);
        setStrokeDataMap(dataMap);

        // Check for missing data
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

        // Generate pages
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

  // Add character to practice list
  const addCharacter = useCallback((entry: JapaneseCharacterEntry) => {
    setPracticeList((prev) => [...prev, entry]);
  }, []);

  // Remove character from practice list
  const removeCharacter = useCallback((index: number) => {
    setPracticeList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Clear practice list
  const clearList = useCallback(() => {
    setPracticeList([]);
    setWarnings([]);
  }, []);

  // Add from manual input
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

  // PDF export
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

  // Update setting
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
    <div className="flex h-screen overflow-hidden">
      {/* ==================== LEFT SIDEBAR ==================== */}
      <aside className="w-[340px] min-w-[340px] flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-alt)] overflow-hidden">
        {/* App title */}
        <div className="p-4 border-b border-[var(--color-border)]">
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            練習帳 Practice Sheet Builder
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Generate printable Japanese writing worksheets
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 p-3 border-b border-[var(--color-border)]">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setCategory(cat.key); setSearchQuery(""); setKanjiGroup("jlpt-n5"); }}
              className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                category === cat.key
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              <span className="block text-base font-bold" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Kanji group sub-filter (visible only in kanji category) */}
        {category === "kanji" && (
          <div className="px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            <p className="text-[10px] text-[var(--color-text-muted)] mb-1.5 font-medium uppercase tracking-wide">
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
                        ? "bg-indigo-600 text-white"
                        : count === 0
                          ? "text-[var(--color-text-muted)] opacity-40 cursor-default"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)]"
                    }`}
                    disabled={count === 0 && !isActive}
                    title={`${opt.label}: ${count} kanji`}
                  >
                    {opt.label}
                    <span className={`ml-1 ${isActive ? "opacity-80" : "opacity-60"}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search box */}
        <div className="p-3 border-b border-[var(--color-border)]">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search: あ, a, ka, n5, joyo..."
              className="w-full px-3 py-2 pl-9 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">
            {isLimited
              ? `Showing first ${DISPLAY_LIMIT} of ${allSearchResults.length} — use search to narrow`
              : `${searchResults.length} character${searchResults.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Character grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-5 gap-1.5">
            {searchResults.map((entry) => (
              <button
                key={entry.id}
                onClick={() => addCharacter(entry)}
                className="char-btn"
                title={`${entry.char} (${entry.romaji || ""})`}
              >
                <span className="text-lg leading-none">{entry.char}</span>
                {entry.romaji && (
                  <span className="text-[9px] text-[var(--color-text-muted)] mt-0.5 truncate w-full text-center">
                    {entry.romaji}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Manual input */}
        <div className="p-3 border-t border-[var(--color-border)]">
          <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">
            Manual Input
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddManualInput()}
              placeholder="Type: あア緊張感"
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-indigo-500"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            />
            <button
              onClick={handleAddManualInput}
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Practice list */}
        <div className="border-t border-[var(--color-border)] p-3 max-h-[200px] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">
              Practice List ({practiceList.length})
            </label>
            {practiceList.length > 0 && (
              <button
                onClick={clearList}
                className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          {practiceList.length === 0 ? (
            <p className="text-[11px] text-[var(--color-text-muted)] italic">
              Click characters above or type manually to add
            </p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {practiceList.map((entry, idx) => (
                <div
                  key={`${entry.id}-${idx}`}
                  className="group relative flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm hover:border-red-400 transition-colors cursor-pointer"
                  onClick={() => removeCharacter(idx)}
                  title="Click to remove"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {entry.char}
                  <span className="hidden group-hover:inline text-[9px] text-red-400">✕</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ==================== MAIN AREA ==================== */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0f1e]">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Worksheet Preview
            </h2>
            {isLoading && (
              <span className="text-xs text-indigo-400 animate-pulse">
                Generating...
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              disabled={practiceList.length === 0 || isExporting}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isExporting ? "Exporting..." : "📄 Export PDF"}
            </button>
            <button
              disabled
              className="px-4 py-2 rounded-lg bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] text-xs font-medium cursor-not-allowed border border-[var(--color-border)]"
              title="DOCX export coming soon"
            >
              📝 DOCX (Coming Soon)
            </button>
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mx-3 mt-3 p-3 rounded-lg bg-amber-900/30 border border-amber-700/50">
            <div className="flex items-start gap-2">
              <span className="text-amber-400">⚠</span>
              <div className="flex-1">
                {warnings.map((w, i) => (
                  <p key={i} className="text-xs text-amber-300">
                    {w}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setWarnings([])}
                className="text-amber-400 hover:text-amber-300 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Preview area */}
        <div className="flex-1 overflow-auto p-6 flex flex-col items-center gap-6">
          {practiceList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center justify-center text-4xl">
                📝
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">
                  No characters selected
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-md">
                  Select characters from the library on the left, or type Japanese characters manually to generate your practice worksheet.
                </p>
              </div>
            </div>
          ) : (
            pages.map((page, pageIdx) => (
              <div key={pageIdx} className="a4-page-shadow rounded-lg overflow-hidden">
                <WorksheetSvg
                  ref={(el: SVGSVGElement | null) => { svgRefs.current[pageIdx] = el; }}
                  page={page}
                  settings={settings}
                  strokeDataMap={strokeDataMap}
                />
              </div>
            ))
          )}
        </div>
      </main>

      {/* ==================== RIGHT SIDEBAR ==================== */}
      <aside className="w-[280px] min-w-[280px] flex flex-col border-l border-[var(--color-border)] bg-[var(--color-surface-alt)] overflow-y-auto">
        <div className="p-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">⚙️ Settings</h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Orientation */}
          <SettingGroup label="Orientation">
            <select
              value={settings.orientation}
              onChange={(e) => updateSetting("orientation", e.target.value as "portrait" | "landscape")}
              className="setting-select"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </SettingGroup>

          {/* Cell size */}
          <SettingGroup label={`Cell Size: ${settings.cellSizeMm}mm`}>
            <input
              type="range"
              min={12}
              max={30}
              step={1}
              value={settings.cellSizeMm}
              onChange={(e) => updateSetting("cellSizeMm", Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </SettingGroup>

          {/* Blank cells */}
          <SettingGroup label={`Blank Practice Cells: ${settings.blankPracticeCells}`}>
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={settings.blankPracticeCells}
              onChange={(e) => updateSetting("blankPracticeCells", Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </SettingGroup>

          {/* Trace cells */}
          <SettingGroup label={`Trace Cells: ${settings.traceCells}`}>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={settings.traceCells}
              onChange={(e) => updateSetting("traceCells", Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </SettingGroup>

          {/* Max progressive cells */}
          <SettingGroup label={`Max Progressive: ${settings.maxProgressiveCells === "all" ? "All" : settings.maxProgressiveCells}`}>
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={settings.maxProgressiveCells === "all" ? 12 : settings.maxProgressiveCells}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateSetting("maxProgressiveCells", val >= 12 ? "all" : val);
              }}
              className="w-full accent-indigo-500"
            />
          </SettingGroup>

          {/* Stroke numbers */}
          <SettingGroup label="Show Stroke Numbers">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showStrokeNumbers}
                onChange={(e) => updateSetting("showStrokeNumbers", e.target.checked)}
                className="accent-indigo-500"
              />
              <span className="text-xs text-[var(--color-text-secondary)]">
                {settings.showStrokeNumbers ? "On" : "Off"}
              </span>
            </label>
          </SettingGroup>

          {/* Trace opacity */}
          <SettingGroup label={`Trace Opacity: ${Math.round(settings.traceOpacity * 100)}%`}>
            <input
              type="range"
              min={5}
              max={60}
              step={1}
              value={settings.traceOpacity * 100}
              onChange={(e) => updateSetting("traceOpacity", Number(e.target.value) / 100)}
              className="w-full accent-indigo-500"
            />
          </SettingGroup>

          {/* Guide line opacity */}
          <SettingGroup label={`Guide Lines: ${Math.round(settings.guideLineOpacity * 100)}%`}>
            <input
              type="range"
              min={10}
              max={80}
              step={1}
              value={settings.guideLineOpacity * 100}
              onChange={(e) => updateSetting("guideLineOpacity", Number(e.target.value) / 100)}
              className="w-full accent-indigo-500"
            />
          </SettingGroup>

          {/* Font selector */}
          <SettingGroup label="Font">
            <select
              value={settings.selectedFontFamily}
              onChange={(e) => updateSetting("selectedFontFamily", e.target.value)}
              className="setting-select"
            >
              {builtinFonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </SettingGroup>

          {/* Font note */}
          <div className="p-2.5 rounded-lg bg-indigo-900/20 border border-indigo-800/30">
            <p className="text-[10px] text-indigo-300 leading-relaxed">
              ℹ️ Font affects sample and trace characters only. Stroke order uses standard stroke data (KanjiVG / built-in kana).
            </p>
          </div>

          {/* Margin */}
          <SettingGroup label={`Margin: ${settings.marginMm}mm`}>
            <input
              type="range"
              min={5}
              max={25}
              step={1}
              value={settings.marginMm}
              onChange={(e) => updateSetting("marginMm", Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </SettingGroup>
        </div>
      </aside>
    </div>
  );
};

// ============================================================
// Helper Components
// ============================================================

const SettingGroup: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div>
    <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-1.5 block">
      {label}
    </label>
    {children}
  </div>
);

export default App;
