/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, Download, CheckCircle2, ShieldAlert, BookOpen, ScrollText } from 'lucide-react';
import { useState } from 'react';
import { programsData } from '../data/programsData';

interface DownloadsViewProps {
  darkMode: boolean;
}

export default function DownloadsView({ darkMode }: DownloadsViewProps) {
  const [downloadStates, setDownloadStates] = useState<{ [id: string]: boolean }>({});

  const triggerDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Toggle temporary visual success tick
    setDownloadStates((prev) => ({ ...prev, [filename]: true }));
    setTimeout(() => {
      setDownloadStates((prev) => ({ ...prev, [filename]: false }));
    }, 3000);
  };

  const downloadCheatSheet = () => {
    const content = `==========================================================
              OS SCHEDULER LAB - CHEAT SHEET
           Operating Systems process scheduling
==========================================================

1. CORE FORMULAS:
----------------------------------------------------------
* Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)
* Waiting Time (WT)     = Turnaround Time (TAT) - Burst Time (BT)
* Response Time (RT)    = First CPU Response Time - Arrival Time (AT)
* CPU Utilization       = (Total Timeline - CPU Idle time) / Total Timeline * 100
* Throughput            = Number of Completed Processes / Total Timeline

2. ALGORITHMIC PERFORMANCE MATRIX:
----------------------------------------------------------
Algorithm     | Preemptive | Starvation Risk | Complexity | Best For
--------------|------------|-----------------|------------|----------------------
FCFS          | No         | No Risk         | O(1)       | Long Batch operations
SJF           | No         | High Risk       | O(N log N) | Optimal NP averages
SRTF (SJF Pre)| Yes        | High Risk       | O(N log N) | Minimum avg wait time
Priority      | Both       | High Risk       | O(N log N) | Mission critical tasks
Round Robin   | Yes        | No Risk         | O(1)       | Interactive OS (RR)
MLQ           | Yes        | High Risk       | O(N)       | Static divisions
MLFQ          | Yes        | No (via Aging)  | O(N)       | General OS (Adaptive)

3. TYPICAL TIE BREAKER LAWS:
----------------------------------------------------------
In almost all academic syllabuses (like SPPU), when burst durations or priorities 
align exactly, the tie breaker is solved in FIFO order by checking Arrival Time.

Generated dynamically by OS Scheduler Lab Portal.
==========================================================`;
    triggerDownload('OS_Scheduler_Cheat_Sheet.txt', content);
  };

  const downloadLabManual = () => {
    const content = `==========================================================
               OS SCHEDULER LAB - LAB MANUAL
             Operating Systems Laboratory Manual
==========================================================

LAB EXPERIMENT 1: FCFS Process Scheduling Implementation
----------------------------------------------------------
Objective:
To implement and analyze First Come First Serve (FCFS) process scheduling algorithm.

Description:
FCFS is non-preemptive. The process that requests the CPU first gets the CPU allocation 
first. It is implemented using a FIFO queue.

LAB EXPERIMENT 2: SJF (Non-Preemptive) Implementation
----------------------------------------------------------
Objective:
To implement Shortest Job First (SJF) scheduling algorithm and evaluate its average metrics.

Description:
SJF selects the process with the shortest CPU burst time. Ties are settled using FCFS.

LAB EXPERIMENT 3: Preemptive Round Robin Implementation
----------------------------------------------------------
Objective:
To design and implement a Round Robin scheduler using a custom Time Quantum.

Description:
Processes are allocated the CPU in circular slices. If a process does not complete 
within the quantum, it is preempted and put at the end of the ready queue.

==========================================================`;
    triggerDownload('OS_Scheduler_Lab_Manual.txt', content);
  };

  const downloadNotes = () => {
    const content = `==========================================================
               OS CPU SCHEDULER - REVISION NOTES
                   Computer Engineering Dept
==========================================================

1. WHAT IS CPU SCHEDULER?
----------------------------------------------------------
The CPU scheduler (short-term scheduler) selects from among the processes 
in memory that are ready to execute and allocates the CPU to one of them.

2. SCHEDULING CRITERIA:
----------------------------------------------------------
* CPU Utilization: Keep the CPU as busy as possible.
* Throughput: Number of processes completed per unit time.
* Turnaround Time: Total time from submission to completion.
* Waiting Time: Amount of time a process spent waiting in ready queue.
* Response Time: Time from submission until first response is received.

3. STARVATION AND AGING:
----------------------------------------------------------
Starvation occurs when low priority tasks sit in the ready queue indefinitely. 
Aging gradually increases the priority of low-priority tasks waiting in the 
queue for long periods, preventing starvation.

==========================================================`;
    triggerDownload('OS_Scheduler_Revision_Notes.txt', content);
  };

  const downloadAllCPrograms = () => {
    let content = `// ==========================================================\n`;
    content += `//          OS SCHEDULER LAB - COMPILATION DIRECTORY\n`;
    content += `// ==========================================================\n\n`;
    
    for (const prog of programsData) {
      content += `// ==========================================================\n`;
      content += `// ALGORITHM: ${prog.title}\n`;
      content += `// ==========================================================\n\n`;
      content += prog.code;
      content += `\n\n\n`;
    }
    
    triggerDownload('OS_Scheduler_All_C_Programs.c', content);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-left" id="downloads-view">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white font-sans tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-500" />
          <span>Educational Resources Downloader</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Obtain actual physical files containing lab notes, formulas cheatsheets, official lab manuals, and compilable C files directly to your device.
        </p>
      </div>

      {/* Grid containing download cards */}
      <div className="grid sm:grid-cols-2 gap-6" id="downloads-bento-grid">
        
        {/* Revision Notes Card */}
        <div className={`p-6 rounded-2xl border text-left flex flex-col justify-between space-y-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="space-y-2">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl w-fit">
              <ScrollText className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans">Lab Revision Notes</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Curated lecture notes detailing CPU scheduler criteria, preemptive bounds, context switching, dispatcher latencies, and aging mechanics.
            </p>
          </div>
          <button
            id="download-btn-notes"
            onClick={downloadNotes}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <Download className="h-4 w-4" />
            <span>{downloadStates['OS_Scheduler_Revision_Notes.txt'] ? 'Downloaded!' : 'Download Revision Notes'}</span>
          </button>
        </div>

        {/* Cheat Sheet Card */}
        <div className={`p-6 rounded-2xl border text-left flex flex-col justify-between space-y-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="space-y-2">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl w-fit">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans">Syllabus Formulas Cheat Sheet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Quick formulas and comparison matrices summarizing TAT, WT, RT, throughput, complexities, and best-use cases on a single cheat sheet.
            </p>
          </div>
          <button
            id="download-btn-cheat"
            onClick={downloadCheatSheet}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <Download className="h-4 w-4" />
            <span>{downloadStates['OS_Scheduler_Cheat_Sheet.txt'] ? 'Downloaded!' : 'Download Cheat Sheet'}</span>
          </button>
        </div>

        {/* Lab Manual Card */}
        <div className={`p-6 rounded-2xl border text-left flex flex-col justify-between space-y-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="space-y-2">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl w-fit">
              <ScrollText className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans">Lab Course Manual</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Curated experiments manual aligning with Savitribai Phule Pune University (SPPU) standards, including objective, theory, and sample mock records.
            </p>
          </div>
          <button
            id="download-btn-manual"
            onClick={downloadLabManual}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <Download className="h-4 w-4" />
            <span>{downloadStates['OS_Scheduler_Lab_Manual.txt'] ? 'Downloaded!' : 'Download Lab Manual'}</span>
          </button>
        </div>

        {/* C Programs Bundler */}
        <div className={`p-6 rounded-2xl border text-left flex flex-col justify-between space-y-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="space-y-2">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl w-fit">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white font-sans">All C Programs Source Bundle</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Unified source code collection (`OS_Scheduler_All_C_Programs.c`) containing complete commented implementations of FCFS, SJF, Priority, and Round Robin.
            </p>
          </div>
          <button
            id="download-btn-c-codes"
            onClick={downloadAllCPrograms}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <Download className="h-4 w-4" />
            <span>{downloadStates['OS_Scheduler_All_C_Programs.c'] ? 'Downloaded!' : 'Download Unified C Codes'}</span>
          </button>
        </div>

      </div>

      {/* Syllabus Notice */}
      <div className={`p-4 rounded-xl border flex items-center space-x-3 text-xs text-slate-400 leading-normal ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
        <p>All downloaded documents are generated in standard cross-platform UTF-8 plain-text (.txt or .c) format, allowing seamless viewing on all mobile and desktop devices without requiring specialized reading software.</p>
      </div>

    </div>
  );
}
