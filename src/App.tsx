/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import AlgorithmsView from './components/AlgorithmsView';
import SimulatorView from './components/SimulatorView';
import ComparisonView from './components/ComparisonView';
import QuizView from './components/QuizView';
import VivaView from './components/VivaView';
import ProgramsView from './components/ProgramsView';
import DownloadsView from './components/DownloadsView';
import { Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView setActiveTab={setActiveTab} darkMode={darkMode} />;
      case 'algorithms':
        return <AlgorithmsView darkMode={darkMode} />;
      case 'simulator':
        return <SimulatorView darkMode={darkMode} />;
      case 'comparison':
        return <ComparisonView darkMode={darkMode} />;
      case 'quiz':
        return <QuizView darkMode={darkMode} />;
      case 'viva':
        return <VivaView darkMode={darkMode} />;
      case 'programs':
        return <ProgramsView darkMode={darkMode} />;
      case 'downloads':
        return <DownloadsView darkMode={darkMode} />;
      default:
        return <HomeView setActiveTab={setActiveTab} darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans flex flex-col justify-between ${
      darkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-800'
    }`} id="app-wrapper">
      
      {/* Navbar header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Educational Portal Canvas */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content-canvas">
        <div className="animate-fade-in">
          {renderActiveView()}
        </div>
      </main>

      {/* Footer conforming to SPPU guidelines */}
      <footer className={`border-t py-8 text-center text-xs transition-colors ${
        darkMode ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
      }`} id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Cpu className="h-4 w-4 text-indigo-500" />
            <span className="font-bold tracking-wider uppercase text-[10px]">OS Scheduler Lab Portal</span>
          </div>
          
          <div className="space-y-1">
            <p className="font-semibold text-slate-600 dark:text-slate-400">Department of Computer Engineering</p>
            <p className="font-semibold text-slate-600 dark:text-slate-400">Operating Systems Laboratory (Syllabus Coursework)</p>
            <p className="font-mono text-[10px]">Savitribai Phule Pune University (SPPU)</p>
          </div>

          <p className="text-[10px] opacity-75 font-mono pt-2">
            Developed for Educational Purposes Only • Built with React & Tailwind CSS
          </p>
        </div>
      </footer>

    </div>
  );
}
