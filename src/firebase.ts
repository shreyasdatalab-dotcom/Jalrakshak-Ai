import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Complaint, ComplaintStatus, PriorityLevel, IssueCategory, DepartmentName } from './types';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDhFLRb_cRvMnQYSTkPG6thpuJakoK3u1Q",
  authDomain: "jalrakshakai-14d47.firebaseapp.com",
  projectId: "jalrakshakai-14d47",
  storageBucket: "jalrakshakai-14d47.firebasestorage.app",
  messagingSenderId: "653359457848",
  appId: "1:653359457848:web:9aeb2abcec4eaa73abe8cd"
};

// Initialize Firebase SDK safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with ignoreUndefinedProperties to prevent undefined field crashes
function getOrInitFirestore() {
  try {
    return initializeFirestore(app, {
      ignoreUndefinedProperties: true,
    });
  } catch {
    return getFirestore(app);
  }
}

export const db = getOrInitFirestore();
export const auth = getAuth(app);

/**
 * Recursively remove or convert undefined values to null for Firestore compliance
 */
export function cleanForFirestore<T>(data: T): T {
  if (data === undefined || data === null) return null as any;
  if (Array.isArray(data)) {
    return data.map(cleanForFirestore) as any;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value);
      }
    }
    return cleaned as any;
  }
  return data;
}

/**
 * Shape of document stored in Firestore "complaints" collection
 * Includes all required fields:
 * complaintId, issueType, description, location, latitude, longitude,
 * voiceTranscript, priority, assignedTeam, status, createdAt, updatedAt
 */
export interface FirestoreComplaintPayload {
  complaintId: string;
  issueType: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  voiceTranscript: string;
  priority: string;
  assignedTeam: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  // Additional metadata for full JalRakshak UI integration
  id: string;
  category: string;
  citizenName: string;
  citizenPhone: string;
  ward: string;
  imageUrl?: string;
  assignedDepartment?: string;
  assignedOfficer?: string;
  aiAnalysis?: any;
  internalRemarks?: string[];
  language?: string;
  citizenFeedback?: any;
  resolutionEvidenceUrl?: string;
  resolutionRemarks?: string;
  resolutionTimestamp?: string;
}

/**
 * Map application Complaint to Firestore Document Payload
 */
export function mapComplaintToFirestoreDoc(complaint: Complaint): FirestoreComplaintPayload {
  const now = new Date().toISOString();
  return cleanForFirestore({
    complaintId: complaint.id,
    issueType: complaint.category,
    description: complaint.description || '',
    location: complaint.location || 'Municipal Water Supply Zone',
    latitude: complaint.coordinates?.lat ?? 18.5283,
    longitude: complaint.coordinates?.lng ?? 73.8421,
    voiceTranscript: complaint.voiceTranscript || '',
    priority: complaint.priority || 'Medium',
    assignedTeam: complaint.assignedTeam || 'Rapid Response Unit 1',
    status: complaint.status || 'Submitted',
    createdAt: complaint.submittedAt || now,
    updatedAt: complaint.updatedAt || now,

    // Supporting properties
    id: complaint.id,
    category: complaint.category,
    citizenName: complaint.citizenName || 'Aarav Sharma',
    citizenPhone: complaint.citizenPhone || '1111-222-33-4',
    ward: complaint.ward || 'Ward 14 (Central District)',
    imageUrl: complaint.imageUrl || '',
    assignedDepartment: complaint.assignedDepartment || 'Distribution & Pipeline Maintenance',
    assignedOfficer: complaint.assignedOfficer || '',
    aiAnalysis: complaint.aiAnalysis || {},
    internalRemarks: complaint.internalRemarks || [],
    language: complaint.language || 'en',
    citizenFeedback: complaint.citizenFeedback || null,
    resolutionEvidenceUrl: complaint.resolutionEvidenceUrl || '',
    resolutionRemarks: complaint.resolutionRemarks || '',
    resolutionTimestamp: complaint.resolutionTimestamp || '',
  }) as FirestoreComplaintPayload;
}

/**
 * Map Firestore document back to application Complaint model
 */
export function mapFirestoreDocToComplaint(data: any, docId: string): Complaint {
  const id = data.complaintId || data.id || docId;
  const category = (data.issueType || data.category || 'Other water-related issue') as IssueCategory;
  const lat = typeof data.latitude === 'number' ? data.latitude : (data.coordinates?.lat ?? 18.5283);
  const lng = typeof data.longitude === 'number' ? data.longitude : (data.coordinates?.lng ?? 73.8421);
  const submittedAt = data.createdAt || data.submittedAt || new Date().toISOString();
  const updatedAt = data.updatedAt || submittedAt;
  const status = (data.status || 'Submitted') as ComplaintStatus;
  const priority = (data.priority || 'Medium') as PriorityLevel;
  const assignedTeam = data.assignedTeam || 'Rapid Response Unit 1';
  const assignedDepartment = (data.assignedDepartment || 'Distribution & Pipeline Maintenance') as DepartmentName;

  return {
    id,
    citizenName: data.citizenName || 'Citizen',
    citizenPhone: data.citizenPhone || '1111-222-33-4',
    category,
    description: data.description || '',
    location: data.location || 'Municipal Water Supply Zone',
    ward: data.ward || 'Ward 14 (Central District)',
    coordinates: { lat, lng },
    imageUrl: data.imageUrl || undefined,
    voiceTranscript: data.voiceTranscript || undefined,
    submittedAt,
    updatedAt,
    status,
    priority,
    assignedDepartment,
    assignedTeam,
    assignedOfficer: data.assignedOfficer || undefined,
    aiAnalysis: {
      category: data.aiAnalysis?.category || category,
      summary: data.aiAnalysis?.summary || data.description || 'Water issue logged by citizen',
      priority: data.aiAnalysis?.priority || priority,
      priorityReason: data.aiAnalysis?.priorityReason || 'Logged via JalRakshak intake portal',
      recommendedDepartment: data.aiAnalysis?.recommendedDepartment || assignedDepartment,
      suggestedAction: data.aiAnalysis?.suggestedAction || 'Dispatch field inspection unit',
      estimatedHouseholdsImpacted: data.aiAnalysis?.estimatedHouseholdsImpacted || '10–30 households',
      precautionaryNotice: data.aiAnalysis?.precautionaryNotice || null,
      duplicateLikelihood: typeof data.aiAnalysis?.duplicateLikelihood === 'number' ? data.aiAnalysis.duplicateLikelihood : 5,
    },
    internalRemarks: Array.isArray(data.internalRemarks) ? data.internalRemarks : [],
    resolutionEvidenceUrl: data.resolutionEvidenceUrl || undefined,
    resolutionRemarks: data.resolutionRemarks || undefined,
    resolutionTimestamp: data.resolutionTimestamp || undefined,
    citizenFeedback: data.citizenFeedback || undefined,
    language: (data.language as 'en' | 'hi' | 'mr') || 'en',
  };
}

// Test Firestore connection on application boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connected to Firestore project:', firebaseConfig.projectId);
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Firestore client is offline. Please check your internet connection or Firebase setup.');
    } else {
      console.log('[Firebase] Firestore initialized for project:', firebaseConfig.projectId);
    }
  }
}

// Run boot check
testFirestoreConnection();
