export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved';

export type IssueCategory =
  | 'Water contamination concern'
  | 'Pipe leakage'
  | 'Water supply interruption'
  | 'Water wastage or overflow'
  | 'Low water pressure'
  | 'Damaged water infrastructure'
  | 'Other water-related issue';

export type DepartmentName =
  | 'Water Quality & Chemical Laboratory Division'
  | 'Distribution & Pipeline Maintenance'
  | 'Emergency Rapid Response Team'
  | 'Zonal Water Supply Operations'
  | 'Reservoir & Pumping Station Wing'
  | 'Metering & Pressure Regulation Unit'
  | 'Civil Infrastructure & Valve Maintenance';

export interface AIAnalysisResult {
  category: IssueCategory;
  summary: string;
  priority: PriorityLevel;
  priorityReason: string;
  recommendedDepartment: DepartmentName;
  suggestedAction: string;
  estimatedHouseholdsImpacted: string;
  precautionaryNotice?: string | null;
  duplicateLikelihood: number;
  aiModel?: string;
  n8nPayload?: {
    event: string;
    source: string;
    timestamp: string;
    priority: PriorityLevel;
    department: string;
    autoRouted: boolean;
    slaHours: number;
  };
}

export interface ComplaintTimelineEvent {
  status: ComplaintStatus;
  timestamp: string;
  author: string;
  note: string;
}

export interface Complaint {
  id: string; // e.g. JAL-2026-4819
  citizenName: string;
  citizenPhone: string;
  category: IssueCategory;
  description: string;
  location: string;
  ward: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl?: string;
  voiceNoteUrl?: string;
  voiceTranscript?: string;
  submittedAt: string;
  updatedAt: string;
  status: ComplaintStatus;
  priority: PriorityLevel;
  assignedDepartment: DepartmentName;
  assignedTeam?: string;
  assignedOfficer?: string;
  aiAnalysis: AIAnalysisResult;
  internalRemarks: string[];
  resolutionEvidenceUrl?: string;
  resolutionRemarks?: string;
  resolutionTimestamp?: string;
  citizenFeedback?: {
    rating: number; // 1 to 5
    comment: string;
    confirmedResolved: boolean;
    timestamp: string;
  };
  language: 'en' | 'hi' | 'mr';
}

export interface WaterAlert {
  id: string;
  title: string;
  titleHi?: string;
  titleMr?: string;
  category: 'Supply Interruption' | 'Maintenance' | 'Emergency' | 'Advisory';
  severity: 'Critical' | 'Warning' | 'Info';
  affectedAreas: string[];
  startTime: string;
  expectedResolution: string;
  description: string;
  publishedBy: string;
  publishedAt: string;
  isActive: boolean;
}

export interface WaterSupplyStatus {
  wardName: string;
  currentStatus: 'Normal Supply' | 'Low Pressure' | 'Scheduled Maintenance' | 'Emergency Outage';
  nextSupplyWindow: string;
  currentPressureBar: number;
  chlorinationPpm: number;
  turbidityNtu: number;
  reservoirLevelPercent: number;
}
