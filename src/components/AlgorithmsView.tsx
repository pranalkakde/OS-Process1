/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { algorithmsData, AlgorithmDetail } from '../data/algorithmsData';
import { Cpu, Zap, Layers, AlertCircle, HelpCircle, Code2, RefreshCw, BarChart2 } from 'lucide-react';

interface AlgorithmsViewProps {
  darkMode: boolean;
}

export default function AlgorithmsView({ darkMode }: AlgorithmsViewProps) {
  const [selectedAlgoId, setSelectedAlgoId] = useState('FCFS');
  const [interactiveQuantum, setInteractiveQuantum] = useState(2);

  const selectedAlgo = algorithmsData.find((a) => a.id === selectedAlgoId) || algorithmsData[0];

  // Helper to calculate a simple Round Robin step-by-step example for the interactive quantum selector
  const getRRDemoGantt = (quantum: number) => {
    // Processes: P1 (6), P2 (3), P3 (1) arriving at t=0
    let timeline = [];
    let p1 = 6, p2 = 3, p3 = 1;
    let t = 0;
    let queue = ['P1', 'P2', 'P3'];

    while (p1 > 0 || p2 > 0 || p3 > 0) {
      if (queue.length === 0) break;
      const current = queue.shift();
      if (current === 'P1' && p1 > 0) {
        const run = Math.min(p1, quantum);
        timeline.push({ id: 'P1', start: t, end: t + run });
        t += run;
        p1 -= run;
        if (p1 > 0) queue.push('P1');
      } else if (current === 'P2' && p2 > 0) {
        const run = Math.min(p2, quantum);
        timeline.push({ id: 'P2', start: t, end: t + run });
        t += run;
        p2 -= run;
        if (p2 > 0) queue.push('P2');
      } else if (current === 'P3' && p3 > 0) {
        const run = Math.min(p3, quantum);
        timeline.push({ id: 'P3', start: t, end: t + run });
        t += run;
        p3 -= run;
        if (p3 > 0) queue.push('P3');
      }
    }
    return timeline;
  };

  const rrDemoGantt = getRRDemoGantt(interactiveQuantum);

  return (
    <div className="space-y-10 pb-16 text-left" id="algorithms-view">
      {/* Header section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white font-sans tracking-tight">
          OS Scheduling Algorithms Library
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Select an algorithm below to view detailed academic definitions, characteristics, step-by-step workflows, 
          mathematical formulas, complexities, and visual queue diagrams.
        </p>
      </div>

      {/* Main Algorithm Selector Hub */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2" id="algo-tabs-container">
          {algorithmsData.map((algo) => (
            <button
              key={algo.id}
              id={`algo-tab-btn-${algo.id}`}
              onClick={() => setSelectedAlgoId(algo.id)}
              className={`w-full text-left p-4 rounded-xl border font-sans font-bold flex items-center justify-between transition-all duration-200 ${
                selectedAlgoId === algo.id
                  ? darkMode
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-lg shadow-blue-900/10'
                    : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                  : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  algo.id === 'FCFS' ? 'bg-blue-500' :
                  algo.id === 'SJF' ? 'bg-emerald-500' :
                  algo.id === 'SRTF' ? 'bg-amber-500' :
                  algo.id === 'PRIORITY' ? 'bg-purple-500' :
                  algo.id === 'RR' ? 'bg-indigo-500' :
                  'bg-rose-500'
                }`}></span>
                <span className="text-xs uppercase tracking-wider">{algo.name}</span>
              </div>
              <span className="text-[10px] opacity-60 font-mono">info</span>
            </button>
          ))}
        </div>

        {/* Detailed Explanation Canvas */}
        <div className="lg:col-span-9 space-y-8" id="algo-content-container">
          {/* Card Body wrapper */}
          <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/80 shadow-md shadow-slate-100/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6 border-slate-200 dark:border-slate-800">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-indigo-500 uppercase font-bold">ALGORITHM MATRIX</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white font-sans">{selectedAlgo.fullName}</h3>
              </div>
              <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider ${
                  selectedAlgo.id === 'SRTF' || selectedAlgo.id === 'RR' || selectedAlgo.id === 'MLFQ'
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                    : selectedAlgo.id === 'PRIORITY' || selectedAlgo.id === 'MLQ'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {selectedAlgo.id === 'SRTF' || selectedAlgo.id === 'RR' || selectedAlgo.id === 'MLFQ' ? 'PREEMPTIVE' : 
                   selectedAlgo.id === 'PRIORITY' ? 'PREEMPTIVE & NON-PREEMPTIVE' : 'NON-PREEMPTIVE'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {selectedAlgo.complexity.time.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Definition */}
            <div className="space-y-2 mb-6 text-left">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Core Definition</h4>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {selectedAlgo.definition}
              </p>
            </div>

            {/* Bento Split for Characteristics & Pros/Cons */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Characteristics */}
              <div className={`p-5 rounded-xl border ${
                darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center">
                  <Zap className="h-4 w-4 text-amber-500 mr-2" />
                  <span>Key Properties</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  {selectedAlgo.characteristics.map((c, i) => (
                    <li key={i} className="flex items-start space-x-2 text-slate-600 dark:text-slate-400">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pros and Cons */}
              <div className={`p-5 rounded-xl border ${
                darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center">
                  <HelpCircle className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Advantages & Limitations</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Advantages</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                      {selectedAlgo.advantages.join(' ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">Disadvantages</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                      {selectedAlgo.disadvantages.join(' ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Algorithm Walkthrough */}
            <div className="space-y-4 mb-8">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Scheduler Step-by-Step Logic</h4>
              <div className="relative border-l border-indigo-500/20 pl-4 space-y-4 text-left ml-2">
                {selectedAlgo.steps.map((step, i) => (
                  <div key={i} className="relative">
                    {/* Ring indicator */}
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 shadow"></span>
                    <span className="text-[10px] font-bold font-mono text-indigo-500 block">STEP {i + 1}</span>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulas & Complexity Box */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 border-t pt-6 border-slate-200 dark:border-slate-800">
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Mathematical Formulas</h4>
                <div className="space-y-1.5 font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10">
                  <p>{selectedAlgo.formulas.waitingTime}</p>
                  <p>{selectedAlgo.formulas.turnaroundTime}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Algorithmic Complexity</h4>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-500/5 p-3 rounded-lg border border-slate-500/10">
                  <p><strong className="font-sans text-slate-400 dark:text-slate-500">Time Complexity:</strong> {selectedAlgo.complexity.time}</p>
                  <p><strong className="font-sans text-slate-400 dark:text-slate-500">Space Complexity:</strong> {selectedAlgo.complexity.space}</p>
                </div>
              </div>
            </div>

            {/* Real Life Analogy */}
            <div className={`p-4 rounded-xl border flex items-start space-x-3 mb-8 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-blue-50/30 border-blue-100'
            }`}>
              <HelpCircle className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Real-Life Metaphor</h5>
                <p className={`text-xs leading-relaxed mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedAlgo.realLifeExample}
                </p>
              </div>
            </div>

            {/* Round Robin Interactive quantum Selector tester */}
            {selectedAlgo.id === 'RR' && (
              <div className={`p-5 rounded-xl border mb-8 space-y-4 ${
                darkMode ? 'bg-indigo-950/20 border-indigo-900/30' : 'bg-indigo-50/50 border-indigo-100'
              }`} id="rr-interactive-quantum-container">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-extrabold uppercase text-indigo-500 tracking-wider">Interactive Quantum Simulator</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Adjust the time quantum slider below to see how it affects preemption slices for processes: P1 (6s), P2 (3s), P3 (1s)
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold font-mono">Quantum:</span>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={interactiveQuantum}
                      onChange={(e) => setInteractiveQuantum(Number(e.target.value))}
                      className="w-24 accent-indigo-500"
                    />
                    <span className="bg-indigo-600 text-white text-xs font-extrabold px-2 py-1 rounded font-mono">
                      {interactiveQuantum} ms
                    </span>
                  </div>
                </div>

                {/* Animated Gantt preview for interactive test */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Resulting Gantt Timeline</span>
                  <div className="flex h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-indigo-900/40 text-[11px] font-mono font-bold">
                    {rrDemoGantt.map((block, idx) => (
                      <div
                        key={idx}
                        className={`h-full flex items-center justify-center border-r last:border-r-0 border-slate-300 dark:border-indigo-950/40 relative group ${
                          block.id === 'P1' ? 'bg-purple-500/25 text-purple-400' :
                          block.id === 'P2' ? 'bg-emerald-500/25 text-emerald-400' :
                          'bg-amber-500/25 text-amber-400'
                        }`}
                        style={{ flexGrow: block.end - block.start }}
                      >
                        <span>{block.id}</span>
                        {/* Start/end values inside */}
                        <span className="absolute bottom-0.5 left-1 text-[8px] text-slate-400 font-normal">{block.start}</span>
                        <span className="absolute bottom-0.5 right-1 text-[8px] text-slate-400 font-normal">{block.end}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Academic Step Example with Visual Gantt */}
            {selectedAlgo.academicExample && (
              <div className="space-y-4 border-t pt-6 border-slate-200 dark:border-slate-800" id="academic-example-visual">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Academic Scenario Example</h4>
                
                {/* Table representation */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800" id="academic-table-container">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs font-mono">
                    <thead className={darkMode ? 'bg-slate-900' : 'bg-slate-50'}>
                      <tr>
                        <th className="px-4 py-2 text-left font-bold uppercase tracking-wider text-slate-400">Process</th>
                        <th className="px-4 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Arrival Time</th>
                        <th className="px-4 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Burst Time</th>
                        {selectedAlgo.academicExample.processes[0].priority !== undefined && (
                          <th className="px-4 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Priority</th>
                        )}
                        <th className="px-4 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Waiting Time</th>
                        <th className="px-4 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Turnaround Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {selectedAlgo.academicExample.processes.map((proc) => (
                        <tr key={proc.id}>
                          <td className="px-4 py-2.5 text-left font-bold text-indigo-500">{proc.id}</td>
                          <td className="px-4 py-2.5 text-center">{proc.arrival} ms</td>
                          <td className="px-4 py-2.5 text-center">{proc.burst} ms</td>
                          {proc.priority !== undefined && (
                            <td className="px-4 py-2.5 text-center font-extrabold text-purple-400">{proc.priority}</td>
                          )}
                          <td className="px-4 py-2.5 text-center font-bold text-amber-500">
                            {selectedAlgo.academicExample.waitingTimes[proc.id]} ms
                          </td>
                          <td className="px-4 py-2.5 text-center font-bold text-emerald-500">
                            {selectedAlgo.academicExample.turnaroundTimes[proc.id]} ms
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Simulated Gantt timeline */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Calculated Gantt Timeline</span>
                  <div className="flex h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold">
                    {(() => {
                      let tSum = 0;
                      return selectedAlgo.academicExample.gantt.map((block, idx) => {
                        const start = tSum;
                        tSum += block.duration;
                        const end = tSum;
                        return (
                          <div
                            key={idx}
                            className={`h-full flex flex-col justify-center items-center border-r last:border-r-0 border-slate-200 dark:border-slate-800 relative group ${
                              block.id === 'P1' ? 'bg-purple-500/20 text-purple-400' :
                              block.id === 'P2' ? 'bg-emerald-500/20 text-emerald-400' :
                              block.id === 'P3' ? 'bg-amber-500/20 text-amber-400' :
                              block.id === 'P4' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}
                            style={{ flexGrow: block.duration }}
                          >
                            <span className="text-xs">{block.id}</span>
                            <span className="text-[9px] font-normal text-slate-400">({block.duration}ms)</span>
                            <span className="absolute bottom-0.5 left-1 text-[8px] text-slate-400 font-normal">{start}</span>
                            <span className="absolute bottom-0.5 right-1 text-[8px] text-slate-400 font-normal">{end}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Averages */}
                <div className="flex flex-wrap gap-4 text-xs font-bold pt-2">
                  <div className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg">
                    Average Waiting Time: {selectedAlgo.academicExample.avgWaiting} ms
                  </div>
                  <div className="px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg">
                    Average Turnaround Time: {selectedAlgo.academicExample.avgTurnaround} ms
                  </div>
                </div>
              </div>
            )}

            {/* Diagrams for MLQ and MLFQ */}
            {(selectedAlgo.id === 'MLQ' || selectedAlgo.id === 'MLFQ') && (
              <div className="space-y-4 border-t pt-6 border-slate-200 dark:border-slate-800" id="queue-diagrams-visual">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {selectedAlgo.id === 'MLQ' ? 'Static Queue Allocation Structure' : 'Feedback Queue Demotion Flow'}
                </h4>
                
                {selectedAlgo.id === 'MLQ' ? (
                  /* Static MLQ Diagram */
                  <div className={`p-6 rounded-2xl border text-center font-sans space-y-4 ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`} id="mlq-diagram-canvas">
                    <div className="flex flex-col items-center space-y-3">
                      {/* Queue 1 */}
                      <div className="w-full max-w-md p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex justify-between items-center text-xs">
                        <span className="font-extrabold">Queue 1: System Processes (FCFS)</span>
                        <span className="bg-purple-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">PRIORITY 1</span>
                      </div>
                      
                      <div className="text-slate-400 text-xs font-mono">↓ CPU yields only if Queue 1 is empty</div>
                      
                      {/* Queue 2 */}
                      <div className="w-full max-w-md p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex justify-between items-center text-xs">
                        <span className="font-extrabold">Queue 2: Interactive User (Round Robin)</span>
                        <span className="bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">PRIORITY 2</span>
                      </div>

                      <div className="text-slate-400 text-xs font-mono">↓ CPU yields only if Queues 1 & 2 are empty</div>

                      {/* Queue 3 */}
                      <div className="w-full max-w-md p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex justify-between items-center text-xs">
                        <span className="font-extrabold">Queue 3: Batch Processes (FCFS)</span>
                        <span className="bg-amber-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">PRIORITY 3</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Dynamic MLFQ Flowchart */
                  <div className={`p-6 rounded-2xl border text-center font-sans ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`} id="mlfq-diagram-canvas">
                    <div className="flex flex-col items-center space-y-4">
                      {/* Input */}
                      <div className="text-[10px] font-mono bg-blue-600 text-white font-extrabold px-2 py-1 rounded">
                        NEW PROCESS ENTERS
                      </div>

                      <div className="text-slate-400 text-xs font-mono">↓</div>

                      {/* Q0 */}
                      <div className="w-full max-w-md p-3.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex flex-col items-center space-y-2 text-xs">
                        <div className="flex justify-between w-full font-extrabold">
                          <span>Q0: Round Robin (Quantum = 2ms)</span>
                          <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">HIGHEST PRIO</span>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center">If process completes in &lt;= 2ms, it leaves. Else, it is demoted:</p>
                      </div>

                      <div className="text-slate-400 text-xs font-mono">↓ Demotion (If Quantum expired)</div>

                      {/* Q1 */}
                      <div className="w-full max-w-md p-3.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex flex-col items-center space-y-2 text-xs">
                        <div className="flex justify-between w-full font-extrabold">
                          <span>Q1: Round Robin (Quantum = 4ms)</span>
                          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">MEDIUM PRIO</span>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center">If process completes in &lt;= 4ms, it leaves. Else, it is demoted:</p>
                      </div>

                      <div className="text-slate-400 text-xs font-mono">↓ Demotion</div>

                      {/* Q2 */}
                      <div className="w-full max-w-md p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex flex-col items-center space-y-2 text-xs">
                        <div className="flex justify-between w-full font-extrabold">
                          <span>Q2: First Come First Serve (FCFS)</span>
                          <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">LOWEST PRIO</span>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center">Executes only when Q0 and Q1 are empty.</p>
                      </div>

                      <div className="w-full max-w-md border-t border-dashed border-slate-300 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2">
                        <span>Aging routine: promotes starving tasks from Q2 ⟶ Q0</span>
                        <span className="text-emerald-500">↑ PROMOTION</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
