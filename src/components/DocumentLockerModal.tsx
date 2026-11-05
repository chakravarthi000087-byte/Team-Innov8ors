import React, { useState } from 'react';
import { X, FolderCheck, CheckSquare, Square, Printer, Copy, Check } from 'lucide-react';
import { ExtractedTask } from '../types/actacite';

interface DocumentLockerModalProps {
  tasks: ExtractedTask[];
  noticeTitle: string;
  onClose: () => void;
}

export const DocumentLockerModal: React.FC<DocumentLockerModalProps> = ({
  tasks,
  noticeTitle,
  onClose,
}) => {
  // Aggregate documents with reference to tasks requiring them
  const docMap = React.useMemo(() => {
    const map = new Map<string, { tasks: string[]; checked: boolean }>();
    tasks.forEach((task) => {
      task.required_documents.forEach((doc) => {
        const clean = doc.trim();
        if (!clean) return;
        if (!map.has(clean)) {
          map.set(clean, { tasks: [task.task_description], checked: false });
        } else {
          map.get(clean)?.tasks.push(task.task_description);
        }
      });
    });
    return map;
  }, [tasks]);

  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleDoc = (doc: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [doc]: !prev[doc],
    }));
  };

  const docEntries = Array.from(docMap.entries());
  const checkedCount = docEntries.filter(([doc]) => checkedDocs[doc]).length;

  const handleCopyAll = () => {
    const list = docEntries
      .map(([doc, info], i) => `${i + 1}. [${checkedDocs[doc] ? 'X' : ' '}] ${doc}`)
      .join('\n');
    navigator.clipboard.writeText(
      `Required Documents Checklist for: ${noticeTitle}\n\n${list}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FolderCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Document Locker & Dossier Checklist</h3>
              <p className="text-xs text-slate-400">
                {checkedCount} of {docEntries.length} required documents prepared
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action strip */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Notice: {noticeTitle}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAll}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Print List</span>
            </button>
          </div>
        </div>

        {/* Document Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {docEntries.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No mandatory documents or enclosures were extracted from this notice.
            </div>
          ) : (
            docEntries.map(([doc, info], idx) => {
              const isDone = !!checkedDocs[doc];
              return (
                <div
                  key={idx}
                  onClick={() => toggleDoc(doc)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-slate-400 hover:text-white"
                  >
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {doc}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Required for: {info.tasks[0]}
                      {info.tasks.length > 1 ? ` (+${info.tasks.length - 1} more)` : ''}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
