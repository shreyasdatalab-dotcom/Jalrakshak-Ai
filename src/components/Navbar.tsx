import React from 'react';
import { useApp } from '../context/AppContext';
import { JalrakshakLogo } from './JalrakshakLogo';
import { AlertCircle, Shield, User, Globe, RotateCcw, Stethoscope } from 'lucide-react';
import { LanguageCode } from '../utils/translations';

export const Navbar: React.FC = () => {
  const {
    view,
    setView,
    role,
    setRole,
    language,
    setLanguage,
    unreadAlertIds,
    resetDemoData,
  } = useApp();

  const handleNav = (targetView: 'landing' | 'citizen' | 'report' | 'tracking' | 'alerts' | 'admin' | 'doctor') => {
    setView(targetView);
    if (targetView === 'admin') {
      setRole('admin');
    } else if (targetView !== 'landing') {
      setRole('citizen');
    }
  };

  const toggleRole = () => {
    if (role === 'citizen') {
      setRole('admin');
      setView('admin');
    } else {
      setRole('citizen');
      setView('citizen');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1A30]/95 backdrop-blur-md border-b border-cyan-900/40 text-white shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Zone 1: Brand Wordmark / Logo */}
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-1.5 sm:gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg group shrink-0"
            aria-label="Jalrakshak AI Home"
          >
            <JalrakshakLogo size="sm" lightText showTagline={false} className="sm:hidden" />
            <JalrakshakLogo size="md" lightText showTagline={false} className="hidden sm:flex" />
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
            <button
              onClick={() => handleNav('landing')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                view === 'landing' ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => handleNav('citizen')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                view === 'citizen' ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Citizen Dashboard
            </button>

            <button
              onClick={() => handleNav('tracking')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                view === 'tracking' ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Track Complaints
            </button>

            <button
              onClick={() => handleNav('alerts')}
              className={`relative px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                view === 'alerts' ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Water Alerts</span>
              {unreadAlertIds.length > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-amber-500 rounded-full">
                  {unreadAlertIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('doctor')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                view === 'doctor' ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
              <span>Consult Doctor</span>
            </button>

            <button
              onClick={() => handleNav('admin')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                view === 'admin' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dept Admin</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions, Language & Demo Role Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language Selector */}
            <div className="relative flex items-center bg-[#122B48] rounded-lg p-0.5 border border-cyan-800/40 text-xs">
              <Globe className="w-3.5 h-3.5 ml-1 sm:ml-2 text-cyan-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-slate-200 text-xs font-medium py-1 pl-1 pr-1.5 sm:pr-2 focus:outline-none cursor-pointer"
                aria-label="Select Language"
              >
                <option value="en" className="bg-[#0B1A30] text-white">EN</option>
                <option value="mr" className="bg-[#0B1A30] text-white">मराठी</option>
                <option value="hi" className="bg-[#0B1A30] text-white">हिंदी</option>
              </select>
            </div>

            {/* Demo Role Switcher Badge (Desktop) */}
            <button
              onClick={toggleRole}
              title="Switch demo perspective between Citizen and Department Admin"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#143254] hover:bg-[#1A3D66] border border-cyan-600/30 text-cyan-200 transition-colors"
            >
              {role === 'citizen' ? (
                <>
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="whitespace-nowrap">Citizen</span>
                  <span className="text-[10px] text-slate-400">→ Admin</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span className="whitespace-nowrap">Admin</span>
                  <span className="text-[10px] text-slate-400">→ Citizen</span>
                </>
              )}
            </button>

            {/* Primary Action Button: Report Issue - Responsive fit */}
            <button
              onClick={() => handleNav('report')}
              className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold text-[#0B1A30] bg-[#16B8C4] hover:bg-[#00E5FF] active:scale-95 rounded-lg shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap"
            >
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Report</span>
              <span className="hidden sm:inline">Issue</span>
            </button>

            {/* Reset demo data quiet icon */}
            <button
              onClick={() => {
                if (window.confirm('Reset prototype to default demonstration complaints?')) {
                  resetDemoData();
                }
              }}
              title="Reset Demo Data"
              className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-md transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip: Horizontal scrolling without overflow */}
        <div className="md:hidden flex items-center py-2 border-t border-cyan-900/30 text-xs overflow-x-auto gap-1.5 scrollbar-none">
          <button
            onClick={() => handleNav('landing')}
            className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap text-[11px] ${
              view === 'landing' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleNav('citizen')}
            className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap text-[11px] ${
              view === 'citizen' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => handleNav('doctor')}
            className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap text-[11px] flex items-center gap-1 ${
              view === 'doctor' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300'
            }`}
          >
            <Stethoscope className="w-3 h-3 text-emerald-400" />
            <span>Doctor</span>
          </button>
          <button
            onClick={() => handleNav('tracking')}
            className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap text-[11px] ${
              view === 'tracking' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300'
            }`}
          >
            Track
          </button>
          <button
            onClick={() => handleNav('alerts')}
            className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap text-[11px] flex items-center gap-1 ${
              view === 'alerts' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300'
            }`}
          >
            <span>Alerts</span>
            {unreadAlertIds.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            )}
          </button>
          <button
            onClick={() => handleNav('admin')}
            className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap text-[11px] font-medium flex items-center gap-1 ${
              view === 'admin' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300'
            }`}
          >
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Admin</span>
          </button>
          {/* Quick role toggle on mobile */}
          <button
            onClick={toggleRole}
            className="ml-auto px-2 py-1 rounded-md shrink-0 whitespace-nowrap text-[10px] font-semibold bg-white/10 text-cyan-200 border border-white/10"
          >
            {role === 'citizen' ? 'Switch to Admin' : 'Switch to Citizen'}
          </button>
        </div>
      </div>
    </header>
  );
};
