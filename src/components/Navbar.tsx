/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun, Moon, Cpu, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'algorithms', label: 'Algorithms' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'quiz', label: 'Practice Quiz' },
    { id: 'viva', label: 'Viva Q&A' },
    { id: 'programs', label: 'C Programs' },
    { id: 'downloads', label: 'Downloads' }
  ];

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-900/95 border-slate-800 text-white' 
        : 'bg-white/95 border-slate-200 text-slate-800'
    }`} id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('home')} id="logo-container">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-md shadow-blue-600/20">
              <Cpu className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                OS Scheduler <span className="text-blue-600">Lab</span>
              </span>
              <span className="block text-[8px] font-mono tracking-widest text-slate-400 dark:text-slate-500">
                SPPU OPERATING SYSTEMS LAB
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6" id="desktop-menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`text-xs font-semibold tracking-wide py-1 transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-bold'
                    : `border-b-2 border-transparent hover:text-blue-600 dark:hover:text-blue-400 ${
                        darkMode ? 'text-slate-300' : 'text-slate-600'
                      }`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action buttons (Theme Toggle & Mobile Menu) */}
          <div className="flex items-center space-x-2" id="action-buttons">
            <button
              id="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-100 text-indigo-600'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t transition-all duration-300 ${
          darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`} id="mobile-menu-drawer">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-tab-btn-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === item.id
                    ? darkMode
                      ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'border border-transparent hover:bg-slate-200 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
