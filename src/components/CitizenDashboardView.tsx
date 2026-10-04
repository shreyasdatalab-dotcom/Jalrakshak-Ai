import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IssueCategory, Complaint } from '../types';
import {
  Droplets,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Activity,
  PlusCircle,
  Bell,
  MapPin,
  ChevronRight,
  Gauge,
  Sparkles,
  ExternalLink,
  Stethoscope,
  HeartPulse,
  Database,
  RefreshCw,
} from 'lucide-react';

export const CitizenDashboardView: React.FC = () => {
  const {
    complaints,
    alerts,
    unreadAlertIds,
    markAlertRead,
    supplyStatus,
    setView,
    setSelectedComplaintId,
    isFirestoreLoading,
    firestoreError,
    firestoreConnected,
    retryFirestore,
    t,
  } = useApp();

  const [citizenLocation, setCitizenLocation] = useState('Ward 14 (Central Metro District)');

  // Filter complaints for current citizen
  const citizenComplaints = complaints.slice(0, 5); // Show active and recent

  const pendingCount = complaints.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgressCount = complaints.filter((c) => c.status === 'Assigned' || c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  const quickActionReport = (cat: IssueCategory) => {
    setView('report');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Personalized Welcome & Location Header */}
      <div className="bg-gradient-to-r from-[#0B1A30] via-[#122B48] to-[#0A223D] rounded-2xl p-5 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Subtle background water drop glow */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-[#16B8C4]/15 to-transparent pointer-events-none" />

        <div className="space-y-2 relative z-10 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[11px] font-semibold border border-cyan-400/30">
              Demo Citizen Profile
            </span>
            <span className="text-[11px] text-slate-300 font-mono">ID: CTZ-DEMO-9402</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Namaste, Aarav Sharma
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-300 max-w-full">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <select
              value={citizenLocation}
              onChange={(e) => setCitizenLocation(e.target.value)}
              className="bg-[#0B1A30]/80 text-white rounded-lg px-2 py-1 border border-cyan-700/50 text-xs font-medium cursor-pointer max-w-[260px] sm:max-w-xs truncate"
            >
              <option value="Ward 14 (Central Metro District)">Ward 14 (Central Metro District)</option>
              <option value="Ward 15 (Civic Center & Boulevard)">Ward 15 (Civic Center & Boulevard)</option>
              <option value="Ward 12 (Hilltop Sector)">Ward 12 (Hilltop Sector)</option>
              <option value="Ward 08 (Riverside District)">Ward 08 (Riverside District)</option>
            </select>
          </div>
        </div>

        {/* Large Prominent Report CTA Button */}
        <div className="relative z-10 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setView('report')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 bg-[#16B8C4] hover:bg-[#00E5FF] text-[#0B1A30] font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>Report a Water Issue</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>

      {/* Grid: Water Supply Status & Metric Counts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ward Water Supply Status Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ward Water Supply Status
                </h3>
                <span className="text-[11px] text-slate-500">{supplyStatus.wardName}</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {supplyStatus.currentStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Pressure
              </span>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                {supplyStatus.currentPressureBar} <span className="text-xs font-normal text-slate-500">bar</span>
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Optimal head</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Next Delivery
              </span>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                06:00 AM
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">3.5 hr cycle</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Free Chlorine
              </span>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                {supplyStatus.chlorinationPpm} <span className="text-xs font-normal text-slate-500">ppm</span>
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Safe (0.2–1.0)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Turbidity
              </span>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                {supplyStatus.turbidityNtu} <span className="text-xs font-normal text-slate-500">NTU</span>
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Clear (&lt;5 NTU)</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-600" />
              <span>Real-time municipal booster telemetry updated 5 mins ago</span>
            </span>
            <button
              onClick={() => setView('alerts')}
              className="text-cyan-700 hover:text-cyan-900 font-semibold"
            >
              View Supply Schedule →
            </button>
          </div>
        </div>

        {/* Complaint Count Cards */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono">{pendingCount}</span>
              <span className="text-xs font-bold text-slate-600 block mt-0.5">Pending</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-2">Under review</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center mb-2">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono">{inProgressCount}</span>
              <span className="text-xs font-bold text-slate-600 block mt-0.5">In Progress</span>
            </div>
            <span className="text-[10px] text-cyan-700 mt-2">Field team on site</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono">{resolvedCount}</span>
              <span className="text-xs font-bold text-slate-600 block mt-0.5">Resolved</span>
            </div>
            <span className="text-[10px] text-emerald-600 mt-2">Closed & verified</span>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Quick Action Grievance Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => quickActionReport('Pipe leakage')}
            className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-cyan-500 hover:shadow-sm text-left transition-all group"
          >
            <span className="text-2xl mb-1.5 block">💧</span>
            <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700">
              Report a Leak
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Gushing burst or joint leak</span>
          </button>

          <button
            onClick={() => quickActionReport('Water contamination concern')}
            className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-red-400 hover:shadow-sm text-left transition-all group"
          >
            <span className="text-2xl mb-1.5 block">⚠️</span>
            <div className="text-xs font-bold text-slate-900 group-hover:text-red-700">
              Quality / Contamination
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Yellow/dirty water, foul odor</span>
          </button>

          <button
            onClick={() => quickActionReport('Water supply interruption')}
            className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-sm text-left transition-all group"
          >
            <span className="text-2xl mb-1.5 block">🚫</span>
            <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
              Supply Interruption
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Dry tap during scheduled slot</span>
          </button>

          <button
            onClick={() => quickActionReport('Water wastage or overflow')}
            className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-cyan-400 hover:shadow-sm text-left transition-all group"
          >
            <span className="text-2xl mb-1.5 block">🌊</span>
            <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700">
              Overflowing Tank
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Public cistern wastage</span>
          </button>
        </div>
      </div>

      {/* Water Health & Doctor Support Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-[#0B2545] to-[#0A192F] rounded-2xl p-5 sm:p-6 text-white border border-teal-500/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Civic Health Service
              </span>
              <span className="text-xs text-slate-300">24/7 Free Tele-Consultation</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Skin Irritation or Health Reactions Due to Water?
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Facing rashes, dermal itching, eczema flares, or burning eyes after water contact? Connect with on-duty municipal dermatologists for free instant triage.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setView('doctor')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 text-center"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Consult Doctor Now</span>
          </button>
          <a
            href="tel:1111222334"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl border border-white/20 transition-all text-center"
          >
            <span>Call 1111-222-33-4</span>
          </a>
        </div>
      </div>

      {/* 2-Column: My Active Complaints & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: My Complaints */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                My Reported Water Issues
              </h2>
              {firestoreConnected && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Firestore Live
                </span>
              )}
            </div>
            <button
              onClick={() => setView('tracking')}
              className="text-xs text-cyan-700 hover:text-cyan-900 font-semibold"
            >
              View Full History →
            </button>
          </div>

          {/* Firestore Loading Indicator */}
          {isFirestoreLoading && (
            <div className="py-8 text-center space-y-2">
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Syncing live Firestore complaints...</p>
            </div>
          )}

          {/* Firestore Error Alert */}
          {firestoreError && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="font-bold block">Firestore Connection Notice:</span>
                <span className="text-[11px] text-amber-800 leading-snug">{firestoreError}</span>
              </div>
              <button
                onClick={retryFirestore}
                className="shrink-0 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Empty State when Firestore has 0 complaints */}
          {!isFirestoreLoading && citizenComplaints.length === 0 && (
            <div className="py-10 text-center space-y-3 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 p-6">
              <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">No Complaints in Firestore Database</h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Submit your first water grievance to save it directly to the Firestore complaints collection.
                </p>
              </div>
              <button
                onClick={() => setView('report')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16B8C4] hover:bg-[#00E5FF] text-[#0B1A30] font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report a Water Issue</span>
              </button>
            </div>
          )}

          {!isFirestoreLoading && citizenComplaints.length > 0 && (
            <div className="space-y-3">
            {citizenComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedComplaintId(item.id);
                  setView('tracking');
                }}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-cyan-200 bg-slate-50/50 hover:bg-cyan-50/20 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{item.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.priority === 'Critical'
                          ? 'bg-red-100 text-red-700'
                          : item.priority === 'High'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-cyan-800">
                    {item.category}
                  </div>
                  <span className="text-[11px] text-slate-500 line-clamp-1">
                    📍 {item.location}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md ${
                      item.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'In Progress'
                        ? 'bg-cyan-100 text-cyan-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>

        {/* Right: Recent Water Alerts & Notices */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Ward Water Alerts
              </h2>
            </div>
            {unreadAlertIds.length > 0 && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {unreadAlertIds.length} Unread
              </span>
            )}
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      alert.severity === 'Critical'
                        ? 'bg-red-100 text-red-700'
                        : alert.severity === 'Warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {alert.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {alert.startTime}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {alert.title}
                </div>

                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                  {alert.description}
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                  <span>Scope: {alert.affectedAreas.join(', ')}</span>
                  <button
                    onClick={() => {
                      markAlertRead(alert.id);
                      setView('alerts');
                    }}
                    className="text-cyan-700 hover:text-cyan-900 font-medium"
                  >
                    Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setView('alerts')}
            className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Open All Municipal Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
