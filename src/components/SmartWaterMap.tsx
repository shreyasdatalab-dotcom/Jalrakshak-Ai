import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Complaint, PriorityLevel, ComplaintStatus, IssueCategory } from '../types';
import { useApp } from '../context/AppContext';
import { MapPin, Filter, AlertTriangle, CheckCircle2, Clock, ChevronRight, Eye } from 'lucide-react';

interface SmartWaterMapProps {
  onSelectComplaint?: (complaint: Complaint) => void;
  height?: string;
  showFilters?: boolean;
}

const PRIORITY_COLORS: Record<PriorityLevel, { hex: string; bg: string; text: string; label: string }> = {
  Critical: { hex: '#EF4444', bg: 'bg-red-50 text-red-700 border-red-200', text: 'text-red-600', label: 'Critical' },
  High: { hex: '#F97316', bg: 'bg-orange-50 text-orange-700 border-orange-200', text: 'text-orange-600', label: 'High' },
  Medium: { hex: '#EAB308', bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-600', label: 'Medium' },
  Low: { hex: '#0284C7', bg: 'bg-sky-50 text-sky-700 border-sky-200', text: 'text-sky-600', label: 'Low' },
};

export const SmartWaterMap: React.FC<SmartWaterMapProps> = ({
  onSelectComplaint,
  height = '500px',
  showFilters = true,
}) => {
  const { complaints, setSelectedComplaintId, setView } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (selectedPriority !== 'All' && c.priority !== selectedPriority) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedStatus === 'Active' && c.status === 'Resolved') return false;
    if (selectedStatus === 'Resolved' && c.status !== 'Resolved') return false;
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on Pune municipal area
      const map = L.map(mapContainerRef.current, {
        center: [18.528, 73.84],
        zoom: 13,
        zoomControl: true,
        attributionControl: false,
      });

      // Standard OSM tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);

      // Attribution
      L.control
        .attribution({
          position: 'bottomright',
          prefix: 'Leaflet | © OpenStreetMap contributors | Jalrakshak GIS',
        })
        .addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when filter or complaints change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    filteredComplaints.forEach((complaint) => {
      const priorityInfo = PRIORITY_COLORS[complaint.priority] || PRIORITY_COLORS['Medium'];
      const color = priorityInfo.hex;
      const isCritical = complaint.priority === 'Critical';

      // Custom SVG Marker Pin
      const iconHtml = `
        <div style="position: relative; width: 34px; height: 42px;">
          ${
            isCritical
              ? `<div style="position: absolute; top: -4px; left: -4px; width: 42px; height: 42px; border-radius: 50%; background: ${color}; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
              : ''
          }
          <svg viewBox="0 0 24 30" width="34" height="42" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35)); cursor: pointer;">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 30 12 30C12 30 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="${color}"/>
            <circle cx="12" cy="11" r="5" fill="#FFFFFF"/>
            <circle cx="12" cy="11" r="3" fill="${color}"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: iconHtml,
        iconSize: [34, 42],
        iconAnchor: [17, 42],
        popupAnchor: [0, -42],
      });

      const lat = complaint.coordinates?.lat ?? 18.5283;
      const lng = complaint.coordinates?.lng ?? 73.8421;
      const marker = L.marker([lat, lng], {
        icon: customIcon,
      });

      marker.on('click', () => {
        setActiveComplaint(complaint);
        if (onSelectComplaint) {
          onSelectComplaint(complaint);
        }
      });

      // Bind simple popup
      const popupHtml = `
        <div style="font-family: inherit; padding: 14px; min-width: 220px; max-width: 280px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748B;">${complaint.id}</span>
            <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${color}20; color: ${color};">
              ${complaint.priority}
            </span>
          </div>
          <div style="font-weight: 700; font-size: 13px; color: #0F172A; margin-bottom: 4px;">
            ${complaint.category}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            📍 ${complaint.location}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; padding-top: 6px; border-top: 1px solid #E2E8F0;">
            <span style="color: #64748B;">Status: <strong>${complaint.status}</strong></span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersGroup.addLayer(marker);
    });
  }, [filteredComplaints, onSelectComplaint]);

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaintId(complaint.id);
    setView('tracking');
  };

  return (
    <div className="space-y-4">
      {/* Filter toolbar */}
      {showFilters && (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Filter className="w-3.5 h-3.5 text-cyan-600" />
            <span>Map Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Priority filter */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-full scrollbar-none">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all shrink-0 ${
                    selectedPriority === p
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-100 text-slate-700 py-1.5 px-2 rounded-lg border-0 focus:ring-1 focus:ring-cyan-500 font-medium cursor-pointer text-[11px] sm:text-xs max-w-full"
            >
              <option value="All">All Categories</option>
              <option value="Water contamination concern">Contamination</option>
              <option value="Pipe leakage">Pipe Leakage</option>
              <option value="Water supply interruption">Supply Interruption</option>
              <option value="Water wastage or overflow">Wastage / Overflow</option>
              <option value="Low water pressure">Low Pressure</option>
              <option value="Damaged water infrastructure">Damaged Infrastructure</option>
            </select>

            {/* Status filter */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100 p-1 rounded-lg">
              {['All', 'Active', 'Resolved'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all ${
                    selectedStatus === s
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Marker legend */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Low
            </span>
          </div>
        </div>
      )}

      {/* Map + Detail preview layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leaflet Map Container */}
        <div className={`rounded-xl overflow-hidden border border-slate-200/90 shadow-xs relative ${activeComplaint ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

          {/* Quick overlay count */}
          <div className="absolute top-3 left-14 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-600" />
            <span>{filteredComplaints.length} Water Complaints Mapped</span>
          </div>
        </div>

        {/* Selected Complaint Side Card (if a pin is selected) */}
        {activeComplaint && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-500">{activeComplaint.id}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${PRIORITY_COLORS[activeComplaint.priority].bg}`}
                >
                  {activeComplaint.priority} Priority
                </span>
              </div>

              <h4 className="font-bold text-base text-slate-900 leading-snug mb-1">
                {activeComplaint.category}
              </h4>

              <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>{activeComplaint.location}</span>
              </p>

              <p className="text-xs text-slate-600 line-clamp-3 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                "{activeComplaint.description}"
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>Current Status:</span>
                  <span className="font-semibold text-slate-800">{activeComplaint.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>Assigned Wing:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[180px]" title={activeComplaint.assignedDepartment}>
                    {activeComplaint.assignedDepartment}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Impact Scope:</span>
                  <span className="font-medium text-slate-800">{activeComplaint.aiAnalysis.estimatedHouseholdsImpacted}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => handleViewComplaint(activeComplaint)}
                className="w-full sm:flex-1 py-2.5 px-3 text-xs font-semibold text-white bg-[#0B1A30] hover:bg-[#122B48] rounded-lg transition-colors flex items-center justify-center gap-1.5 text-center"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Full Tracking Details</span>
              </button>
              <button
                onClick={() => setActiveComplaint(null)}
                className="w-full sm:w-auto py-2 px-3 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-center"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
