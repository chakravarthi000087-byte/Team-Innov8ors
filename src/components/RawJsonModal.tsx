import React, { useState } from 'react';
import { X, Code2, Copy, Check, Download } from 'lucide-react';
import { ExtractedTask } from '../types/actacite';

interface RawJsonModalProps {
  noticeTitle: string;
  tasks: ExtractedTask[];
  onClose: () => void;
}

export const RawJsonModal: React.FC<RawJsonModalProps> = ({
  noticeTitle,
  tasks,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // Clean data to strictly conform to prompt specification
  const cleanJson = React.useMemo(() => {
    const payload = {
      notice_title: noticeTitle || 'Academic Notice',
      extracted_tasks: tasks.map((t) => ({
        task_description: t.task_description,
        deadline: t.deadline,
        eligibility: t.eligibility,
        required_documents: t.required_documents || [],
        evidence: {
          exact_quote: t.evidence.exact_quote,
          page_reference: t.evidence.page_reference,
        },
        needs_review: !!t.needs_review,
        review_reason: t.needs_review ? t.review_reason : null,
      })),
    };
    return JSON.stringify(payload, null, 2);
  }, [noticeTitle, tasks]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([cleanJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (noticeTitle || 'actacite_notice').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">ActaCite Engine JSON Response</h3>
              <p className="text-xs text-slate-400 font-mono">
                Conforms strictly to prompt schema with verbatim evidence quotes
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

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs">
          <pre className="text-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
            {cleanJson}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {tasks.length} items extracted
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
