/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BarChart3, HelpCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ComparisonViewProps {
  darkMode: boolean;
}

interface ComparisonRow {
  name: string;
  preemptive: string;
  starvation: string;
  starvationSeverity: 'none' | 'low' | 'high';
  responseTime: string;
  waitingTime: string;
  complexity: string;
  bestUse: string;
  cpuUtil: string;
  fairness: string;
  isBestFor?: string[]; // list of metrics this is best for
}

export default function ComparisonView({ darkMode }: ComparisonViewProps) {
  
  const comparisonData: ComparisonRow[] = [
    {
      name: 'FCFS (First Come First Serve)',
      preemptive: 'No',
      starvation: 'No Starvation',
      starvationSeverity: 'none',
      responseTime: 'Slow / Poor',
      waitingTime: 'High (Convoy Effect)',
      complexity: 'O(1) - Simple',
      bestUse: 'Batch systems, long-running processes',
      cpuUtil: 'High',
      fairness: 'Highly Fair (Strict Arrival order)',
      isBestFor: ['fairness']
    },
    {
      name: 'SJF (Shortest Job First - NP)',
      preemptive: 'No',
      starvation: 'Yes (Longer jobs starve)',
      starvationSeverity: 'high',
      responseTime: 'Medium',
      waitingTime: 'Optimal (lowest for NP)',
      complexity: 'O(N log N)',
      bestUse: 'Batch jobs with known execution lengths',
      cpuUtil: 'High',
      fairness: 'Poor (Favors short jobs)',
      isBestFor: ['waitingTime']
    },
    {
      name: 'SRTF (Preemptive SJF)',
      preemptive: 'Yes',
      starvation: 'Yes (Longer jobs starve)',
      starvationSeverity: 'high',
      responseTime: 'Fast for short tasks',
      waitingTime: 'Absolute Optimal',
      complexity: 'O(N log N)',
      bestUse: 'Interactive mixes where CPU bursts vary',
      cpuUtil: 'High',
      fairness: 'Poor (Biased to short tasks)',
      isBestFor: ['waitingTime', 'responseTime']
    },
    {
      name: 'Priority Scheduling',
      preemptive: 'Both (P & NP)',
      starvation: 'Yes (Low priority starves)',
      starvationSeverity: 'high',
      responseTime: 'Fast for critical tasks',
      waitingTime: 'High for low priority',
      complexity: 'O(N log N)',
      bestUse: 'Real-time and mission-critical workloads',
      cpuUtil: 'High',
      fairness: 'Poor (Biased to priority levels)',
      isBestFor: ['responseTime']
    },
    {
      name: 'Round Robin (RR)',
      preemptive: 'Yes',
      starvation: 'No Starvation',
      starvationSeverity: 'none',
      responseTime: 'Excellent / Fastest',
      waitingTime: 'Medium (Varies with quantum)',
      complexity: 'O(1) with queue',
      bestUse: 'Time-sharing, general interactive systems',
      cpuUtil: 'Medium (due to context switching)',
      fairness: 'Highly Fair (Equal Time Shares)',
      isBestFor: ['responseTime', 'fairness']
    },
    {
      name: 'Multilevel Queue (MLQ)',
      preemptive: 'Yes (Queue priority)',
      starvation: 'Yes (Lower queues starve)',
      starvationSeverity: 'high',
      responseTime: 'Fast for high-priority queues',
      waitingTime: 'High for low-priority queues',
      complexity: 'O(N) - Medium',
      bestUse: 'Systems with strict static task classes',
      cpuUtil: 'High',
      fairness: 'Very Poor (Favors foreground systems)',
    },
    {
      name: 'Multilevel Feedback Queue (MLFQ)',
      preemptive: 'Yes',
      starvation: 'No (Prevented via aging)',
      starvationSeverity: 'none',
      responseTime: 'Excellent for interactive jobs',
      waitingTime: 'Dynamic / Well balanced',
      complexity: 'O(N) - High complexity',
      bestUse: 'General purpose operating systems (Linux/Windows)',
      cpuUtil: 'Optimal (Adaptive to load)',
      fairness: 'Good (Adapts to process history)',
      isBestFor: ['cpuUtil', 'starvation']
    }
  ];

  return (
    <div className="space-y-8 pb-16 text-left" id="comparison-view">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white font-sans tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-indigo-500" />
          <span>Algorithms Multi-Metric Comparison</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          The table below evaluates each scheduling algorithm against core academic metrics. 
          The highest-performing cells for each parameter are highlighted with distinctive color codes to facilitate dynamic comparative learning.
        </p>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs text-left font-sans">
          <thead className={darkMode ? 'bg-slate-950' : 'bg-slate-50'}>
            <tr>
              <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider">Algorithm</th>
              <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-center">Preemptive</th>
              <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider">Starvation Risk</th>
              <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider">Response Time</th>
              <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider">Waiting Time</th>
              <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-center">Complexity</th>
              <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider">CPU Utilization</th>
              <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider">Fairness</th>
              <th className="px-4 py-3 font-extrabold text-slate-500 uppercase tracking-wider">Best Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {comparisonData.map((row) => (
              <tr key={row.name} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/10">
                {/* Name */}
                <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-white">{row.name}</td>
                
                {/* Preemptive */}
                <td className="px-4 py-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    row.preemptive.includes('Yes') 
                      ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20' 
                      : row.preemptive.includes('Both') 
                      ? 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20'
                      : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                  }`}>
                    {row.preemptive}
                  </span>
                </td>
                
                {/* Starvation */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center space-x-1.5">
                    {row.starvationSeverity === 'none' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span className={`font-semibold ${
                      row.starvationSeverity === 'none' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-red-500 dark:text-red-400'
                    }`}>
                      {row.starvation}
                    </span>
                  </div>
                </td>
                
                {/* Response Time */}
                <td className={`px-4 py-3.5 font-medium ${
                  row.isBestFor?.includes('responseTime') 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500' 
                    : ''
                }`}>
                  {row.responseTime}
                </td>
                
                {/* Waiting Time */}
                <td className={`px-4 py-3.5 font-medium ${
                  row.isBestFor?.includes('waitingTime') 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500' 
                    : ''
                }`}>
                  {row.waitingTime}
                </td>
                
                {/* Complexity */}
                <td className="px-4 py-3.5 text-center font-mono">{row.complexity}</td>
                
                {/* CPU Utilization */}
                <td className={`px-4 py-3.5 font-medium ${
                  row.isBestFor?.includes('cpuUtil') 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500' 
                    : ''
                }`}>
                  {row.cpuUtil}
                </td>

                {/* Fairness */}
                <td className={`px-4 py-3.5 font-medium ${
                  row.isBestFor?.includes('fairness') 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500' 
                    : ''
                }`}>
                  {row.fairness}
                </td>

                {/* Best Use Case */}
                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 italic max-w-xs truncate">{row.bestUse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Evaluation summary */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-blue-50/50 border-blue-100'
      }`}>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase mb-3 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-indigo-500" />
          <span>General Academic Verdict</span>
        </h4>
        <div className="grid md:grid-cols-3 gap-6 text-xs leading-relaxed">
          <div className="space-y-1">
            <span className="font-bold text-emerald-500 block">SJF / SRTF for Averages</span>
            <p className="text-slate-500 dark:text-slate-400">
              SJF and SRTF are mathematically proven to yield the lowest possible average waiting times, making them excellent choices for pure efficiency, although they ignore task fairness.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-indigo-500 block">Round Robin for Responsiveness</span>
            <p className="text-slate-500 dark:text-slate-400">
              Round Robin (RR) scheduling is the industry standard for interactive desktop environments, as it guarantees that no process is starved of attention, providing rapid initial feedback.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-purple-500 block">MLFQ for Real-Life Balance</span>
            <p className="text-slate-500 dark:text-slate-400">
              Multilevel Feedback Queue (MLFQ) scheduling delivers the best real-life compromise. It automatically profiles tasks and rewards short interactive bursts while keeping long tasks running in background queues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
