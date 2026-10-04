import React, { createContext, useContext, useState, useEffect } from 'react';
import { Complaint, WaterAlert, WaterSupplyStatus, PriorityLevel, ComplaintStatus, DepartmentName, AIAnalysisResult } from '../types';
import { INITIAL_COMPLAINTS, INITIAL_ALERTS, INITIAL_SUPPLY_STATUS, MUNICIPAL_TEAMS } from '../data/seedData';
import { LanguageCode, TRANSLATIONS } from '../utils/translations';
import { db, mapComplaintToFirestoreDoc, mapFirestoreDocToComplaint, cleanForFirestore } from '../firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { sendComplaintToN8nWebhook } from '../services/webhookService';

export type AppView = 'landing' | 'citizen' | 'report' | 'tracking' | 'alerts' | 'admin' | 'doctor';
export type AdminTab = 'overview' | 'complaints' | 'map' | 'teams' | 'analytics' | 'alerts';

interface AppContextType {
  view: AppView;
  setView: (view: AppView) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  role: 'citizen' | 'admin';
  setRole: (role: 'citizen' | 'admin') => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof TRANSLATIONS['en'];
  
  complaints: Complaint[];
  alerts: WaterAlert[];
  unreadAlertIds: string[];
  markAlertRead: (id: string) => void;
  supplyStatus: WaterSupplyStatus;
  
  // Firestore connection and loading states
  isFirestoreLoading: boolean;
  firestoreError: string | null;
  firestoreConnected: boolean;
  retryFirestore: () => void;
  
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  
  addComplaint: (complaint: Complaint) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus, remark?: string, assignedTeam?: string, resolutionEvidenceUrl?: string) => void;
  addCitizenFeedback: (id: string, rating: number, comment: string) => void;
  addAlert: (alert: Omit<WaterAlert, 'id' | 'publishedAt'>) => void;
  
  analyzeComplaintAI: (data: {
    description: string;
    category?: string;
    location?: string;
    language?: LanguageCode;
  }) => Promise<AIAnalysisResult>;
  
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_COMPLAINTS = 'jalrakshak_complaints_v2';
const STORAGE_KEY_ALERTS = 'jalrakshak_alerts_v2';
const STORAGE_KEY_READ_ALERTS = 'jalrakshak_read_alerts_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>('landing');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [role, setRole] = useState<'citizen' | 'admin'>('citizen');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>('JAL-2026-8492');

  // Firestore connection, loading, and error states
  const [isFirestoreLoading, setIsFirestoreLoading] = useState<boolean>(true);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  const retryFirestore = () => {
    setIsFirestoreLoading(true);
    setFirestoreError(null);
    setRetryCount((prev) => prev + 1);
  };

  // Load complaints from localStorage or initial seed
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMPLAINTS;
  });

  // Load alerts from localStorage or seed
  const [alerts, setAlerts] = useState<WaterAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ALERTS;
  });

  const [unreadAlertIds, setUnreadAlertIds] = useState<string[]>(() => {
    try {
      const read = localStorage.getItem(STORAGE_KEY_READ_ALERTS);
      const readIds: string[] = read ? JSON.parse(read) : [];
      return INITIAL_ALERTS.filter((a) => a.isActive && !readIds.includes(a.id)).map((a) => a.id);
    } catch (e) {
      return INITIAL_ALERTS.filter((a) => a.isActive).map((a) => a.id);
    }
  });

  const [supplyStatus] = useState<WaterSupplyStatus>(INITIAL_SUPPLY_STATUS);

  // Sync to localStorage as offline cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error(e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }, [alerts]);

  const markAlertRead = (id: string) => {
    setUnreadAlertIds((prev) => {
      const next = prev.filter((item) => item !== id);
      try {
        const read = localStorage.getItem(STORAGE_KEY_READ_ALERTS);
        const readIds: string[] = read ? JSON.parse(read) : [];
        if (!readIds.includes(id)) {
          localStorage.setItem(STORAGE_KEY_READ_ALERTS, JSON.stringify([...readIds, id]));
        }
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Real-time Firestore sync for complaints collection
  useEffect(() => {
    setIsFirestoreLoading(true);
    let active = true;

    try {
      const unsubscribe = onSnapshot(
        collection(db, 'complaints'),
        (snapshot) => {
          if (!active) return;
          setIsFirestoreLoading(false);
          setFirestoreConnected(true);
          setFirestoreError(null);

          // Map every Firestore document
          const remoteComplaints: Complaint[] = snapshot.docs.map((docSnap) =>
            mapFirestoreDocToComplaint(docSnap.data(), docSnap.id)
          );

          // Sort by newest submittedAt first
          remoteComplaints.sort(
            (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );

          // Requirement 6: "Remove demo/static complaint data once Firestore data is working."
          // When Firestore connection is established, complaints is populated exclusively from Firestore
          setComplaints(remoteComplaints);

          if (remoteComplaints.length > 0) {
            setSelectedComplaintId((prev) =>
              prev && remoteComplaints.some((c) => c.id === prev) ? prev : remoteComplaints[0].id
            );
          }
        },
        (error) => {
          if (!active) return;
          setIsFirestoreLoading(false);
          console.warn('[Firebase] Firestore onSnapshot for complaints notice:', error.message);
          setFirestoreError(error.message);
        }
      );
      return () => {
        active = false;
        unsubscribe();
      };
    } catch (err: any) {
      setIsFirestoreLoading(false);
      setFirestoreError(err?.message || 'Error initializing Firestore listener');
      console.warn('[Firebase] Firestore listener initialization notice:', err);
    }
  }, [retryCount]);

  // Real-time Firestore sync for alerts
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'alerts'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteAlerts: WaterAlert[] = [];
            snapshot.forEach((docSnap) => {
              remoteAlerts.push(docSnap.data() as WaterAlert);
            });
            setAlerts((prev) => {
              const map = new Map<string, WaterAlert>();
              prev.forEach((a) => map.set(a.id, a));
              remoteAlerts.forEach((a) => map.set(a.id, a));
              return Array.from(map.values()).sort(
                (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
              );
            });
          }
        },
        (error) => {
          console.warn('[Firebase] Firestore onSnapshot for alerts notice:', error.message);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('[Firebase] Firestore alerts listener notice:', err);
    }
  }, []);

  // Requirement 3: When a complaint is submitted, save:
  // complaintId, issueType, description, location, latitude, longitude,
  // voiceTranscript, priority, assignedTeam, status, createdAt, updatedAt
  const addComplaint = async (newComplaint: Complaint) => {
    const payload = mapComplaintToFirestoreDoc(newComplaint);

    // Optimistically update local state so user gets immediate visual feedback
    setComplaints((prev) => [newComplaint, ...prev.filter((c) => c.id !== newComplaint.id)]);
    setSelectedComplaintId(newComplaint.id);

    try {
      await setDoc(doc(db, 'complaints', newComplaint.id), payload);
      setFirestoreConnected(true);
      setFirestoreError(null);
      console.log('[Firebase] Successfully saved complaint to Firestore:', newComplaint.id);

      // Only after Firebase successfully saves the complaint should the webhook request be sent
      try {
        await sendComplaintToN8nWebhook({
          complaintId: newComplaint.id,
          issueType: newComplaint.category,
          description: newComplaint.description,
          location: newComplaint.location,
          priority: newComplaint.priority,
          status: newComplaint.status,
        });
      } catch (webhookErr) {
        console.log('[n8n Webhook] Request failed:', webhookErr);
      }
    } catch (err: any) {
      console.error('[Firebase] Failed to write complaint to Firestore:', err);
      setFirestoreError(err?.message || 'Failed to save complaint to Firestore');
    }
  };

  // Requirement 5: Allow the complaint status to be updated.
  const updateComplaintStatus = async (
    id: string,
    status: ComplaintStatus,
    remark?: string,
    assignedTeam?: string,
    resolutionEvidenceUrl?: string
  ) => {
    const now = new Date().toISOString();
    let updatedTarget: Complaint | undefined;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updatedRemarks = remark
          ? [...c.internalRemarks, `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ${remark}`]
          : c.internalRemarks;

        const updated: Complaint = {
          ...c,
          status,
          updatedAt: now,
          assignedTeam: assignedTeam || c.assignedTeam,
          internalRemarks: updatedRemarks,
          resolutionEvidenceUrl: resolutionEvidenceUrl || c.resolutionEvidenceUrl,
          resolutionRemarks: status === 'Resolved' && remark ? remark : c.resolutionRemarks,
          resolutionTimestamp: status === 'Resolved' ? now : c.resolutionTimestamp,
        };
        updatedTarget = updated;
        return updated;
      })
    );

    // Persist update in Firestore
    try {
      const updateData: Record<string, any> = {
        status,
        updatedAt: now,
      };
      if (assignedTeam) updateData.assignedTeam = assignedTeam;
      if (remark && updatedTarget) {
        updateData.internalRemarks = updatedTarget.internalRemarks;
        if (status === 'Resolved') {
          updateData.resolutionRemarks = remark;
          updateData.resolutionTimestamp = now;
        }
      }
      if (resolutionEvidenceUrl) {
        updateData.resolutionEvidenceUrl = resolutionEvidenceUrl;
      }

      await setDoc(doc(db, 'complaints', id), cleanForFirestore(updateData), { merge: true });
      setFirestoreConnected(true);
      setFirestoreError(null);
      console.log('[Firebase] Successfully updated complaint in Firestore:', id, status);
    } catch (err: any) {
      console.error('[Firebase] Failed to update complaint in Firestore:', err);
      setFirestoreError(err?.message || 'Failed to update complaint in Firestore');
    }
  };

  const addCitizenFeedback = (id: string, rating: number, comment: string) => {
    let updatedTarget: Complaint | undefined;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated: Complaint = {
          ...c,
          citizenFeedback: {
            rating,
            comment,
            confirmedResolved: true,
            timestamp: new Date().toISOString(),
          },
        };
        updatedTarget = updated;
        return updated;
      })
    );

    if (updatedTarget) {
      try {
        const feedbackPayload = cleanForFirestore({
          citizenFeedback: {
            rating,
            comment,
            confirmedResolved: true,
            timestamp: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        });
        setDoc(doc(db, 'complaints', id), feedbackPayload, { merge: true }).catch((err) => {
          console.warn('[Firebase] Failed to update feedback in Firestore:', err);
        });
      } catch (err) {
        console.warn('[Firebase] Firestore feedback error:', err);
      }
    }
  };

  const addAlert = (alertData: Omit<WaterAlert, 'id' | 'publishedAt'>) => {
    const newAlert: WaterAlert = {
      ...alertData,
      id: `ALT-2026-${Math.floor(100 + Math.random() * 900)}`,
      publishedAt: new Date().toISOString(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setUnreadAlertIds((prev) => [newAlert.id, ...prev]);

    // Sync alert to Firestore
    try {
      setDoc(doc(db, 'alerts', newAlert.id), cleanForFirestore(newAlert)).catch((err) => {
        console.warn('[Firebase] Failed to write alert to Firestore:', err);
      });
    } catch (err) {
      console.warn('[Firebase] Firestore alert write error:', err);
    }
  };

  const resetDemoData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setAlerts(INITIAL_ALERTS);
    localStorage.removeItem(STORAGE_KEY_COMPLAINTS);
    localStorage.removeItem(STORAGE_KEY_ALERTS);
    localStorage.removeItem(STORAGE_KEY_READ_ALERTS);
  };

  // AI analysis server call with graceful fallback
  const analyzeComplaintAI = async (data: {
    description: string;
    category?: string;
    location?: string;
    language?: LanguageCode;
  }): Promise<AIAnalysisResult> => {
    try {
      const res = await fetch('/api/ai/analyze-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        return result as AIAnalysisResult;
      }
    } catch (err) {
      console.warn('Backend AI analysis endpoint unavailable, using in-browser heuristic:', err);
    }

    // In-browser client fallback
    const text = (data.description + ' ' + (data.category || '')).toLowerCase();
    const isContamination = text.includes('contaminat') || text.includes('smell') || text.includes('color') || text.includes('taste') || text.includes('dirty') || text.includes('yellow');
    const isBurst = text.includes('burst') || text.includes('gushing') || text.includes('massive') || text.includes('main line');

    const priority: PriorityLevel = isContamination || isBurst ? 'Critical' : text.includes('no water') ? 'High' : 'Medium';

    return {
      category: (data.category as any) || (isContamination ? 'Water contamination concern' : 'Pipe leakage'),
      summary: `Automated analysis for ${data.category || 'water incident'} at ${data.location || 'Municipal Ward 14'}.`,
      priority,
      priorityReason: isContamination
        ? 'Report implies sensory changes to potable supply; prioritised for immediate residual chlorine testing.'
        : 'Priority calibrated to estimated discharge rate and residential neighborhood density.',
      recommendedDepartment: isContamination
        ? 'Water Quality & Chemical Laboratory Division'
        : 'Distribution & Pipeline Maintenance',
      suggestedAction: 'Dispatch field inspection unit with valve key and sampling kit.',
      estimatedHouseholdsImpacted: isContamination ? '60–100 households' : '30–50 households',
      precautionaryNotice: isContamination
        ? 'Precautionary Advisory: Turbidity or odor does not confirm chemical/biological hazard. Boil water prior to consumption until field tests verify safe levels.'
        : undefined,
      duplicateLikelihood: 14,
      aiModel: 'Jalrakshak Client Neural Heuristic',
    };
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        adminTab,
        setAdminTab,
        role,
        setRole,
        language,
        setLanguage,
        t,
        complaints,
        alerts,
        unreadAlertIds,
        markAlertRead,
        supplyStatus,
        selectedComplaintId,
        setSelectedComplaintId,
        isFirestoreLoading,
        firestoreError,
        firestoreConnected,
        retryFirestore,
        addComplaint,
        updateComplaintStatus,
        addCitizenFeedback,
        addAlert,
        analyzeComplaintAI,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
