import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus, PriorityLevel } from '../types';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  UserCheck,
  ShieldAlert,
  Star,
  MessageSquare,
  FileCheck,
  Download,
  AlertCircle,
  ExternalLink,
  Phone,
  RefreshCw,
} from 'lucide-react';

const STATUS_STEPS: ComplaintStatus[] = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
];

const PRIORITY_BADGES: Record<PriorityLevel, { bg: string; text: string }> = {
  Critical: { bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
  High: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
  Medium: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  Low: { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-700' },
};

export const ComplaintTrackingView: React.FC = () => {
  const {
    complaints,
    selectedComplaintId,
    setSelectedComplaintId,
    addCitizenFeedback,
    isFirestoreLoading,
    firestoreError,
    retryFirestore,
    firestoreConnected,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Active complaint
  const activeComplaint = complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  const filteredComplaints = complaints.filter((c) => {
    if (selectedStatusFilter !== 'All' && c.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStepState = (stepIndex: number, currentStatus: ComplaintStatus) => {
    const currentIndex = STATUS_STEPS.indexOf(currentStatus);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;
    addCitizenFeedback(activeComplaint.id, rating, feedbackComment);
    setFeedbackSubmitted(true);
  };

  const downloadSummary = () => {
    if (!activeComplaint) return;
    const text = `JALRAKSHAK AI - CIVIC COMPLAINT SUMMARY REPORT
--------------------------------------------------
Complaint ID: ${activeComplaint.id}
Date: ${new Date(activeComplaint.submittedAt).toLocaleString()}
Status: ${activeComplaint.status}
Priority: ${activeComplaint.priority}
Category: ${activeComplaint.category}
Location: ${activeComplaint.location} (${activeComplaint.ward})
Citizen: ${activeComplaint.citizenName} (${activeComplaint.citizenPhone})

AI Triage Assessment:
- Summary: ${activeComplaint.aiAnalysis?.summary || 'Standard intake assessment'}
- Department: ${activeComplaint.assignedDepartment}
- Assigned Team: ${activeComplaint.assignedTeam || 'Pending Field Dispatch'}
- Estimated Impact: ${activeComplaint.aiAnalysis?.estimatedHouseholdsImpacted || 'Local zone'}

Citizen Description:
${activeComplaint.description}

Municipal Log:
${activeComplaint.internalRemarks.join('\n')}

Resolution Details:
${activeComplaint.resolutionRemarks || 'Pending physical resolution'}
--------------------------------------------------
*Official municipal prototype demonstration record*`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Jalrakshak-Report-${activeComplaint.id}.txt`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B1A30] tracking-tight">
            Track Water Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent lifecycle tracking from citizen intake to municipal crew repair verification.
          </p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, or ward..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>
        </div>
      </div>

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

      {/* Main 2-column layout: Complaint list & Active detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Complaint queue list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Complaints ({filteredComplaints.length})</span>
            <div className="flex gap-1">
              {['All', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    selectedStatusFilter === st ? 'bg-[#0B1A30] text-white font-bold' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredComplaints.map((item) => {
              const isSelected = item.id === activeComplaint?.id;
              const pBadge = PRIORITY_BADGES[item.priority];

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedComplaintId(item.id);
                    setFeedbackSubmitted(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-white border-[#16B8C4] ring-2 ring-[#16B8C4]/20 shadow-sm'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-slate-500">{item.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${pBadge.bg} ${pBadge.text}`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug mb-1">
                    {item.category}
                  </div>

                  <div className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    📍 {item.location}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400 font-mono">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`font-semibold ${
                        item.status === 'Resolved'
                          ? 'text-emerald-600'
                          : item.status === 'In Progress'
                          ? 'text-cyan-700'
                          : 'text-amber-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredComplaints.length === 0 && (
              <div className="text-center p-8 bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                No complaints found matching criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Deep detail view of active complaint */}
        {activeComplaint ? (
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Header card with status and download action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {activeComplaint.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded border ${PRIORITY_BADGES[activeComplaint.priority].bg} ${PRIORITY_BADGES[activeComplaint.priority].text}`}
                    >
                      {activeComplaint.priority} Priority
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      · Filed {new Date(activeComplaint.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1A30]">
                    {activeComplaint.category}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{activeComplaint.location} ({activeComplaint.ward})</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={downloadSummary}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Download Summary</span>
                  </button>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                  Resolution Lifecycle Timeline
                </h3>

                <div className="overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
                  {/* Step lines and bubbles */}
                  <div className="flex sm:grid sm:grid-cols-5 gap-2 min-w-[320px] sm:min-w-0">
                    {STATUS_STEPS.map((stepName, idx) => {
                      const state = getStepState(idx, activeComplaint.status);
                      const isCompleted = state === 'completed';
                      const isActive = state === 'active';

                      return (
                        <div key={stepName} className="text-center relative flex-1 min-w-[60px] sm:min-w-0">
                          <div
                            className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : isActive
                                ? 'bg-[#16B8C4] text-[#0B1A30] ring-4 ring-cyan-100 shadow-md font-extrabold'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : idx + 1}
                          </div>
                          <span
                            className={`block mt-2 text-[10px] sm:text-[11px] leading-tight ${
                              isActive
                                ? 'font-bold text-[#0B1A30]'
                                : isCompleted
                                ? 'font-medium text-emerald-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Precautionary health alert banner if water quality issue */}
              {activeComplaint.aiAnalysis?.precautionaryNotice && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 space-y-1">
                    <span className="font-bold block">Precautionary Health Notice:</span>
                    <p>{activeComplaint.aiAnalysis.precautionaryNotice}</p>
                  </div>
                </div>
              )}

              {/* Complaint Description & AI Analysis Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Citizen Submission
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                    "{activeComplaint.description}"
                  </p>
                  {activeComplaint.imageUrl && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                        Reported Photo:
                      </span>
                      <img
                        src={activeComplaint.imageUrl}
                        alt="Citizen Evidence"
                        className="w-full h-36 object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-100 space-y-2.5">
                  <span className="text-xs font-bold text-cyan-900 uppercase tracking-wider block">
                    AI Triage Intelligence
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    <strong>Summary:</strong> {activeComplaint.aiAnalysis?.summary || 'Standard intake analysis completed.'}
                  </p>
                  <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-cyan-100/80">
                    <div>
                      <span className="font-medium text-slate-500">Routing Wing:</span>{' '}
                      <span className="font-semibold text-slate-900">{activeComplaint.assignedDepartment}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-500">Assigned Team:</span>{' '}
                      <span className="font-semibold text-slate-900">{activeComplaint.assignedTeam || 'Pending field officer assignment'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-500">Officer Lead:</span>{' '}
                      <span className="font-semibold text-slate-900">{activeComplaint.assignedOfficer || 'Ward 14 Duty Desk'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-500">Affected Scope:</span>{' '}
                      <span className="font-semibold text-slate-900">{activeComplaint.aiAnalysis?.estimatedHouseholdsImpacted || '10–30 households'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department internal log & remarks */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Municipal Action Log & Remarks
                </h3>
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {activeComplaint.internalRemarks.map((remark, idx) => (
                    <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                      <span>{remark}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Evidence Box (if resolved) */}
              {activeComplaint.status === 'Resolved' && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <span>Resolution Evidence & Field Proof</span>
                  </div>

                  <p className="text-xs text-emerald-900 leading-relaxed">
                    <strong>Final Repair Remarks:</strong> {activeComplaint.resolutionRemarks || 'Repairs completed by on-site crew and certified by ward Junior Engineer.'}
                  </p>

                  {activeComplaint.resolutionEvidenceUrl && (
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block mb-1">
                        Post-Repair Verification Photograph:
                      </span>
                      <img
                        src={activeComplaint.resolutionEvidenceUrl}
                        alt="Resolution Evidence"
                        className="w-full sm:w-80 h-44 object-cover rounded-xl border border-emerald-200"
                      />
                    </div>
                  )}

                  {activeComplaint.resolutionTimestamp && (
                    <span className="text-[11px] text-emerald-700 font-mono block">
                      Certified Closed At: {new Date(activeComplaint.resolutionTimestamp).toLocaleString()}
                    </span>
                  )}
                </div>
              )}

              {/* Citizen Feedback & Confirmation Option */}
              {activeComplaint.status === 'Resolved' && (
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Citizen Resolution Confirmation & Feedback
                  </h3>

                  {activeComplaint.citizenFeedback ? (
                    <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">Citizen Rating:</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < activeComplaint.citizenFeedback!.rating ? 'fill-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 italic">
                        "{activeComplaint.citizenFeedback.comment}"
                      </p>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Citizen confirmed resolution satisfactorily on {new Date(activeComplaint.citizenFeedback.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ) : feedbackSubmitted ? (
                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs">
                      Thank you! Your verification feedback and rating have been logged with the municipal grievance audit desk.
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-700">Rate repair quality:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="p-1 focus:outline-none"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="Add comments on water pressure, promptness, or cleanup (optional)..."
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                      />

                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0B1A30] hover:bg-[#122B48] text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Confirm Resolved & Submit Feedback
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
            Select a complaint from the list to track its lifecycle.
          </div>
        )}
      </div>
    </div>
  );
};
