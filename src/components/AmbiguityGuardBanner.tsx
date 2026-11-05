import React from 'react';
import { AlertTriangle, Filter, CheckCircle2 } from 'lucide-react';
import { ExtractedTask } from '../types/actacite';

interface AmbiguityGuardBannerProps {
  tasks: ExtractedTask[];
  filterAmbiguousOnly: boolean;
  onToggleFilter: () => void;
}

export const AmbiguityGuardBanner: React.FC<AmbiguityGuardBannerProps> = ({
  tasks,
  filterAmbiguousOnly,
  onToggleFilter,
}) => {
  const reviewTasks = tasks.filter((t) => t.needs_review);

  if (reviewTasks.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-lg mb-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-amber-300">
                Ambiguity Guard Active ({reviewTasks.length} {reviewTasks.length === 1 ? 'Notice Discrepancy' : 'Notice Discrepancies'} Flagged)
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">
                CRITICAL RULE 3
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              ActaCite detected ambiguous instructions, missing deadlines, or conflicting timetable clauses in this circular. We have refused to guess and flagged these tasks with actionable review reasons and administrative clarification templates.
            </p>
          </div>
        </div>

        <button
          onClick={onToggleFilter}
          className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 border ${
            filterAmbiguousOnly
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20'
              : 'bg-slate-800 text-amber-300 border-amber-500/30 hover:bg-slate-700'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{filterAmbiguousOnly ? 'Show All Tasks' : `Filter (${reviewTasks.length} Needing Review)`}</span>
        </button>
      </div>
    </div>
  );
};
