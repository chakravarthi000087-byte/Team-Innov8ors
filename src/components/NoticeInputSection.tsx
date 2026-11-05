import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  UploadCloud,
  FileCode,
  Plus,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { PRESET_NOTICES } from '../data/presets';
import { PresetNotice } from '../types/actacite';

interface NoticeInputSectionProps {
  onExtract: (text: string, title?: string, imageBase64?: string, mimeType?: string) => Promise<void>;
  onSelectPreset: (preset: PresetNotice) => void;
  isLoading: boolean;
  activePresetId?: string;
  sourceText: string;
  setSourceText: (text: string) => void;
  noticeTitleInput: string;
  setNoticeTitleInput: (title: string) => void;
}

export const NoticeInputSection: React.FC<NoticeInputSectionProps> = ({
  onExtract,
  onSelectPreset,
  isLoading,
  activePresetId,
  sourceText,
  setSourceText,
  noticeTitleInput,
  setNoticeTitleInput,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = [
    'Parsing academic notice structure and page markers...',
    'Extracting student action items, deadlines & eligibility...',
    'Pinning verbatim source quotes for evidence traceability...',
    'Evaluating Ambiguity Guardrails for missing or conflicting details...',
  ];

  // Cycling step message during loading
  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % steps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleInsertPageBreak = () => {
    // Detect highest page number
    const matches = [...sourceText.matchAll(/Page\s+(\d+)/gi)];
    const highestPage = matches.length > 0
      ? Math.max(...matches.map((m) => parseInt(m[1], 10))) + 1
      : 2;

    const pageBreak = `\n\n=== Page ${highestPage} ===\n`;
    setSourceText(sourceText + pageBreak);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFileBase64(result);
        setFileMimeType(file.type);
        setNoticeTitleInput(file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsDataURL(file);
    } else {
      // Treat as plain text or markdown
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setSourceText(text);
        setFileBase64(null);
        setFileMimeType(null);
        if (!noticeTitleInput) {
          setNoticeTitleInput(file.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceText.trim() && !fileBase64) return;
    onExtract(sourceText, noticeTitleInput || undefined, fileBase64 || undefined, fileMimeType || undefined);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8 backdrop-blur-md">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              Academic Notice Source
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Input & OCR
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Select an authentic university circular preset or paste your own circular / OCR text.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 transition"
        >
          {isExpanded ? 'Collapse Input' : 'Expand Input'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Verified Academic Circular Presets:</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-normal">
                <HelpCircle className="w-3 h-3 text-slate-500" />
                Includes intentional real-world ambiguities and exact quotes
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {PRESET_NOTICES.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedFileName(null);
                      setFileBase64(null);
                      onSelectPreset(preset);
                    }}
                    className={`text-left p-2.5 rounded-xl border text-xs transition relative group ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/60 text-amber-200 shadow-md shadow-amber-950/50'
                        : 'bg-slate-800/50 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300">
                        {preset.category}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      )}
                    </div>
                    <div className="font-semibold text-white line-clamp-1 group-hover:text-amber-300 transition">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {preset.circularNo}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Notice Title Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Notice Subject / Header (Optional)
                </label>
                <input
                  type="text"
                  value={noticeTitleInput}
                  onChange={(e) => setNoticeTitleInput(e.target.value)}
                  placeholder="e.g. End Semester Exam Fee & Concession Notification (April 2026)"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Upload Circular File / OCR
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="circular-file-input"
                    accept=".txt,.md,.pdf,image/png,image/jpeg,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="circular-file-input"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white cursor-pointer flex items-center justify-center space-x-2 transition"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">
                      {selectedFileName ? selectedFileName : 'Upload Text or Image OCR'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Notice Body Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Notice Content (Multi-page text or OCR stream):
                </label>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleInsertPageBreak}
                    className="inline-flex items-center space-x-1 text-[11px] text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/20 transition"
                    title="Insert a page break marker (=== Page X ===)"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert Page Break</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSourceText('');
                      setNoticeTitleInput('');
                      setSelectedFileName(null);
                      setFileBase64(null);
                    }}
                    className="inline-flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800 px-2 py-0.5 rounded transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={9}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder={`Paste OCR raw text or college circular copy here...
Example format with page indicators:
=== Page 1 ===
OFFICE OF THE CONTROLLER OF EXAMINATIONS
The examination fee of Rs. 2,400 must be remitted on or before 15th March 2026.

=== Page 2 ===
MCM Fee waiver applications require Tehsildar Income Certificate and Grade Sheet.`}
                  className="w-full text-xs font-mono p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition leading-relaxed"
                />

                <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-500 font-mono pointer-events-none">
                  {sourceText.length} characters
                </div>
              </div>
            </div>

            {/* OCR Image Preview tag if uploaded */}
            {fileBase64 && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Attached OCR Image: <strong>{selectedFileName}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileBase64(null);
                    setFileMimeType(null);
                    setSelectedFileName(null);
                  }}
                  className="text-amber-400 hover:text-amber-200 underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Submit & Engine Info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <FileCode className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  Rules Enforced: <strong>Verbatim Quotes Only</strong> • <strong>Ambiguity Guard Flagging</strong> • <strong>Document Extraction</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || (!sourceText.trim() && !fileBase64)}
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed font-medium shrink-0"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Extracting Intelligence...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Run ActaCite Extraction Engine</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Loading progress bar */}
          {isLoading && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2 animate-pulse">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="font-semibold">{steps[loadingStep]}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
