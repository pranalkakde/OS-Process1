/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Process, ScheduledProcess, GanttChartStep, SimulationResult, AlgorithmType } from '../types';
import { solveScheduling } from '../utils/scheduler';
import { 
  Play, Pause, RotateCcw, Plus, Trash2, Sliders, RefreshCw, Cpu, 
  ArrowRight, CheckCircle2, Award, Clock, Activity, Zap 
} from 'lucide-react';

interface SimulatorViewProps {
  darkMode: boolean;
}

const PRESETS = [
  {
    name: 'Normal Mix (SJF vs SRTF Test)',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 6, priority: 3 },
      { id: 'P2', arrivalTime: 1, burstTime: 2, priority: 1 },
      { id: 'P3', arrivalTime: 3, burstTime: 4, priority: 4 },
      { id: 'P4', arrivalTime: 4, burstTime: 1, priority: 2 },
    ]
  },
  {
    name: 'Convoy Effect demonstration (FCFS Demo)',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 15, priority: 2 },
      { id: 'P2', arrivalTime: 1, burstTime: 2, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 2, priority: 3 },
    ]
  },
  {
    name: 'Priority Overrides',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 4 },
      { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 6, priority: 2 },
      { id: 'P4', arrivalTime: 3, burstTime: 2, priority: 3 },
    ]
  }
];

const ALGORITHMS_LIST = [
  { id: 'FCFS', name: 'FCFS', mode: 'Non-Preemptive', desc: 'First arrivals served first.' },
  { id: 'SJF', name: 'SJF (NP)', mode: 'Non-Preemptive', desc: 'Shortest job burst duration first.' },
  { id: 'SRTF', name: 'SRTF (P-SJF)', mode: 'Preemptive', desc: 'Shortest remaining time first.' },
  { id: 'PRIORITY_NP', name: 'Priority (NP)', mode: 'Non-Preemptive', desc: 'Schedules tasks by priority levels.' },
  { id: 'PRIORITY_P', name: 'Priority (P)', mode: 'Preemptive', desc: 'Preemptive priority levels execution.' },
  { id: 'RR', name: 'Round Robin', mode: 'Preemptive', desc: 'Fixed time quantum per process.' }
];

export default function SimulatorView({ darkMode }: SimulatorViewProps) {
  // Simulator input states
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 3 },
    { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 4 },
    { id: 'P4', arrivalTime: 4, burstTime: 2, priority: 2 },
  ]);

  const [inputArrival, setInputArrival] = useState<number>(0);
  const [inputBurst, setInputBurst] = useState<number>(4);
  const [inputPriority, setInputPriority] = useState<number>(1);
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [priorityOrder, setPriorityOrder] = useState<'low-is-high' | 'high-is-low'>('low-is-high');

  // Simulation calculation outputs
  const [result, setResult] = useState<SimulationResult>({
    scheduledProcesses: [],
    ganttChart: [],
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    cpuUtilization: 0,
    throughput: 0,
  });

  // Animation states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTick, setCurrentTick] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per simulated tick
  const maxTick = result.ganttChart.length > 0 ? result.ganttChart[result.ganttChart.length - 1].endTime : 0;
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger calculation when inputs or parameters change
  useEffect(() => {
    const solved = solveScheduling(processes, selectedAlgo, timeQuantum, priorityOrder);
    setResult(solved);
    
    // Stop and reset playback when results recalculate
    setIsPlaying(false);
    setCurrentTick(0);
  }, [processes, selectedAlgo, timeQuantum, priorityOrder]);

  // Handle Playback Interval timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTick((prev) => {
          if (prev >= maxTick) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, maxTick, playbackSpeed]);

  // Handle process addition
  const handleAddProcess = () => {
    // Generate next sequential P-ID
    const nextNum = processes.length > 0 
      ? Math.max(...processes.map(p => parseInt(p.id.replace('P', '')))) + 1 
      : 1;
    const nextId = `P${nextNum}`;

    const newProc: Process = {
      id: nextId,
      arrivalTime: inputArrival,
      burstTime: inputBurst,
      priority: inputPriority
    };

    setProcesses([...processes, newProc]);
  };

  // Remove a process
  const handleRemoveProcess = (id: string) => {
    setProcesses(processes.filter((p) => p.id !== id));
  };

  // Clear all processes
  const handleClearProcesses = () => {
    setProcesses([]);
  };

  // Reset to default standard state
  const handleResetSimulator = () => {
    setProcesses([
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 3 },
      { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 4 },
      { id: 'P4', arrivalTime: 4, burstTime: 2, priority: 2 },
    ]);
    setSelectedAlgo('FCFS');
    setTimeQuantum(2);
    setPriorityOrder('low-is-high');
    setCurrentTick(0);
    setIsPlaying(false);
  };

  // Apply a preset
  const handleApplyPreset = (idx: number) => {
    const preset = PRESETS[idx];
    setProcesses(preset.processes.map(p => ({ ...p })));
  };

  // Helper to determine what process is in CPU, Ready queue, and Completed queue at currentTick
  const getStatesAtTick = (tick: number) => {
    let running: string = 'IDLE';
    let ready: string[] = [];
    let completed: string[] = [];

    // Find running process at tick
    const activeBlock = result.ganttChart.find(step => tick >= step.startTime && tick < step.endTime);
    if (activeBlock) {
      running = activeBlock.processId;
    }

    // Identify processes states
    for (const p of processes) {
      const scheduled = result.scheduledProcesses.find(sp => sp.id === p.id);
      
      // If process hasn't arrived yet, skip
      if (p.arrivalTime > tick) continue;

      // If it is completed before or at this tick
      if (scheduled && scheduled.completionTime <= tick) {
        completed.push(p.id);
      } 
      // Else if it's the one currently executing
      else if (p.id === running) {
        // currently executing on CPU
      } 
      // Else, it must be waiting in the ready queue
      else {
        ready.push(p.id);
      }
    }

    return { running, ready, completed };
  };

  const currentStates = getStatesAtTick(currentTick);

  return (
    <div className="space-y-8 pb-16 text-left" id="simulator-page">
      {/* Page Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white font-sans tracking-tight flex items-center gap-2">
          <Sliders className="h-6 w-6 text-blue-500" />
          <span>Interactive OS Scheduling Simulator</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Modify variables below to design workload bursts, choose scheduling algorithms, and preview live state execution step-by-step.
        </p>
      </div>

      {/* Main Grid Wrapper */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (Input forms + Parameter configurations) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Presets selector */}
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`} id="presets-panel">
            <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase block mb-2">QUICK PRACTICE PRESETS</span>
            <div className="flex flex-wrap gap-2" id="presets-btn-container">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  id={`preset-btn-${idx}`}
                  onClick={() => handleApplyPreset(idx)}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  {p.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Config Parameters */}
          <div className={`p-5 rounded-2xl border text-left ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/80 shadow-md'
          }`} id="algorithm-config-parameters">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Algorithm</h3>
            
            <div className="space-y-4">
              {/* Algorithm picker card list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="algo-cards-grid">
                {ALGORITHMS_LIST.map((algo) => {
                  const isActive = selectedAlgo === algo.id;
                  return (
                    <button
                      key={algo.id}
                      id={`algo-card-btn-${algo.id}`}
                      onClick={() => setSelectedAlgo(algo.id as AlgorithmType)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                        isActive
                          ? darkMode
                            ? 'bg-blue-600/10 border-blue-500/50 ring-2 ring-blue-500/25 text-white'
                            : 'bg-white border-blue-500 ring-2 ring-blue-500/15 shadow-sm text-slate-950 font-bold'
                          : darkMode
                          ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                          : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full gap-1 mb-1.5">
                        <span className="font-extrabold text-xs font-sans">{algo.name}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          algo.mode === 'Preemptive'
                            ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {algo.mode === 'Preemptive' ? 'PRE' : 'N-PRE'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                        {algo.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Time Quantum (Round Robin only) */}
              {selectedAlgo === 'RR' && (
                <div className="space-y-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-extrabold text-blue-500">Time Quantum</label>
                    <span className="font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded text-[10px]">
                      {timeQuantum} ms
                    </span>
                  </div>
                  <input
                    type="range"
                    id="input-quantum-range"
                    min="1"
                    max="10"
                    value={timeQuantum}
                    onChange={(e) => setTimeQuantum(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Higher values approximate FCFS, smaller values increase context switches.
                  </p>
                </div>
              )}

              {/* Priority configuration (Priority algorithms only) */}
              {(selectedAlgo === 'PRIORITY_NP' || selectedAlgo === 'PRIORITY_P') && (
                <div className="space-y-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                  <label className="text-xs font-extrabold text-purple-500 block">Priority Value Order</label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center space-x-2 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="priorityOrder"
                        checked={priorityOrder === 'low-is-high'}
                        onChange={() => setPriorityOrder('low-is-high')}
                        className="accent-purple-500"
                      />
                      <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Lower No. = Higher Priority (Syllabus Std)</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center space-x-2 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="priorityOrder"
                        checked={priorityOrder === 'high-is-low'}
                        onChange={() => setPriorityOrder('high-is-low')}
                        className="accent-purple-500"
                      />
                      <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Higher No. = Higher Priority</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Process Creator */}
          <div className={`p-5 rounded-2xl border text-left ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/80 shadow-md'
          }`} id="process-creator-form">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Add Custom Process</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrival Time</label>
                <input
                  type="number"
                  min="0"
                  id="proc-arrival-input"
                  value={inputArrival}
                  onChange={(e) => setInputArrival(Math.max(0, parseInt(e.target.value) || 0))}
                  className={`w-full p-2 border.5 rounded-lg text-xs font-mono outline-none transition-all ${
                    darkMode 
                      ? 'bg-slate-950 border-slate-850 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10' 
                      : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                  }`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Burst Time</label>
                <input
                  type="number"
                  min="1"
                  id="proc-burst-input"
                  value={inputBurst}
                  onChange={(e) => setInputBurst(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full p-2 border.5 rounded-lg text-xs font-mono outline-none transition-all ${
                    darkMode 
                      ? 'bg-slate-950 border-slate-850 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10' 
                      : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                  }`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority No.</label>
                <input
                  type="number"
                  min="1"
                  id="proc-priority-input"
                  value={inputPriority}
                  onChange={(e) => setInputPriority(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full p-2 border.5 rounded-lg text-xs font-mono outline-none transition-all ${
                    darkMode 
                      ? 'bg-slate-950 border-slate-850 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10' 
                      : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                id="add-process-btn"
                onClick={handleAddProcess}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Process</span>
              </button>
              <button
                id="clear-all-btn"
                onClick={handleClearProcesses}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                  darkMode 
                    ? 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white' 
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 shadow-sm'
                }`}
                title="Clear entered workload queue"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Output Columns (Gantt, Stats, List, Animation) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Workload list table */}
          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/80 shadow-md'
          }`} id="workload-list-table">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Workload Task Registry</h3>
              <button
                id="reset-simulator-btn"
                onClick={handleResetSimulator}
                className="text-xs text-blue-500 dark:text-blue-400 font-bold flex items-center space-x-1 hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Default</span>
              </button>
            </div>

            {processes.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                Queue is empty. Enter processes or select a practice preset above.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs font-mono">
                  <thead className={darkMode ? 'bg-slate-950/80' : 'bg-slate-50'}>
                    <tr>
                      <th className="px-4 py-2.5 text-left font-bold uppercase tracking-wider text-slate-400">Task PID</th>
                      <th className="px-4 py-2.5 text-center font-bold uppercase tracking-wider text-slate-400">Arrival Time</th>
                      <th className="px-4 py-2.5 text-center font-bold uppercase tracking-wider text-slate-400">Burst Time</th>
                      <th className="px-4 py-2.5 text-center font-bold uppercase tracking-wider text-slate-400">Priority</th>
                      <th className="px-4 py-2.5 text-right font-bold uppercase tracking-wider text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {processes.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2.5 text-left font-bold text-blue-500">{p.id}</td>
                        <td className="px-4 py-2.5 text-center">{p.arrivalTime} ms</td>
                        <td className="px-4 py-2.5 text-center">{p.burstTime} ms</td>
                        <td className="px-4 py-2.5 text-center font-bold text-purple-400">{p.priority}</td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => handleRemoveProcess(p.id)}
                            className="text-red-500 hover:text-red-600 font-bold hover:underline"
                            title={`Delete process ${p.id}`}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Calculated Output Matrix */}
          {result.scheduledProcesses.length > 0 && (
            <div className={`p-5 rounded-2xl border space-y-6 ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/80 shadow-md'
            }`} id="simulator-output-matrix">
              
              {/* Output Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800 gap-2">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest font-mono">SIMULATION COMPILED SUCCESS</span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mt-0.5">Calculated Schedules</h3>
                </div>
                <div className="text-xs bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded font-mono font-bold border dark:border-slate-800">
                  Scale: {maxTick} ms total
                </div>
              </div>

              {/* Averages Bento Cards */}
              <div className="grid sm:grid-cols-4 gap-4 text-center">
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-amber-500/5 border-amber-100'}`}>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Avg Waiting Time</p>
                  <p className="text-xl font-extrabold font-mono text-amber-500 mt-1">{result.averageWaitingTime}ms</p>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-emerald-500/5 border-emerald-100'}`}>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Avg Turnaround Time</p>
                  <p className="text-xl font-extrabold font-mono text-emerald-500 mt-1">{result.averageTurnaroundTime}ms</p>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-blue-500/5 border-blue-100'}`}>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">CPU Utilization</p>
                  <p className="text-xl font-extrabold font-mono text-blue-500 mt-1">{result.cpuUtilization}%</p>
                </div>
                <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-indigo-500/5 border-indigo-100'}`}>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Throughput</p>
                  <p className="text-sm font-extrabold font-mono text-indigo-500 mt-1.5">{result.throughput} task/ms</p>
                </div>
              </div>

              {/* Gantt Chart Horizontal Block view */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gantt Execution Timeline</span>
                  <span className="text-[10px] font-mono text-slate-500">Left-to-Right Execution Order</span>
                </div>
                <div className="flex h-12 rounded-xl overflow-hidden border border-slate-250 dark:border-slate-800 text-xs font-mono font-bold" id="gantt-execution-timeline">
                  {result.ganttChart.map((step, idx) => {
                    const blockDuration = step.endTime - step.startTime;
                    return (
                      <div
                        key={idx}
                        className={`h-full flex flex-col justify-center items-center border-r last:border-r-0 border-slate-200 dark:border-slate-800 relative group cursor-help transition-all hover:brightness-110 ${
                          step.processId === 'IDLE' 
                            ? 'bg-slate-400/25 text-slate-400' 
                            : step.processId === 'P1' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : step.processId === 'P2' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : step.processId === 'P3' 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                        style={{ flexGrow: blockDuration }}
                      >
                        <span className="text-xs font-extrabold">{step.processId}</span>
                        <span className="text-[8px] font-normal text-slate-400">({blockDuration}ms)</span>
                        <span className="absolute bottom-0.5 left-1 text-[8px] text-slate-400 font-normal">{step.startTime}</span>
                        <span className="absolute bottom-0.5 right-1 text-[8px] text-slate-400 font-normal">{step.endTime}</span>

                        {/* Hover Tooltip detail */}
                        <div className="hidden group-hover:block absolute bottom-14 left-1/2 -translate-x-1/2 z-20 w-32 p-2 rounded-lg bg-slate-900 border border-slate-800 shadow-xl text-white text-[10px] font-sans text-center leading-normal">
                          <p className="font-bold text-blue-400">{step.processId}</p>
                          <p>Start: {step.startTime} ms</p>
                          <p>End: {step.endTime} ms</p>
                          <p>Duration: {blockDuration} ms</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Metrics Table per Process */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-850">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs font-mono">
                  <thead className={darkMode ? 'bg-slate-950/65' : 'bg-slate-50'}>
                    <tr>
                      <th className="px-3 py-2 text-left font-bold uppercase tracking-wider text-slate-400">PID</th>
                      <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Arrival</th>
                      <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Burst</th>
                      <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Complete</th>
                      <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Turnaround</th>
                      <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Waiting</th>
                      <th className="px-3 py-2 text-center font-bold uppercase tracking-wider text-slate-400">Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {result.scheduledProcesses.map((proc) => (
                      <tr key={proc.id}>
                        <td className="px-3 py-2 text-left font-bold text-blue-500">{proc.id}</td>
                        <td className="px-3 py-2 text-center">{proc.arrivalTime} ms</td>
                        <td className="px-3 py-2 text-center">{proc.burstTime} ms</td>
                        <td className="px-3 py-2 text-center font-bold">{proc.completionTime} ms</td>
                        <td className="px-3 py-2 text-center font-bold text-emerald-500">{proc.turnaroundTime} ms</td>
                        <td className="px-3 py-2 text-center font-bold text-amber-500">{proc.waitingTime} ms</td>
                        <td className="px-3 py-2 text-center font-bold text-indigo-500">{proc.responseTime} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Interactive Playback Controls */}
              <div className={`p-4 rounded-xl border space-y-4 ${
                darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
              }`} id="animation-controls-box">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-left">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Live Execution Playback Simulation</h4>
                    <p className="text-[10px] text-slate-500">
                      Step through each clock millisecond to watch CPU registers and task state transitions.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Play/Pause */}
                    <button
                      id="playback-play-pause"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`p-2 rounded-lg text-white font-bold text-xs flex items-center space-x-1.5 ${
                        isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                    {/* Reset tick */}
                    <button
                      id="playback-reset"
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentTick(0);
                      }}
                      className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                      title="Reset playback timeline"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Timeline slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>Tick: 0 ms</span>
                    <span className="text-blue-500 font-bold">Current Timeline Tick: {currentTick} ms</span>
                    <span>Max: {maxTick} ms</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxTick}
                    value={currentTick}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setCurrentTick(Number(e.target.value));
                    }}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* Speed selector */}
                <div className="flex items-center space-x-4 text-xs">
                  <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wide">Simulation Clock Interval Speed</span>
                  <div className="flex space-x-1">
                    {[
                      { label: '0.5x', ms: 1500 },
                      { label: '1.0x', ms: 1000 },
                      { label: '2.0x', ms: 500 },
                      { label: '4.0x', ms: 250 }
                    ].map((s) => (
                      <button
                        key={s.ms}
                        onClick={() => setPlaybackSpeed(s.ms)}
                        className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-colors ${
                          playbackSpeed === s.ms 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual Learning Section (Ready Queue ⟶ Running ⟶ Completed Queue diagram) */}
              <div className={`p-5 rounded-xl border text-center ${
                darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200 shadow-inner'
              }`} id="learning-execution-flows">
                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4 text-left">
                  Visual Learning Queue Diagram (Tick: {currentTick}ms)
                </h4>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
                  
                  {/* Ready Queue list */}
                  <div className="flex-1 w-full text-left space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">Ready Queue</span>
                    <div className="min-h-16 flex items-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                      {currentStates.ready.length === 0 ? (
                        <span className="text-[10px] text-slate-400 block w-full text-center py-2">Empty Ready Queue</span>
                      ) : (
                        currentStates.ready.map((pid) => (
                          <span
                            key={pid}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold border shadow-sm animate-pulse ${
                              pid === 'P1' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                              pid === 'P2' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              pid === 'P3' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            {pid}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex md:flex-col items-center justify-center text-indigo-500">
                    <ArrowRight className="h-5 w-5 transform md:rotate-0 rotate-90 animate-bounce" />
                    <span className="text-[8px] font-mono tracking-widest hidden md:block">LOAD</span>
                  </div>

                  {/* CPU / Active core representation */}
                  <div className="flex-1 w-full text-left space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">Running CPU Core</span>
                    <div className={`min-h-16 flex items-center justify-center p-3 rounded-xl border relative overflow-hidden ${
                      darkMode ? 'bg-slate-900 border-indigo-900/30' : 'bg-blue-50 border-blue-200'
                    }`}>
                      {/* Live flashing core background */}
                      {currentStates.running !== 'IDLE' && (
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500/10 rounded-full animate-ping"></span>
                      )}

                      <div className="flex items-center space-x-3 z-10">
                        <Cpu className={`h-6 w-6 text-indigo-500 ${currentStates.running !== 'IDLE' ? 'animate-spin' : ''}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            {currentStates.running === 'IDLE' ? 'SYSTEM IDLE' : `EXECUTING: ${currentStates.running}`}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {currentStates.running === 'IDLE' ? 'No instructions loaded' : `Processing instruction set`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex md:flex-col items-center justify-center text-emerald-500">
                    <ArrowRight className="h-5 w-5 transform md:rotate-0 rotate-90" />
                    <span className="text-[8px] font-mono tracking-widest hidden md:block">COMPLETE</span>
                  </div>

                  {/* Completed Queue list */}
                  <div className="flex-1 w-full text-left space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">Completed processes</span>
                    <div className="min-h-16 flex items-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                      {currentStates.completed.length === 0 ? (
                        <span className="text-[10px] text-slate-400 block w-full text-center py-2">No processes finished</span>
                      ) : (
                        currentStates.completed.map((pid) => (
                          <span
                            key={pid}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold border shadow-sm ${
                              pid === 'P1' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
                              pid === 'P2' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                              pid === 'P3' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                              'bg-blue-500/10 text-blue-300 border-blue-500/20'
                            }`}
                          >
                            {pid} ✓
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
