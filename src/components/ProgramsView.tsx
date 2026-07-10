/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { programsData } from '../data/programsData';
import { Code2, Copy, Check, Terminal, Play } from 'lucide-react';

interface ProgramsViewProps {
  darkMode: boolean;
}

export default function ProgramsView({ darkMode }: ProgramsViewProps) {
  const [selectedProgId, setSelectedProgId] = useState('fcfs-c');
  const [copied, setCopied] = useState(false);

  const activeProgram = programsData.find((p) => p.id === selectedProgId) || programsData[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeProgram.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16 text-left" id="lab-programs-view">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white font-sans tracking-tight flex items-center gap-2">
          <Code2 className="h-6 w-6 text-blue-500" />
          <span>Laboratory C Programs Directory</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Access fully compilable, highly commented, standard Operating System Laboratory programs written in C. Perfect for direct compilation on GCC or Turbo C compilers.
        </p>
      </div>

      {/* Main Grid split */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar program selectors */}
        <div className="lg:col-span-3 space-y-2" id="programs-sidebar-tabs">
          {programsData.map((prog) => (
            <button
              key={prog.id}
              id={`prog-tab-btn-${prog.id}`}
              onClick={() => {
                setSelectedProgId(prog.id);
                setCopied(false);
              }}
              className={`w-full text-left p-4 rounded-xl border font-sans font-bold flex items-center justify-between transition-all duration-200 ${
                selectedProgId === prog.id
                  ? darkMode
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 shadow-lg'
                    : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                  : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Terminal className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider">{prog.algorithmName}</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 font-mono">C</span>
            </button>
          ))}
        </div>

        {/* Code Visualizer Display area */}
        <div className="lg:col-span-9 space-y-4" id="program-code-display-canvas">
          <div className={`rounded-2xl border overflow-hidden ${
            darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-850 shadow-lg'
          }`}>
            
            {/* Code Header Bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2 font-mono text-slate-400">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="ml-2">{activeProgram.title.toLowerCase().replace(/ /g, '_')}.c</span>
              </div>

              {/* Copy actions */}
              <button
                id="copy-code-btn"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold font-sans text-[11px] flex items-center space-x-1.5 transition-colors border border-slate-700"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied C Source!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Program code content */}
            <div className="p-4 sm:p-6 overflow-x-auto bg-slate-950 text-left">
              <pre className="font-mono text-xs text-slate-350 leading-relaxed select-all">
                <code>
                  {activeProgram.code}
                </code>
              </pre>
            </div>
          </div>

          {/* Quick GCC Compilation Instructions block */}
          <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`} id="compilation-instructions">
            <Play className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h5 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider text-[10px]">GCC Terminal Compilation Instructions</h5>
              <p>To compile and run this process scheduler program in Linux Terminal, execute these sequential commands:</p>
              <div className="bg-slate-950 text-indigo-400 p-2 rounded font-mono text-[11px] my-2 border dark:border-slate-850">
                gcc {activeProgram.title.toLowerCase().split(' ')[0]}.c -o sched_test<br />
                ./sched_test
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
