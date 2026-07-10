/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Play, BookOpen, GraduationCap, Code2, Award, ArrowRight, Activity, Terminal, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
}

export default function HomeView({ setActiveTab, darkMode }: HomeViewProps) {
  const [clockCycle, setClockCycle] = useState(0);
  const [activeProcessId, setActiveProcessId] = useState('P1');
  const [cpuLoad, setCpuLoad] = useState(85);

  // Simple simulator for the CPU live illustration
  useEffect(() => {
    const timer = setInterval(() => {
      setClockCycle((prev) => (prev + 1) % 100);
      setCpuLoad(Math.floor(70 + Math.random() * 25));
      
      // Rotate active process between P1, P2, P3
      setActiveProcessId((prev) => {
        if (prev === 'P1') return Math.random() > 0.6 ? 'P2' : 'P1';
        if (prev === 'P2') return Math.random() > 0.6 ? 'P3' : 'P2';
        return Math.random() > 0.6 ? 'P1' : 'P3';
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const featureCards = [
    {
      title: '7 Scheduling Algorithms',
      description: 'Master FCFS, SJF, SRTF, Priority (P/NP), Round Robin, MLQ, and MLFQ with clear theory, examples, and formulas.',
      icon: BookOpen,
      color: 'blue',
      tab: 'algorithms',
    },
    {
      title: 'Interactive Simulator',
      description: 'Enter processes with custom parameters, select scheduling algorithms, and watch real-time animated Gantt Chart calculations.',
      icon: Play,
      color: 'emerald',
      tab: 'simulator',
    },
    {
      title: 'Interactive Practice Quiz',
      description: 'Test your operating system expertise with 20 conceptual scheduling questions featuring instant feedback and detailed explanations.',
      icon: Award,
      color: 'purple',
      tab: 'quiz',
    },
    {
      title: '30 Viva Exam Questions',
      description: 'Crack your engineering laboratory practical exams with curated frequently-asked viva questions and professional answers.',
      icon: GraduationCap,
      color: 'orange',
      tab: 'viva',
    },
    {
      title: 'C Lab Programs',
      description: 'Explore fully compilable and commented standard C programs for all major algorithms with syntax highlighting and copy support.',
      icon: Code2,
      color: 'red',
      tab: 'programs',
    },
  ];

  return (
    <div className="space-y-12 pb-16" id="home-view">
      {/* Top Banner - College Affiliation */}
      <div 
        className={`rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between border ${
          darkMode 
            ? 'bg-slate-900/50 border-slate-800 text-slate-300' 
            : 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-blue-100 text-slate-700'
        }`}
        id="sppu-banner"
      >
        <div className="flex items-center space-x-3 text-center sm:text-left mb-3 sm:mb-0">
          <div className="bg-red-500 text-white font-extrabold text-xs px-2.5 py-1 rounded">SPPU</div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase">Savitribai Phule Pune University</p>
            <p className="text-[10px] font-mono text-slate-500">Department of Computer Engineering • Operating Systems Lab</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/50">
          Academic Session 2026-2027
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid lg:grid-cols-12 gap-12 items-center" id="hero-section">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-900/30">
            <Activity className="h-4 w-4 animate-spin text-blue-500" />
            <span>Interactive Multi-Queue OS Scheduling Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight" id="hero-title">
            Learn CPU Scheduling <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Visually & Dynamically
            </span>
          </h1>

          <p className={`text-base leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} id="hero-description">
            Dive into the core algorithms that power modern task execution inside operating systems. 
            Simulate workloads, analyze Gantt charts, practice concept quizzes, and download compilable 
            laboratory resources. Designed specially for computer engineering students preparing for SPPU labs.
          </p>

          <div className="flex flex-wrap gap-4" id="hero-actions">
            <button
              id="hero-start-learning-btn"
              onClick={() => setActiveTab('simulator')}
              className="px-6 py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all flex items-center space-x-2 text-sm"
            >
              <span>Start Simulator Lab</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="hero-read-theory-btn"
              onClick={() => setActiveTab('algorithms')}
              className={`px-6 py-3.5 rounded-xl font-bold border transition-all text-sm ${
                darkMode 
                  ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300' 
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
              }`}
            >
              Learn Algorithms Theory
            </button>
          </div>
        </div>

        {/* Operating System CPU Live Illustration */}
        <div className="lg:col-span-5 flex justify-center" id="hero-illustration">
          <div className={`relative w-full max-w-[380px] aspect-square rounded-2xl border p-6 overflow-hidden ${
            darkMode 
              ? 'bg-slate-950 border-slate-800 shadow-2xl shadow-blue-950/20' 
              : 'bg-slate-50 border-slate-200 shadow-xl shadow-slate-200/50'
          }`}>
            <div className="absolute top-3 left-4 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span className="text-[10px] font-mono text-slate-400 ml-2">os_kernel_simulation.sys</span>
            </div>

            <div className="absolute top-3 right-4 font-mono text-[9px] text-blue-500 dark:text-blue-400">
              Uptime: {clockCycle}s
            </div>

            {/* Central CPU Core Core Block */}
            <div className="h-full flex flex-col justify-between pt-6" id="cpu-simulator-diagram">
              {/* Ready Queue visual block */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] font-bold font-sans uppercase tracking-wider text-slate-400 dark:text-slate-500">Ready Queue (FIFO)</span>
                  <span className="text-[10px] font-mono text-slate-500">Length: 3</span>
                </div>
                <div className={`flex space-x-2 p-2 rounded-lg border border-dashed ${
                  darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-inner'
                }`}>
                  <div className="w-12 py-1.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-500 text-center font-mono text-xs font-bold shadow-sm animate-pulse">
                    P3
                  </div>
                  <div className="w-12 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-center font-mono text-xs font-bold shadow-sm">
                    P2
                  </div>
                  <div className="w-12 py-1.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-500 text-center font-mono text-xs font-bold shadow-sm">
                    P1
                  </div>
                  <div className="flex-1 flex items-center justify-end text-[10px] font-mono text-slate-400">
                    ⟶
                  </div>
                </div>
              </div>

              {/* Animated Switcher Core */}
              <div className="relative flex items-center justify-center my-4">
                {/* Connection lines */}
                <div className="absolute top-[-24px] bottom-[-24px] w-0.5 border-l border-dashed border-slate-300 dark:border-slate-800"></div>

                <div className={`z-10 px-4 py-2.5 rounded-xl border flex items-center space-x-3 ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-800 shadow-md'
                }`}>
                  <Activity className="h-4 w-4 text-indigo-500 animate-spin" />
                  <div className="text-left">
                    <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-sans">Context Switcher</p>
                    <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300">Dispatching {activeProcessId}...</p>
                  </div>
                </div>
              </div>

              {/* CPU Core active block */}
              <div className={`p-4 rounded-xl border relative ${
                darkMode ? 'bg-slate-900/60 border-blue-900/40' : 'bg-blue-50/50 border-blue-200 shadow-sm'
              }`}>
                {/* Core Ripple background animation */}
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500/10 dark:bg-blue-500/5 rounded-full animate-ping"></span>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 z-10">
                    <div className="p-2 rounded-lg bg-blue-500 text-white font-mono text-xs font-extrabold shadow shadow-blue-500/40">
                      CPU0
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-extrabold uppercase font-sans tracking-wide text-blue-600 dark:text-blue-400">Core Active</h4>
                      <p className="text-[11px] font-mono text-slate-500">Freq: 3.8 GHz • Load: {cpuLoad}%</p>
                    </div>
                  </div>

                  {/* Active Task status tag */}
                  <div className="flex flex-col items-end z-10">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Task</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      activeProcessId === 'P1'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : activeProcessId === 'P2'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {activeProcessId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Bento Grid */}
      <div className="space-y-6" id="educational-modules-grid">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white font-sans tracking-tight">
            Comprehensive Learning Modules
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-xs">
            Everything you need to master Operating System process scheduling theory and laboratory practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                id={`feature-card-${feat.tab}`}
                onClick={() => setActiveTab(feat.tab)}
                className={`group p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/85 hover:border-blue-500/50 hover:ring-2 hover:ring-blue-500/20' 
                    : 'bg-white border-slate-200/85 shadow-sm hover:shadow-md hover:border-blue-500/50 hover:ring-2 hover:ring-blue-500/10'
                }`}
              >
                <div className={`p-3 rounded-xl w-fit mb-4 transition-transform group-hover:scale-110 ${
                  feat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                  feat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                  feat.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                  feat.color === 'orange' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-2 font-sans group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {feat.description}
                </p>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-500 dark:text-blue-400">
                  <span>Explore Module</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lab Syllabus Disclaimer Section */}
      <div className={`p-6 rounded-2xl border flex items-start space-x-4 ${
        darkMode 
          ? 'bg-slate-950 border-slate-800/80 text-slate-400' 
          : 'bg-slate-100 border-slate-200 text-slate-600'
      }`} id="sppu-disclaimer">
        <Terminal className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="text-left space-y-1">
          <h4 className="text-xs font-extrabold text-slate-800 dark:text-white font-sans uppercase tracking-wider">
            Syllabus Alignment Notice
          </h4>
          <p className="text-xs leading-relaxed">
            This simulator incorporates standard academic assumptions required by SPPU course structures, such as 
            integer priorities where **lower numbers mean higher priorities** (e.g., Priority 1 overrides Priority 5), 
            and context-switching tiebreakers settled strictly via FIFO/Arrival-Time matching. You can test these exact conditions in the Simulator!
          </p>
        </div>
      </div>
    </div>
  );
}
