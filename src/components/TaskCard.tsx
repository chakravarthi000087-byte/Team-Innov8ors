import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  FileCheck,
  AlertTriangle,
  Quote,
  Eye,
  Mail,
  Edit3,
  Check,
  Users,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExtractedTask } from '../types/actacite';

interface TaskCardProps {
  task: ExtractedTask;
  isActive: boolean;
  onSelect: () => void;
  onToggleComplete: (id: string) => void;
  onOpenEmailDraft: (task: ExtractedTask) => void;
  onUpdateManualDeadline: (id: string, newDeadline: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isActive,
  onSelect,
  onToggleComplete,
  onOpenEmailDraft,
  onUpdateManualDeadline,
}) => {
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [manualDateInput, setManualDateInput] = useState(task.resolvedDeadline || task.deadline || '');
  const [copiedDoc, setCopiedDoc] = useState(false);

  const handleCheckbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
      });
    }
    onToggleComplete(task.id);
  };

  const handleSaveDeadline = () => {
    onUpdateManualDeadline(task.id, manualDateInput);
    setIsEditingDeadline(false);
  };

  const copyDocuments = () => {
    if (task.required_documents.length === 0) return;
    navigator.clipboard.writeText(task.required_documents.join('\n'));
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden relative ${
        isActive
          ? 'bg-slate-900 border-amber-500/70 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/30'
          : task.completed
          ? 'bg-slate-950/70 border-slate-800/80 opacity-75'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
      }`}
    >
      {/* Top indicator bar */}
      {task.needs_review && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-1.5 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center space-x-1.5 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>AMBIGUITY GUARD: Needs Student Review</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
            Rule 3 Flag
          </span>
        </div>
      )}

      <div className="p-4 sm:p-5 space-y-4">
        {/* Main Task Description & Completion Checkbox */}
        <div className="flex items-start space-x-3.5">
          <button
            type="button"
            onClick={handleCheckbox}
            className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition shrink-0 ${
              task.completed
                ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm'
                : 'border-slate-700 hover:border-amber-400 bg-slate-950 text-transparent'
            }`}
            title={task.completed ? 'Mark incomplete' : 'Mark as completed'}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          <div className="flex-1">
            <h4
              className={`text-sm sm:text-base font-semibold leading-snug transition ${
                task.completed ? 'line-through text-slate-500' : 'text-white'
              }`}
            >
              {task.task_description}
            </h4>

            {/* Eligibility tag */}
            <div className="mt-2 flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="inline-flex items-center space-x-1 text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                <Users className="w-3 h-3 text-slate-400" />
                <span>Eligibility: <strong className="text-slate-100">{task.eligibility}</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Deadline pill & Manual Override */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-xs text-slate-400">Deadline:</span>
            {isEditingDeadline ? (
              <div className="flex items-center space-x-1.5">
                <input
                  type="text"
                  value={manualDateInput}
                  onChange={(e) => setManualDateInput(e.target.value)}
                  placeholder="Set verified date/time..."
                  className="text-xs px-2 py-1 rounded bg-slate-950 border border-amber-500/50 text-white focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveDeadline();
                  }}
                  className="text-xs px-2 py-1 rounded bg-amber-500 text-slate-950 font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                {task.resolvedDeadline || task.deadline ? (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-500/30">
                    {task.resolvedDeadline ? `${task.resolvedDeadline} (Verified)` : task.deadline}
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-950/40 text-rose-300 border border-rose-500/30">
                    No explicit deadline specified
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingDeadline(true);
                  }}
                  className="p-1 text-slate-500 hover:text-slate-300 rounded transition"
                  title="Override or confirm deadline"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Required Documents Section */}
        {task.required_documents.length > 0 && (
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1.5 font-medium text-slate-300">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Required Documents ({task.required_documents.length}):</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyDocuments();
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition"
              >
                <Copy className="w-3 h-3" />
                {copiedDoc ? 'Copied!' : 'Copy List'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {task.required_documents.map((doc, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-medium"
                >
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Section (Traceability) */}
        <div className="bg-slate-950/90 rounded-xl p-3.5 border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
              <Quote className="w-3.5 h-3.5" />
              <span>Evidence Traceability:</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                {task.evidence.page_reference}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="inline-flex items-center space-x-1 text-[11px] font-medium text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 transition"
            >
              <Eye className="w-3 h-3 text-amber-400" />
              <span>Inspect in Source</span>
            </button>
          </div>

          <blockquote className="text-xs text-slate-300 italic font-mono border-l-2 border-amber-500/60 pl-2.5 py-0.5">
            "{task.evidence.exact_quote}"
          </blockquote>
        </div>

        {/* Ambiguity Reason & Resolution Actions */}
        {task.needs_review && (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2.5 text-xs">
            <div className="text-amber-200 leading-relaxed">
              <strong>Ambiguity Reason:</strong> {task.review_reason}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEmailDraft(task);
                }}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Draft Inquiry to Dean / Exam Cell</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
