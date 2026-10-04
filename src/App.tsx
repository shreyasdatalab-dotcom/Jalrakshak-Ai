import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPageView } from './components/LandingPageView';
import { CitizenDashboardView } from './components/CitizenDashboardView';
import { ReportComplaintView } from './components/ReportComplaintView';
import { ComplaintTrackingView } from './components/ComplaintTrackingView';
import { WaterAlertsView } from './components/WaterAlertsView';
import { AdminPortalView } from './components/AdminPortalView';
import { WaterHealthDoctorView } from './components/WaterHealthDoctorView';
import { ShieldAlert, X, ChevronRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const { view, setView, alerts, role, setRole } = useApp();
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(true);

  // Critical active advisory for banner
  const criticalAlert = alerts.find((a) => a.severity === 'Critical' && a.isActive);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FC]">
      {/* Top Emergency Water Issue Banner (if active) */}
      {criticalAlert && showEmergencyBanner && (
        <aside aria-label="Emergency Notice" className="bg-gradient-to-r from-red-600 to-amber-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-medium shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
              <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
              <ShieldAlert className="w-4 h-4 text-amber-200 shrink-0" />
              <span className="font-extrabold uppercase tracking-wide text-amber-100 shrink-0 text-[11px] sm:text-xs">
                Notice:
              </span>
              <span className="truncate text-[11px] sm:text-xs">
                {criticalAlert.title} — {criticalAlert.affectedAreas.join(', ')}
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/15">
              <button
                onClick={() => setView('alerts')}
                className="underline hover:text-amber-100 font-bold flex items-center gap-0.5 text-[11px] sm:text-xs"
              >
                <span>Read Full Advisory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowEmergencyBanner(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                title="Dismiss Notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {view === 'landing' && <LandingPageView />}
        {view === 'citizen' && <CitizenDashboardView />}
        {view === 'report' && <ReportComplaintView />}
        {view === 'tracking' && <ComplaintTrackingView />}
        {view === 'alerts' && <WaterAlertsView />}
        {view === 'admin' && <AdminPortalView />}
        {view === 'doctor' && <WaterHealthDoctorView />}
      </main>

      {/* Quick Role Perspective Bar at bottom for Hackathon evaluators */}
      <div className="bg-[#0B1A30] text-slate-400 border-t border-cyan-950/80 px-3 sm:px-4 py-2.5 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16B8C4]"></span>
            <span>Jalrakshak AI Civic Demo</span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-400 font-mono">Dummy Data Mode</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-slate-400 text-[10px] sm:text-[11px]">Perspective:</span>
            <button
              onClick={() => {
                setRole('citizen');
                setView('citizen');
              }}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                role === 'citizen'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'hover:text-white bg-white/5'
              }`}
            >
              Citizen View
            </button>
            <button
              onClick={() => {
                setRole('admin');
                setView('admin');
              }}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                role === 'admin'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'hover:text-white bg-white/5'
              }`}
            >
              Dept Admin View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
