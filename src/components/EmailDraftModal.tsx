import React, { useState } from 'react';
import { X, Mail, Copy, Check, Send } from 'lucide-react';
import { ExtractedTask } from '../types/actacite';

interface EmailDraftModalProps {
  task: ExtractedTask;
  noticeTitle: string;
  onClose: () => void;
}

export const EmailDraftModal: React.FC<EmailDraftModalProps> = ({
  task,
  noticeTitle,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const subject = `Urgent Clarification Request: ${noticeTitle} - [${task.task_description.slice(0, 50)}]`;

  const body = `Respected Sir / Madam (Controller of Examinations / Academic Cell),

I am a student currently reviewing the recently issued circular regarding:
"${noticeTitle}".

While preparing my compliance for the required steps, I observed an ambiguity/conflict regarding the following action item:
Action: ${task.task_description}
Eligibility: ${task.eligibility}

Document Citation (${task.evidence.page_reference}):
"${task.evidence.exact_quote}"

Ambiguity / Conflict Identified:
${task.review_reason || 'Conflicting deadlines or unspecified submission channel.'}

Could you kindly clarify:
1. What is the confirmed last date and exact cutoff time for this submission?
2. Is there a specific prescribed form or office window required?

Looking forward to your guidance so that I do not miss any academic deadlines.

Yours sincerely,
[Your Name]
[Roll Number / Department / Year]
[Contact Phone Number]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailClient = () => {
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Draft Administrative Inquiry</h3>
              <p className="text-xs text-slate-400">
                Pre-composed formal email citing exact circular clauses
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Subject Line:
            </label>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200">
              {subject}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Email Body (Includes Exact Verbatim Citation):
            </label>
            <textarea
              readOnly
              rows={12}
              value={body}
              className="w-full text-xs font-mono p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenMailClient}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>Open in Mail</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Email'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
