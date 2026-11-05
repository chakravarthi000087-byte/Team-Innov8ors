/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Header } from './components/Header';
import { NoticeInputSection } from './components/NoticeInputSection';
import { TaskCard } from './components/TaskCard';
import { TraceabilityInspector } from './components/TraceabilityInspector';
import { AmbiguityGuardBanner } from './components/AmbiguityGuardBanner';
import { DocumentLockerModal } from './components/DocumentLockerModal';
import { EmailDraftModal } from './components/EmailDraftModal';
import { RawJsonModal } from './components/RawJsonModal';
import { PRESET_NOTICES } from './data/presets';
import { ExtractedTask, PresetNotice } from './types/actacite';
import { downloadICS } from './utils/calendar';

export default function App() {
  // Initialize with the first rich college circular preset
  const defaultPreset = PRESET_NOTICES[0];

  const [activePresetId, setActivePresetId] = useState<string | undefined>(defaultPreset.id);
  const [sourceText, setSourceText] = useState<string>(defaultPreset.rawText);
  const [noticeTitle, setNoticeTitle] = useState<string>(defaultPreset.precomputed.notice_title);
  const [noticeTitleInput, setNoticeTitleInput] = useState<string>(defaultPreset.title);

  const [tasks, setTasks] = useState<ExtractedTask[]>(() => {
    return defaultPreset.precomputed.extracted_tasks.map((task, idx) => ({
      ...task,
      id: `task-${idx}-${Date.now()}`,
      completed: false,
    }));
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAmbiguousOnly, setFilterAmbiguousOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('ALL');

  // Modals
  const [showRawJson, setShowRawJson] = useState(false);
  const [showDocLocker, setShowDocLocker] = useState(false);
  const [emailDraftTask, setEmailDraftTask] = useState<ExtractedTask | null>(null);

  // Set default active task on mount
  useEffect(() => {
    if (tasks.length > 0 && !activeTaskId) {
      setActiveTaskId(tasks[0].id);
    }
  }, [tasks, activeTaskId]);

  // Load Preset
  const handleSelectPreset = (preset: PresetNotice) => {
    setActivePresetId(preset.id);
    setSourceText(preset.rawText);
    setNoticeTitle(preset.precomputed.notice_title);
    setNoticeTitleInput(preset.title);
    setErrorMessage(null);

    const generated = preset.precomputed.extracted_tasks.map((task, idx) => ({
      ...task,
      id: `task-${preset.id}-${idx}`,
      completed: false,
    }));
    setTasks(generated);
    setActiveTaskId(generated[0]?.id || null);
  };

  // Live Extraction API Call
  const handleExtract = async (
    text: string,
    customTitle?: string,
    imageBase64?: string,
    mimeType?: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          imageBase64,
          mimeType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server extraction failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.extracted_tasks || !Array.isArray(data.extracted_tasks)) {
        throw new Error('Unexpected response format received from extraction service.');
      }

      const generatedTasks: ExtractedTask[] = data.extracted_tasks.map(
        (t: any, index: number) => ({
          ...t,
          id: `task-live-${Date.now()}-${index}`,
          completed: false,
          required_documents: t.required_documents || [],
        })
      );

      const title = data.notice_title || customTitle || 'Analyzed Academic Notice';
      setNoticeTitle(title);
      setNoticeTitleInput(title);
      setTasks(generatedTasks);
      setActivePresetId(undefined); // Marked as custom
      setActiveTaskId(generatedTasks[0]?.id || null);
    } catch (err: any) {
      console.error('Extraction error:', err);
      setErrorMessage(
        err.message || 'Failed to extract actionable tasks. Please check server logs or API key.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleUpdateManualDeadline = (taskId: string, newDeadline: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, resolvedDeadline: newDeadline } : t))
    );
  };

  const handleExportCalendar = () => {
    downloadICS(tasks, noticeTitle);
  };

  const handleResetToNew = () => {
    setActivePresetId(undefined);
    setSourceText('');
    setNoticeTitle('');
    setNoticeTitleInput('');
    setTasks([]);
    setActiveTaskId(null);
    setErrorMessage(null);
  };

  // Eligibility filter options
  const eligibilityOptions = useMemo(() => {
    const list = Array.from(new Set(tasks.map((t) => t.eligibility).filter(Boolean)));
    return ['ALL', ...list];
  }, [tasks]);

  // Filtered task items
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Ambiguity filter
      if (filterAmbiguousOnly && !task.needs_review) return false;

      // Status filter
      if (statusFilter === 'PENDING' && task.completed) return false;
      if (statusFilter === 'COMPLETED' && !task.completed) return false;

      // Eligibility filter
      if (selectedEligibility !== 'ALL' && task.eligibility !== selectedEligibility) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = task.task_description.toLowerCase().includes(query);
        const matchesQuote = task.evidence.exact_quote.toLowerCase().includes(query);
        const matchesDocs = task.required_documents.some((d) => d.toLowerCase().includes(query));
        const matchesElig = task.eligibility.toLowerCase().includes(query);
        if (!matchesDesc && !matchesQuote && !matchesDocs && !matchesElig) return false;
      }

      return true;
    });
  }, [tasks, filterAmbiguousOnly, statusFilter, selectedEligibility, searchQuery]);

  const activeTask = useMemo(() => {
    return tasks.find((t) => t.id === activeTaskId) || tasks[0] || null;
  }, [tasks, activeTaskId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation & Action Header */}
      <Header
        noticeTitle={noticeTitle}
        tasks={tasks}
        onOpenJson={() => setShowRawJson(true)}
        onOpenDocLocker={() => setShowDocLocker(true)}
        onExportCalendar={handleExportCalendar}
        onResetToNew={handleResetToNew}
        isCustomNotice={!activePresetId}
      />

      {/* Main Workstation Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-start space-x-3 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong>Extraction Error:</strong> {errorMessage}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input & Preset Circular Selector */}
        <NoticeInputSection
          onExtract={handleExtract}
          onSelectPreset={handleSelectPreset}
          isLoading={isLoading}
          activePresetId={activePresetId}
          sourceText={sourceText}
          setSourceText={setSourceText}
          noticeTitleInput={noticeTitleInput}
          setNoticeTitleInput={setNoticeTitleInput}
        />

        {/* Ambiguity Guard Callout Banner */}
        <AmbiguityGuardBanner
          tasks={tasks}
          filterAmbiguousOnly={filterAmbiguousOnly}
          onToggleFilter={() => setFilterAmbiguousOnly(!filterAmbiguousOnly)}
        />

        {/* Filter and Control Bar */}
        {tasks.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks, quotes, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    statusFilter === 'ALL'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({tasks.length})
                </button>
                <button
                  onClick={() => setStatusFilter('PENDING')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    statusFilter === 'PENDING'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pending ({tasks.filter((t) => !t.completed).length})
                </button>
                <button
                  onClick={() => setStatusFilter('COMPLETED')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    statusFilter === 'COMPLETED'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Done ({tasks.filter((t) => t.completed).length})
                </button>
              </div>

              {eligibilityOptions.length > 2 && (
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                  <Filter className="w-3 h-3 text-slate-500" />
                  <select
                    value={selectedEligibility}
                    onChange={(e) => setSelectedEligibility(e.target.value)}
                    className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none max-w-[200px] truncate"
                  >
                    <option value="ALL">All Eligibility Groups</option>
                    {eligibilityOptions
                      .filter((o) => o !== 'ALL')
                      .map((elig, idx) => (
                        <option key={idx} value={elig}>
                          {elig.length > 40 ? elig.slice(0, 40) + '...' : elig}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dual-Pane Core Workstation (Task Checklist + Evidence Split Inspector) */}
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Pane: Actionable Task Checklist */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    Actionable Checklist
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {filteredTasks.length} {filteredTasks.length === 1 ? 'Item' : 'Items'}
                    </span>
                  </h3>
                </div>

                <span className="text-xs text-slate-400">
                  Select a card to pin citation in inspector
                </span>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="font-semibold text-slate-300">No tasks match your selected filter.</p>
                  <p>Try resetting the ambiguity filter or search term.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isActive={activeTaskId === task.id}
                    onSelect={() => setActiveTaskId(task.id)}
                    onToggleComplete={handleToggleComplete}
                    onOpenEmailDraft={(t) => setEmailDraftTask(t)}
                    onUpdateManualDeadline={handleUpdateManualDeadline}
                  />
                ))
              )}
            </div>

            {/* Right Pane: Traceability Inspector (Verbatim Source Document) */}
            <div className="lg:col-span-5 sticky top-20 max-h-[calc(100vh-6.5rem)]">
              <TraceabilityInspector
                sourceText={sourceText}
                activeTask={activeTask}
                tasks={tasks}
                onSelectTask={(task) => setActiveTaskId(task.id)}
              />
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Ready to Extract Academic Notice Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select one of the verified circular presets above, or paste raw text or OCR output from any college notice to generate an evidence-linked checklist.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ActaCite Core Intelligence Engine • Strict Evidence-Linked Extraction</span>
          <span className="font-mono text-[11px] text-slate-600">
            Rules 1, 2, 3 Enforced • Gemini 3.8 Flash Powered
          </span>
        </div>
      </footer>

      {/* Modals */}
      {showRawJson && (
        <RawJsonModal
          noticeTitle={noticeTitle}
          tasks={tasks}
          onClose={() => setShowRawJson(false)}
        />
      )}

      {showDocLocker && (
        <DocumentLockerModal
          tasks={tasks}
          noticeTitle={noticeTitle}
          onClose={() => setShowDocLocker(false)}
        />
      )}

      {emailDraftTask && (
        <EmailDraftModal
          task={emailDraftTask}
          noticeTitle={noticeTitle}
          onClose={() => setEmailDraftTask(null)}
        />
      )}
    </div>
  );
}
