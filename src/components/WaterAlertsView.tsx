import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WaterAlert } from '../types';
import {
  Bell,
  AlertTriangle,
  Info,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Check,
  Megaphone,
  Radio,
  FileText,
} from 'lucide-react';

export const WaterAlertsView: React.FC = () => {
  const { alerts, unreadAlertIds, markAlertRead, setView, role, setRole, setAdminTab } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredAlerts = alerts.filter((a) => {
    if (filterCategory !== 'All' && a.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
              Municipal Water Dispatch Feed
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B1A30] tracking-tight">
            Water Alerts & Public Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time notifications on scheduled maintenance, localized boil advisories, and pipeline overhauls.
          </p>
        </div>

        {/* Action: Create alert button if in admin mode, or switch to admin */}
        <div className="flex items-center gap-2">
          {role === 'admin' ? (
            <button
              onClick={() => {
                setView('admin');
                setAdminTab('alerts');
              }}
              className="px-4 py-2 bg-[#0B1A30] hover:bg-[#122B48] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Publish Public Broadcast</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setRole('admin');
                setView('admin');
                setAdminTab('alerts');
              }}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Admin Broadcast Mode</span>
              <span className="text-[10px] text-slate-400">→</span>
            </button>
          )}
        </div>
      </div>

      {/* Prototype disclaimer pill */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 text-xs text-cyan-950 flex items-center gap-2">
        <Info className="w-4 h-4 text-cyan-700 shrink-0" />
        <span>
          <strong>Prototype Demonstration Notice:</strong> The alerts listed below simulate municipal advisory broadcasts and do not constitute actual government emergency orders.
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['All', 'Maintenance', 'Advisory', 'Supply Interruption', 'Emergency'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filterCategory === cat
                ? 'bg-[#0B1A30] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' ? 'All Notices' : cat}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isUnread = unreadAlertIds.includes(alert.id);

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 space-y-4 ${
                isUnread ? 'border-cyan-400/80 shadow-md ring-1 ring-cyan-200' : 'border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                      alert.severity === 'Critical'
                        ? 'bg-red-100 text-red-700'
                        : alert.severity === 'Warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {alert.category}
                  </span>

                  <span className="font-mono text-xs font-bold text-slate-500">
                    {alert.id}
                  </span>

                  {isUnread && (
                    <span className="text-[10px] font-bold bg-[#16B8C4] text-[#0B1A30] px-2 py-0.5 rounded-full">
                      New Alert
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Window: {alert.startTime}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#0B1A30] leading-snug">
                  {alert.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>
                    Affected Sectors: <strong>{alert.affectedAreas.join(', ')}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">
                    Issuer: {alert.publishedBy}
                  </span>

                  {isUnread ? (
                    <button
                      onClick={() => markAlertRead(alert.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg font-semibold text-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark as Read</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
