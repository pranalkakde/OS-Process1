/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { vivaQuestions } from '../data/vivaData';
import { GraduationCap, Search, Plus, Minus, MessageSquare, ListCollapse } from 'lucide-react';

interface VivaViewProps {
  darkMode: boolean;
}

export default function VivaView({ darkMode }: VivaViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const handleToggle = (id: number) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((x) => x !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const handleExpandAll = () => {
    setExpandedIds(vivaQuestions.map((q) => q.id));
  };

  const handleCollapseAll = () => {
    setExpandedIds([]);
  };

  const filteredQuestions = vivaQuestions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-left" id="viva-questions-view">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white font-sans tracking-tight flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-emerald-500" />
          <span>OS Lab Viva Exam Preparation</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ace your practical examinations. Review 30 frequently asked questions and structured answers on operating systems and process scheduling.
        </p>
      </div>

      {/* Toolbar Search + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="viva-toolbar">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            id="viva-search-input"
            placeholder="Search 30 viva questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs ${
              darkMode 
                ? 'bg-slate-900/60 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500/50' 
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500/50 shadow-sm'
            }`}
          />
        </div>

        {/* Global Expand/Collapse buttons */}
        <div className="flex space-x-2" id="viva-expand-collapse-actions">
          <button
            id="viva-expand-all"
            onClick={handleExpandAll}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              darkMode 
                ? 'border-slate-800 hover:bg-slate-800 text-slate-300' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
          >
            Expand All
          </button>
          <button
            id="viva-collapse-all"
            onClick={handleCollapseAll}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              darkMode 
                ? 'border-slate-800 hover:bg-slate-800 text-slate-300' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Questions list Accordion */}
      {filteredQuestions.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          No matching viva questions found. Try refining your search query!
        </div>
      ) : (
        <div className="space-y-3" id="viva-accordion-deck">
          {filteredQuestions.map((q, idx) => {
            const isExpanded = expandedIds.includes(q.id);
            return (
              <div
                key={q.id}
                id={`viva-card-${q.id}`}
                className={`rounded-xl border transition-all duration-200 ${
                  isExpanded
                    ? darkMode
                      ? 'bg-slate-900/40 border-blue-500/30'
                      : 'bg-blue-50/20 border-blue-150 shadow-sm'
                    : darkMode
                    ? 'bg-slate-900/20 border-slate-800/80 hover:bg-slate-900/40'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {/* Header toggle clickable area */}
                <button
                  onClick={() => handleToggle(q.id)}
                  id={`viva-header-btn-${q.id}`}
                  className="w-full p-4 flex items-start justify-between gap-4 text-left font-sans text-xs sm:text-sm font-extrabold cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <span className="font-mono text-xs text-indigo-500 dark:text-indigo-400 pt-0.5">
                      Q{idx + 1}.
                    </span>
                    <span className={darkMode ? 'text-white' : 'text-black font-extrabold'}>
                      {q.question}
                    </span>
                  </div>
                  <span className={`p-1 rounded-md transition-transform ${
                    isExpanded 
                      ? 'bg-indigo-500/10 text-indigo-500' 
                      : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {isExpanded ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>

                {/* Collapsible Answer panel */}
                {isExpanded && (
                  <div 
                    className={`px-4 pb-4 pt-1 border-t leading-relaxed text-xs text-slate-600 dark:text-slate-350 ${
                      darkMode ? 'border-slate-800/60' : 'border-blue-100/50'
                    }`}
                    id={`viva-answer-${q.id}`}
                  >
                    <div className="flex items-center space-x-1 mb-2 font-semibold text-emerald-500">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="uppercase text-[9px] tracking-wider font-mono">EDUCATIONAL ANSWER SHEET</span>
                    </div>
                    <p className="pl-4 border-l border-emerald-500/30 text-slate-600 dark:text-slate-300">
                      {q.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
