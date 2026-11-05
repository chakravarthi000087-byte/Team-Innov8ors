import React, { useMemo } from 'react';
import {
  FileCheck2,
  AlertCircle,
  ExternalLink,
  Search,
  CheckCircle2,
  Copy,
  BookOpen,
  Eye,
} from 'lucide-react';
import { ExtractedTask } from '../types/actacite';
import { parsePages, verifyQuoteMatch } from '../utils/textHighlight';

interface TraceabilityInspectorProps {
  sourceText: string;
  activeTask: ExtractedTask | null;
  tasks: ExtractedTask[];
  onSelectTask: (task: ExtractedTask) => void;
  onClose?: () => void;
}

export const TraceabilityInspector: React.FC<TraceabilityInspectorProps> = ({
  sourceText,
  activeTask,
  tasks,
  onSelectTask,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [copiedQuote, setCopiedQuote] = React.useState(false);

  const pages = useMemo(() => parsePages(sourceText), [sourceText]);

  const activeQuote = activeTask?.evidence.exact_quote;

  // Verify match for currently active quote
  const matchResult = useMemo(() => {
    if (!activeQuote || !sourceText) return null;
    return verifyQuoteMatch(sourceText, activeQuote);
  }, [sourceText, activeQuote]);

  const handleCopyQuote = (quote: string) => {
    navigator.clipboard.writeText(quote);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  /**
   * Renders page text with highlight tags around quotes
   */
  const renderHighlightedContent = (content: string, pageNum: number) => {
    if (!activeQuote) {
      // Just render raw content or apply search highlight
      return <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">{content}</div>;
    }

    // Check if active quote belongs to this page or matches here
    const normalizedPage = content.toLowerCase();
    const normalizedTarget = activeQuote.toLowerCase().trim();

    // Try finding exact quote
    const exactIdx = content.indexOf(activeQuote);
    if (exactIdx !== -1) {
      const before = content.slice(0, exactIdx);
      const match = content.slice(exactIdx, exactIdx + activeQuote.length);
      const after = content.slice(exactIdx + activeQuote.length);

      return (
        <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">
          {before}
          <mark className="citation-highlight-active bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded shadow-sm">
            {match}
          </mark>
          {after}
        </div>
      );
    }

    // Normalized search
    const lowerIdx = normalizedPage.indexOf(normalizedTarget);
    if (lowerIdx !== -1) {
      const before = content.slice(0, lowerIdx);
      const match = content.slice(lowerIdx, lowerIdx + activeQuote.length);
      const after = content.slice(lowerIdx + activeQuote.length);

      return (
        <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">
          {before}
          <mark className="citation-highlight-active bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded shadow-sm">
            {match}
          </mark>
          {after}
        </div>
      );
    }

    // If no quote on this page, render regular
    return <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-400">{content}</div>;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Traceability Inspector & Source Pages
          </h3>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} Scanned
        </div>
      </div>

      {/* Active Quote Citation Banner */}
      {activeTask ? (
        <div className="p-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Target Citation ({activeTask.evidence.page_reference}):
            </span>

            {matchResult?.isVerbatim && (
              <span className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% Verbatim Match</span>
              </span>
            )}

            {!matchResult?.isVerbatim && matchResult?.isNormalizedMatch && (
              <span className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-3 h-3" />
                <span>Normalized Match</span>
              </span>
            )}
          </div>

          <div className="relative group">
            <p className="text-xs text-slate-200 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg font-mono italic pr-8">
              "{activeTask.evidence.exact_quote}"
            </p>
            <button
              onClick={() => handleCopyQuote(activeTask.evidence.exact_quote)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
              title="Copy quote"
            >
              {copiedQuote ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="truncate">
              Linked Task: <strong className="text-slate-200">{activeTask.task_description}</strong>
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-950/50 border-b border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>Click <strong>"Inspect Quote"</strong> on any task card to locate the exact citation in the original notice.</span>
        </div>
      )}

      {/* Pages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {pages.map((page) => (
          <div
            key={page.pageNumber}
            id={`notice-page-${page.pageNumber}`}
            className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 shadow-sm relative group hover:border-slate-700/80 transition"
          >
            {/* Page header marker */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800 text-xs">
              <span className="font-semibold text-amber-400 font-mono flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                {page.pageHeader}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Official Document Stream
              </span>
            </div>

            {/* Page Content */}
            <div className="overflow-x-auto">
              {renderHighlightedContent(page.content, page.pageNumber)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
