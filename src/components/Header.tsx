import React from 'react';
import {
  FileText,
  Calendar,
  Code2,
  FolderCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ExtractedTask } from '../types/actacite';

interface HeaderProps {
  noticeTitle: string;
  tasks: ExtractedTask[];
  onOpenJson: () => void;
  onOpenDocLocker: () => void;
  onExportCalendar: () => void;
  onResetToNew: () => void;
  isCustomNotice: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  noticeTitle,
  tasks,
  onOpenJson,
  onOpenDocLocker,
  onExportCalendar,
  onResetToNew,
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const reviewCount = tasks.filter((t) => t.needs_review).length;
  const deadlineCount = tasks.filter((t) => t.deadline).length;

  // Count unique documents
  const uniqueDocsCount = new Set(
    tasks.flatMap((t) => t.required_documents.map((d) => d.trim().toLowerCase()))
  ).size;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl tracking-tight">
              A
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  ActaCite
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Notice Intelligence Engine
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Evidence-Linked Academic Notice Task Extraction & Ambiguity Guard
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={onExportCalendar}
              disabled={tasks.length === 0}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              title="Download .ics calendar event reminders with exact quotes"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Calendar (.ics)</span>
            </button>

            <button
              onClick={onOpenDocLocker}
              disabled={tasks.length === 0}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              title="View all required enclosures and documents checklist"
            >
              <FolderCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Document Locker ({uniqueDocsCount})</span>
            </button>

            <button
              onClick={onOpenJson}
              disabled={tasks.length === 0}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              title="Inspect pure JSON output according to prompt schema"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Schema JSON</span>
            </button>

            <button
              onClick={onResetToNew}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition shadow-sm"
              title="Analyze a new academic notice or OCR snippet"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>New Notice</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Strip */}
        {totalTasks > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 overflow-x-auto gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="text-slate-500 font-medium">Active Notice:</span>
              <span className="text-slate-200 font-semibold truncate max-w-md">
                {noticeTitle || 'Untitled Academic Notice'}
              </span>
            </div>

            <div className="flex items-center space-x-4 shrink-0 font-medium">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  <strong className="text-white">{totalTasks}</strong> tasks
                </span>
              </div>

              <div className="flex items-center space-x-1.5 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  <strong className="text-white">{deadlineCount}</strong> with deadlines
                </span>
              </div>

              {reviewCount > 0 && (
                <div className="flex items-center space-x-1.5 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    <strong>{reviewCount}</strong> ambiguity flagged
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  <strong>{completedTasks}</strong> of {totalTasks} done
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
