import React, { useState } from 'react';
import { useApp, AdminTab } from '../context/AppContext';
import { Complaint, ComplaintStatus, PriorityLevel, IssueCategory, DepartmentName } from '../types';
import { SmartWaterMap } from './SmartWaterMap';
import { MUNICIPAL_TEAMS } from '../data/seedData';
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  Users,
  BarChart3,
  BellRing,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Send,
  Upload,
  Eye,
  X,
  FileCheck,
  TrendingUp,
  Activity,
  Plus,
  RefreshCw,
} from 'lucide-react';

const PRIORITY_BADGES: Record<PriorityLevel, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  High: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Low: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
};

export const AdminPortalView: React.FC = () => {
  const {
    complaints,
    updateComplaintStatus,
    adminTab,
    setAdminTab,
    alerts,
    addAlert,
    setSelectedComplaintId,
    isFirestoreLoading,
    firestoreError,
    firestoreConnected,
    retryFirestore,
  } = useApp();

  const [activeDrawerComplaint, setActiveDrawerComplaint] = useState<Complaint | null>(null);

  // Filters for complaints table
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Drawer Form State
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [internalRemark, setInternalRemark] = useState('');
  const [resolutionEvidenceUrl, setResolutionEvidenceUrl] = useState('');
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string | null>(null);

  // Create Alert Modal State
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertCategory, setAlertCategory] = useState<'Supply Interruption' | 'Maintenance' | 'Emergency' | 'Advisory'>('Maintenance');
  const [alertSeverity, setAlertSeverity] = useState<'Critical' | 'Warning' | 'Info'>('Warning');
  const [alertAreas, setAlertAreas] = useState('Ward 14 (Shivajinagar)');
  const [alertStartTime, setAlertStartTime] = useState('Today, 02:00 PM');
  const [alertResolutionTime, setAlertResolutionTime] = useState('Today, 06:00 PM');
  const [alertDescription, setAlertDescription] = useState('');

  // Open complaint drawer
  const openDrawer = (c: Complaint) => {
    setActiveDrawerComplaint(c);
    setNewStatus(c.status);
    setSelectedTeam(c.assignedTeam || '');
    setInternalRemark('');
    setResolutionEvidenceUrl(c.resolutionEvidenceUrl || '');
    setResolutionRemarks(c.resolutionRemarks || '');
  };

  const handleSaveDrawer = () => {
    if (!activeDrawerComplaint) return;

    updateComplaintStatus(
      activeDrawerComplaint.id,
      newStatus,
      internalRemark.trim() || undefined,
      selectedTeam || undefined,
      resolutionEvidenceUrl.trim() || undefined
    );

    // Refresh active drawer object
    const updated = complaints.find((c) => c.id === activeDrawerComplaint.id);
    if (updated) {
      setActiveDrawerComplaint({
        ...updated,
        status: newStatus,
        assignedTeam: selectedTeam || updated.assignedTeam,
      });
    }

    setInternalRemark('');
    setUpdateSuccessMsg(`Complaint ${activeDrawerComplaint.id} updated! Status set to "${newStatus}".`);
    setTimeout(() => setUpdateSuccessMsg(null), 4000);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim()) return;

    addAlert({
      title: alertTitle,
      category: alertCategory,
      severity: alertSeverity,
      affectedAreas: alertAreas.split(',').map((s) => s.trim()),
      startTime: alertStartTime,
      expectedResolution: alertResolutionTime,
      description: alertDescription,
      publishedBy: 'Department Central Control Room',
      isActive: true,
    });

    setShowNewAlertModal(false);
    setAlertTitle('');
    setAlertDescription('');
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (priorityFilter !== 'All' && c.priority !== priorityFilter) return false;
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q) ||
        c.assignedDepartment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Metrics
  const totalComplaints = complaints.length;
  const criticalCount = complaints.filter((c) => c.priority === 'Critical').length;
  const highCount = complaints.filter((c) => c.priority === 'High').length;
  const pendingCount = complaints.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const inProgressCount = complaints.filter((c) => c.status === 'Assigned' || c.status === 'In Progress').length;

  return (
    <div className="min-h-screen bg-[#F5F9FC]">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/90 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
            <span className="font-semibold text-slate-500">Municipal Water Authority</span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-[#0B1A30]">Control & Dispatch Command</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
              Civic Demonstration Prototype
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {firestoreConnected && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Firestore Live
              </span>
            )}
            <span className="text-slate-500">Duty Officer:</span>
            <span className="font-bold text-slate-800">Er. R. K. Sharma (Superintending Engineer)</span>
          </div>
        </div>

        {firestoreError && (
          <div className="mt-2.5 max-w-7xl mx-auto p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-3">
            <span><strong>Firestore Notice:</strong> {firestoreError}</span>
            <button
              onClick={retryFirestore}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px]"
            >
              Retry Sync
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Sidebar Navigation: Responsive grid on mobile, vertical on desktop */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
              <span className="col-span-2 sm:col-span-3 lg:col-span-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 block">
                Command Navigation
              </span>

              <button
                onClick={() => setAdminTab('overview')}
                className={`flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  adminTab === 'overview'
                    ? 'bg-[#0B1A30] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">Overview</span>
              </button>

              <button
                onClick={() => setAdminTab('complaints')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  adminTab === 'complaints'
                    ? 'bg-[#0B1A30] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-cyan-400" />
                  <span>Complaints Queue</span>
                </div>
                <span className="font-mono px-2 py-0.5 rounded text-[10px] bg-cyan-900/20 text-cyan-700 font-bold">
                  {totalComplaints}
                </span>
              </button>

              <button
                onClick={() => setAdminTab('map')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  adminTab === 'map'
                    ? 'bg-[#0B1A30] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Map className="w-4 h-4 text-cyan-400" />
                <span>Smart Issue Map (GIS)</span>
              </button>

              <button
                onClick={() => setAdminTab('teams')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  adminTab === 'teams'
                    ? 'bg-[#0B1A30] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Team Assignments</span>
              </button>

              <button
                onClick={() => setAdminTab('analytics')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  adminTab === 'analytics'
                    ? 'bg-[#0B1A30] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Analytics & Performance</span>
              </button>

              <button
                onClick={() => setAdminTab('alerts')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  adminTab === 'alerts'
                    ? 'bg-[#0B1A30] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BellRing className="w-4 h-4 text-cyan-400" />
                  <span>Public Alerts Manager</span>
                </div>
                <span className="font-mono px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                  {alerts.length}
                </span>
              </button>
            </div>

            {/* Quick Municipal Advisory note */}
            <div className="bg-slate-100/80 rounded-2xl p-4 text-[11px] text-slate-600 space-y-1.5 border border-slate-200">
              <span className="font-bold text-slate-800 block">Civic Tech Demo Mode</span>
              <p className="leading-snug text-slate-500">
                All triage scores and field assignments update the active application state in real-time. Connected to n8n webhook triggers.
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB 1: OVERVIEW DASHBOARD */}
            {adminTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Total Ingested
                    </span>
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {totalComplaints}
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">Across 4 municipal wards</span>
                  </div>

                  <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-5 bg-gradient-to-br from-white to-red-50/30">
                    <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block mb-1">
                      Critical / Urgent
                    </span>
                    <span className="text-3xl font-black text-red-700 font-mono">
                      {criticalCount + highCount}
                    </span>
                    <span className="text-xs text-red-600 block mt-1">{criticalCount} Critical · {highCount} High</span>
                  </div>

                  <div className="bg-white rounded-2xl border border-cyan-200 shadow-sm p-5 bg-gradient-to-br from-white to-cyan-50/30">
                    <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block mb-1">
                      Under Repair
                    </span>
                    <span className="text-3xl font-black text-cyan-900 font-mono">
                      {inProgressCount}
                    </span>
                    <span className="text-xs text-cyan-700 block mt-1">Field teams dispatched</span>
                  </div>

                  <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-5 bg-gradient-to-br from-white to-emerald-50/30">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      Cases Resolved
                    </span>
                    <span className="text-3xl font-black text-emerald-700 font-mono">
                      {resolvedCount}
                    </span>
                    <span className="text-xs text-emerald-600 block mt-1">94.2% within SLA</span>
                  </div>
                </div>

                {/* Response performance banner */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Automated AI Triage & Response Rate: 42 mins
                      </h4>
                      <p className="text-xs text-slate-500">
                        Estimated Non-Revenue Water (NRW) saved through rapid burst isolation: <strong className="text-slate-800 font-mono">4.8 Million Liters</strong> this month.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setAdminTab('complaints')}
                    className="px-4 py-2 bg-[#0B1A30] hover:bg-[#122B48] text-white text-xs font-bold rounded-xl whitespace-nowrap"
                  >
                    View All Queued Complaints →
                  </button>
                </div>

                {/* Priority Cases Requiring Attention */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Priority Action Cases (Critical & High)
                      </h3>
                      <p className="text-xs text-slate-500">Requiring immediate valve isolation or chemical lab sampling.</p>
                    </div>

                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                      {complaints.filter((c) => (c.priority === 'Critical' || c.priority === 'High') && c.status !== 'Resolved').length} Unresolved Urgent Cases
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {complaints
                      .filter((c) => c.priority === 'Critical' || c.priority === 'High')
                      .slice(0, 4)
                      .map((c) => (
                        <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-600">{c.id}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PRIORITY_BADGES[c.priority].bg} ${PRIORITY_BADGES[c.priority].text} ${PRIORITY_BADGES[c.priority].border}`}>
                                {c.priority}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{c.category}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">
                              📍 {c.location} · {c.aiAnalysis.estimatedHouseholdsImpacted}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                              {c.status}
                            </span>
                            <button
                              onClick={() => openDrawer(c)}
                              className="px-3 py-1.5 bg-[#0B1A30] hover:bg-[#122B48] text-white text-xs font-semibold rounded-lg"
                            >
                              Dispatch / Update
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Embedded Map Section */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Geographic Complaint Distribution
                      </h3>
                      <p className="text-xs text-slate-500">Live pin overlays colored by severity priority.</p>
                    </div>
                    <button
                      onClick={() => setAdminTab('map')}
                      className="text-xs text-cyan-700 hover:text-cyan-900 font-semibold"
                    >
                      Expand Fullscreen GIS View →
                    </button>
                  </div>

                  <SmartWaterMap height="360px" showFilters={false} />
                </div>
              </div>
            )}

            {/* TAB 2: COMPLAINT MANAGEMENT TABLE */}
            {adminTab === 'complaints' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Grievance Intake & Task Allocation Table
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing {filteredComplaints.length} of {complaints.length} registered municipal water complaints.
                    </p>
                  </div>

                  <div className="relative max-w-xs w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ID, ward, or keyword..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                  </div>
                </div>

                {/* Filters row */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Filter className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Filter:</span>
                  </div>

                  {/* Priority */}
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  {/* Status */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  {/* Category */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Pipe leakage">Pipe Leakage</option>
                    <option value="Water contamination concern">Contamination Concern</option>
                    <option value="Water supply interruption">Supply Interruption</option>
                    <option value="Water wastage or overflow">Wastage / Overflow</option>
                    <option value="Low water pressure">Low Pressure</option>
                    <option value="Damaged water infrastructure">Damaged Infrastructure</option>
                  </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">ID & Date</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Assigned Wing</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredComplaints.map((c) => {
                        const pBadge = PRIORITY_BADGES[c.priority];
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-mono">
                              <span className="font-bold text-slate-800 block">{c.id}</span>
                              <span className="text-[11px] text-slate-400">
                                {new Date(c.submittedAt).toLocaleDateString()}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-900 block">{c.category}</span>
                              <span className="text-[11px] text-slate-500 line-clamp-1 max-w-[200px]">
                                {c.description}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded font-bold border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}
                              >
                                {c.priority}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-medium text-slate-800 block line-clamp-1 max-w-[180px]">
                                {c.location}
                              </span>
                              <span className="text-[10px] text-slate-400">{c.ward}</span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-medium text-slate-800 block line-clamp-1 max-w-[160px]">
                                {c.assignedDepartment}
                              </span>
                              <span className="text-[10px] text-cyan-700 font-semibold">
                                {c.assignedTeam || 'Pending squad'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-md font-bold ${
                                  c.status === 'Resolved'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : c.status === 'In Progress'
                                    ? 'bg-cyan-100 text-cyan-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => openDrawer(c)}
                                className="px-3 py-1.5 bg-[#0B1A30] hover:bg-[#122B48] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: SMART ISSUE MAP */}
            {adminTab === 'map' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Geographic GIS Incident Map
                    </h2>
                    <p className="text-xs text-slate-500">
                      Interactive geospatial map with colored pin markers by priority severity. Click any pin to inspect details.
                    </p>
                  </div>
                </div>

                <SmartWaterMap
                  height="600px"
                  showFilters={true}
                  onSelectComplaint={(c) => openDrawer(c)}
                />
              </div>
            )}

            {/* TAB 4: TEAM ASSIGNMENTS */}
            {adminTab === 'teams' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Municipal Field Squads & Roster
                    </h2>
                    <p className="text-xs text-slate-500">
                      Active rapid leak units, laboratory vans, and distribution maintenance teams.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MUNICIPAL_TEAMS.map((team) => (
                    <div
                      key={team.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-cyan-400 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                          {team.department}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {team.activeCases} active jobs
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900">
                        {team.name}
                      </h3>

                      <div className="text-xs text-slate-600 flex items-center justify-between pt-2 border-t border-slate-100">
                        <span>Lead Engineer: <strong>{team.lead}</strong></span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          On Duty
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: ANALYTICS & PERFORMANCE */}
            {adminTab === 'analytics' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Department Service & SLA Analytics
                  </h2>
                  <p className="text-xs text-slate-500">
                    Prototype demonstration metrics for municipal performance and non-revenue water mitigation.
                  </p>
                </div>

                {/* Visual Chart representations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Breakdown Bar Chart Simulation */}
                  <div className="p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Complaints by Category (Sample Data)
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>Pipe Leakage</span>
                          <span className="font-mono">38% (42 cases)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-600 rounded-full" style={{ width: '38%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>Water Contamination Concern</span>
                          <span className="font-mono">24% (26 cases)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: '24%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>Water Supply Interruption</span>
                          <span className="font-mono">18% (20 cases)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>Overflow / Wastage</span>
                          <span className="font-mono">12% (13 cases)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '12%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>Damaged Infrastructure / Pressure</span>
                          <span className="font-mono">8% (9 cases)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 rounded-full" style={{ width: '8%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SLA Resolution Performance */}
                  <div className="p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Response Time by Priority
                    </h3>

                    <div className="space-y-4 text-xs">
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-red-900 block">Critical Cases</span>
                          <span className="text-[11px] text-red-700">Target SLA: 4 hrs</span>
                        </div>
                        <span className="text-base font-black text-red-700 font-mono">1.8 hrs avg</span>
                      </div>

                      <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-orange-900 block">High Priority</span>
                          <span className="text-[11px] text-orange-700">Target SLA: 12 hrs</span>
                        </div>
                        <span className="text-base font-black text-orange-700 font-mono">5.2 hrs avg</span>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-amber-900 block">Medium Priority</span>
                          <span className="text-[11px] text-amber-700">Target SLA: 24 hrs</span>
                        </div>
                        <span className="text-base font-black text-amber-700 font-mono">11.4 hrs avg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ALERTS MANAGER */}
            {adminTab === 'alerts' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Public Alerts & Maintenance Broadcasts
                    </h2>
                    <p className="text-xs text-slate-500">
                      Create, edit, and publish SMS and app alerts to citizens within targeted municipal wards.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowNewAlertModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1A30] hover:bg-[#122B48] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Alert</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">{alert.id}</span>
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
                        </div>

                        <span className="text-xs font-mono text-slate-400">
                          Scheduled: {alert.startTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {alert.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Affected Wards: <strong>{alert.affectedAreas.join(', ')}</strong></span>
                        <span className="text-emerald-600 font-semibold">● Broadcast Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMPLAINT DETAIL DRAWER */}
      {activeDrawerComplaint && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {activeDrawerComplaint.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                        PRIORITY_BADGES[activeDrawerComplaint.priority].bg
                      } ${PRIORITY_BADGES[activeDrawerComplaint.priority].text} ${
                        PRIORITY_BADGES[activeDrawerComplaint.priority].border
                      }`}
                    >
                      {activeDrawerComplaint.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {activeDrawerComplaint.category}
                  </h3>
                  <span className="text-xs text-slate-500">
                    📍 {activeDrawerComplaint.location}
                  </span>
                </div>

                <button
                  onClick={() => setActiveDrawerComplaint(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Citizen Description */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wide block">
                  Citizen Reported Text:
                </span>
                <p className="text-slate-700 italic">
                  "{activeDrawerComplaint.description}"
                </p>
                {activeDrawerComplaint.imageUrl && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Attached Photo:</span>
                    <img
                      src={activeDrawerComplaint.imageUrl}
                      alt="Complaint attachment"
                      className="w-full h-40 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                )}
              </div>

              {/* AI Triage Recommendation */}
              <div className="bg-cyan-50/60 p-4 rounded-xl border border-cyan-100 space-y-2 text-xs">
                <span className="font-bold text-cyan-900 uppercase tracking-wide block">
                  AI Recommendation & Triage:
                </span>
                <p className="text-slate-800">{activeDrawerComplaint.aiAnalysis?.summary || 'Standard municipal triage logged.'}</p>
                <div className="pt-1 text-slate-600 space-y-1 border-t border-cyan-100">
                  <div>
                    <span className="font-medium text-slate-500">Priority Reason:</span>{' '}
                    <span>{activeDrawerComplaint.aiAnalysis?.priorityReason || 'Based on municipal category parameters.'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">Suggested Action:</span>{' '}
                    <span>{activeDrawerComplaint.aiAnalysis?.suggestedAction || 'Dispatch ward sector inspection unit.'}</span>
                  </div>
                </div>
              </div>

              {/* Update Status & Team form */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Admin Dispatch Controls
                </h4>

                <div>
                  <label htmlFor="drawer-status" className="block text-xs font-semibold text-slate-700 mb-1">
                    Update Complaint Status
                  </label>
                  <select
                    id="drawer-status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="Submitted">1. Submitted</option>
                    <option value="Under Review">2. Under Review</option>
                    <option value="Assigned">3. Assigned</option>
                    <option value="In Progress">4. In Progress</option>
                    <option value="Resolved">5. Resolved</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="drawer-team" className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Response Squad
                  </label>
                  <select
                    id="drawer-team"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="">-- Choose Field Unit --</option>
                    {MUNICIPAL_TEAMS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.lead})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="drawer-remarks" className="block text-xs font-semibold text-slate-700 mb-1">
                    Append Municipal Action Remark
                  </label>
                  <input
                    id="drawer-remarks"
                    type="text"
                    value={internalRemark}
                    onChange={(e) => setInternalRemark(e.target.value)}
                    placeholder="e.g. Sluice valve isolated. Pipe sleeve replacement underway."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                {/* If marking resolved: Resolution evidence upload / photo url */}
                {newStatus === 'Resolved' && (
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-3 text-xs">
                    <span className="font-bold text-emerald-900 block">
                      Resolution Evidence Proof
                    </span>
                    <div>
                      <label htmlFor="resolution-photo" className="block text-[11px] font-semibold text-emerald-800 mb-1">
                        Post-Repair Photo URL:
                      </label>
                      <input
                        id="resolution-photo"
                        type="text"
                        value={resolutionEvidenceUrl}
                        onChange={(e) => setResolutionEvidenceUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setResolutionEvidenceUrl(
                            'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'
                          )
                        }
                        className="text-[11px] text-emerald-700 font-semibold underline mt-1"
                      >
                        Insert Demo Repaired Pipe Evidence Photo
                      </button>
                    </div>

                    <div>
                      <label htmlFor="resolution-engineer-notes" className="block text-[11px] font-semibold text-emerald-800 mb-1">
                        Engineer Closure Notes:
                      </label>
                      <textarea
                        id="resolution-engineer-notes"
                        rows={2}
                        value={resolutionRemarks}
                        onChange={(e) => setResolutionRemarks(e.target.value)}
                        placeholder="Describe completed works and hydraulic test..."
                        className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Update feedback message */}
            {updateSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                ✓ {updateSuccessMsg}
              </div>
            )}

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <button
                onClick={() => setActiveDrawerComplaint(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDrawer}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0B1A30] hover:bg-[#122B48] text-white text-xs font-bold rounded-xl shadow-xs transition-colors text-center"
              >
                Save & Update Task Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ALERT MODAL */}
      {showNewAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAlert}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Broadcast New Public Water Notice
              </h3>
              <button
                type="button"
                onClick={() => setShowNewAlertModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label htmlFor="notice-headline" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Notice Headline
              </label>
              <input
                id="notice-headline"
                type="text"
                required
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="e.g. Emergency Feeder Pipeline Maintenance"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="alert-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Category
                </label>
                <select
                  id="alert-category"
                  value={alertCategory}
                  onChange={(e) => setAlertCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Supply Interruption">Supply Interruption</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Advisory">Advisory</option>
                </select>
              </div>

              <div>
                <label htmlFor="alert-severity" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Severity
                </label>
                <select
                  id="alert-severity"
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                >
                  <option value="Warning">Warning (Standard)</option>
                  <option value="Critical">Critical (High Urgency)</option>
                  <option value="Info">Info (Restoration Notice)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="affected-areas" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Affected Wards / Sectors (comma-separated)
              </label>
              <input
                id="affected-areas"
                type="text"
                value={alertAreas}
                onChange={(e) => setAlertAreas(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label htmlFor="alert-description" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Description & Advisory Advice
              </label>
              <textarea
                id="alert-description"
                rows={3}
                required
                value={alertDescription}
                onChange={(e) => setAlertDescription(e.target.value)}
                placeholder="Explain the cause and citizen recommendations..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewAlertModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0B1A30] hover:bg-[#122B48] text-white text-xs font-bold rounded-xl"
              >
                Publish Notice to App & SMS
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
