import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IssueCategory, Complaint, AIAnalysisResult, PriorityLevel } from '../types';
import {
  AlertTriangle,
  Upload,
  Mic,
  MicOff,
  MapPin,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Layers,
  Send,
  Camera,
  RotateCcw,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES: { id: IssueCategory; label: string; icon: string; desc: string }[] = [
  {
    id: 'Pipe leakage',
    label: 'Pipe Leakage',
    icon: '💧',
    desc: 'Burst main, pipeline joint leak, or spraying valve',
  },
  {
    id: 'Water contamination concern',
    label: 'Water Contamination Concern',
    icon: '⚠️',
    desc: 'Discoloration, murky turbidity, sewage odor, or chemical taste',
  },
  {
    id: 'Water supply interruption',
    label: 'Water Supply Interruption',
    icon: '🚫',
    desc: 'No water during scheduled supply hours, dry taps for days',
  },
  {
    id: 'Water wastage or overflow',
    label: 'Water Wastage / Overflow',
    icon: '🌊',
    desc: 'Public cistern or reservoir overflowing onto road/drain',
  },
  {
    id: 'Low water pressure',
    label: 'Low Water Pressure',
    icon: '📉',
    desc: 'Trickling flow, upper floors unable to fill gravity tank',
  },
  {
    id: 'Damaged water infrastructure',
    label: 'Damaged Water Infrastructure',
    icon: '🛠️',
    desc: 'Broken chamber cover, fractured sluice valve, broken standpost',
  },
  {
    id: 'Other water-related issue',
    label: 'Other Water Issue',
    icon: 'ℹ️',
    desc: 'Billing meter anomaly, illegal tapping, or civic inquiry',
  },
];

const SAMPLE_DEMO_PHOTOS = [
  {
    title: 'Gushing Main Leak',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
    category: 'Pipe leakage' as IssueCategory,
  },
  {
    title: 'Yellow Murky Tap Water',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80',
    category: 'Water contamination concern' as IssueCategory,
  },
  {
    title: 'Public Tank Overflow',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
    category: 'Water wastage or overflow' as IssueCategory,
  },
];

export const ReportComplaintView: React.FC = () => {
  const { addComplaint, analyzeComplaintAI, setView, setSelectedComplaintId, language, setLanguage } = useApp();

  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [category, setCategory] = useState<IssueCategory>('Pipe leakage');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Maple Avenue Junction, Ward 14, Central District');
  const [coordinates, setCoordinates] = useState({ lat: 18.5283, lng: 73.8421 });
  const [imageUrl, setImageUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [citizenName, setCitizenName] = useState('Aarav Sharma');
  const [citizenPhone, setCitizenPhone] = useState('1111-222-33-4');

  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [createdComplaintId, setCreatedComplaintId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showN8nPayload, setShowN8nPayload] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle voice simulation / Web Speech API if supported
  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);

    // Realistic voice transcription simulation tailored to water complaints
    const demoTranscripts = [
      'Main pipe joint ruptured near the metro transit station. Potable water is flooding the street for the last 2 hours.',
      'हमारे इलाके में सुबह से नल में मटमैला पानी आ रहा है। कृपया तुरंत जांच करें, पीने योग्य नहीं है।',
      'वॉर्ड १४ मध्ये मुख्य रस्त्यावर जलवाहिनी फुटून पाणी वाहत आहे. कृपया त्वरित कारवाई करावी.',
    ];
    const pickedTranscript = language === 'hi' ? demoTranscripts[1] : language === 'mr' ? demoTranscripts[2] : demoTranscripts[0];

    setTimeout(() => {
      setVoiceTranscript(pickedTranscript);
      setDescription((prev) => (prev ? `${prev}\n\n[Transcribed Voice Note]: ${pickedTranscript}` : pickedTranscript));
      setIsRecording(false);
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setFormError('Please provide a brief description of the water problem.');
      return;
    }
    if (!location.trim()) {
      setFormError('Please provide a location or landmark.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    setStep('analyzing');

    try {
      const analysis = await analyzeComplaintAI({
        description,
        category,
        location,
        language,
      });

      const newId = `JAL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setCreatedComplaintId(newId);
      setAnalysisResult(analysis);

      const newComplaint: Complaint = {
        id: newId,
        citizenName: citizenName || 'Aarav Sharma',
        citizenPhone: citizenPhone || '1111-222-33-4',
        category: analysis.category || category,
        description,
        location,
        ward: 'Ward 14 (Central District)',
        coordinates,
        imageUrl: imageUrl || undefined,
        voiceTranscript: voiceTranscript || undefined,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'Submitted',
        priority: analysis.priority || 'Medium',
        assignedDepartment: analysis.recommendedDepartment,
        assignedTeam: analysis.recommendedDepartment.includes('Laboratory') ? 'Mobile Sampling Lab Unit 1' : 'Rapid Response Pipeline Unit 1',
        aiAnalysis: analysis,
        internalRemarks: [
          `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: Auto-ingested via citizen app. Jalrakshak AI triaged as ${analysis.priority} priority. Auto-routed to ${analysis.recommendedDepartment}.`,
        ],
        language,
      };

      await addComplaint(newComplaint);
      setStep('result');
    } catch (err: any) {
      console.error('Submission failed:', err);
      setFormError('An error occurred during submission. Please try again.');
      setStep('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Step Indicator Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0B1A30] tracking-tight">
              Report a Water Issue
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              AI-assisted municipal complaint intake with instant priority triage and automated department routing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Language:</span>
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(['en', 'hi', 'mr'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                    language === lang ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <div className={`h-1.5 rounded-full ${step === 'form' || step === 'analyzing' || step === 'result' ? 'bg-[#16B8C4]' : 'bg-slate-200'}`} />
          <div className={`h-1.5 rounded-full ${step === 'analyzing' || step === 'result' ? 'bg-[#16B8C4]' : 'bg-slate-200'}`} />
          <div className={`h-1.5 rounded-full ${step === 'result' ? 'bg-[#16B8C4]' : 'bg-slate-200'}`} />
        </div>
      </div>

      {/* STEP 1: FORM */}
      {step === 'form' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              1. What type of water issue are you reporting?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                    category === cat.id
                      ? 'border-[#16B8C4] bg-cyan-50/60 ring-2 ring-[#16B8C4]/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{cat.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">{cat.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{cat.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {category === 'Water contamination concern' && (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">🩺</span>
                  <span>Experiencing skin rashes, itching, or eye burning from this water? Consult on-duty municipal doctors.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setView('doctor')}
                  className="self-start sm:self-auto shrink-0 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs whitespace-nowrap"
                >
                  Consult Doctor
                </button>
              </div>
            )}
          </div>

          {/* Description & Voice */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <label htmlFor="issue-description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Describe the Problem
              </label>
              <button
                type="button"
                onClick={handleVoiceRecord}
                className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5 shrink-0" /> : <Mic className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                <span className="whitespace-nowrap">{isRecording ? 'Listening (Tap to stop)...' : 'Record Voice Note'}</span>
              </button>
            </div>

            <textarea
              id="issue-description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="Provide exact details: When did it start? Is water gushing onto the road? Is tap water cloudy or having an unusual smell?"
              required
              className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 placeholder:text-slate-400"
            />
            {voiceTranscript && (
              <p className="text-xs text-cyan-700 bg-cyan-50/80 p-2.5 rounded-lg border border-cyan-100 mt-2 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Audio Transcript Captured: "{voiceTranscript}"</span>
              </p>
            )}
          </div>

          {/* Image Upload & Demo Photo Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Attach Photo Evidence (Optional)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* File upload box */}
              <label className="sm:col-span-1 border-2 border-dashed border-slate-200 hover:border-cyan-400 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-cyan-50/20 group">
                <Camera className="w-6 h-6 text-slate-400 group-hover:text-cyan-600 mb-1.5 transition-colors" />
                <span className="text-xs font-semibold text-slate-700">Upload Photo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG up to 10MB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {/* Sample Photo Pickers for Hackathon Demo */}
              <div className="sm:col-span-2 flex flex-col justify-center">
                <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                  Or select realistic demo evidence photo:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_DEMO_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageUrl(sample.url);
                        setCategory(sample.category);
                      }}
                      className={`relative rounded-lg overflow-hidden border text-left group transition-all ${
                        imageUrl === sample.url
                          ? 'ring-2 ring-cyan-500 border-cyan-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={sample.url}
                        alt={sample.title}
                        className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[10px] font-medium text-white leading-tight line-clamp-1">
                          {sample.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {imageUrl && (
              <div className="mt-3 flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <img src={imageUrl} alt="Attached Preview" className="w-14 h-14 object-cover rounded-lg" />
                <div className="text-xs flex-1">
                  <span className="font-semibold text-slate-800">Photo Attached</span>
                  <p className="text-[11px] text-slate-500">Will be analyzed by Jalrakshak AI image models.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Location & Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="incident-location" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                4. Incident Location / Landmark
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-cyan-600 absolute left-3 top-3.5" />
                <input
                  id="incident-location"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Street name, landmark, colony"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ward-coordinates" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                GPS Coordinates (Auto-Pinned)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="ward-coordinates"
                  type="text"
                  readOnly
                  value={`${coordinates.lat.toFixed(4)}° N, ${coordinates.lng.toFixed(4)}° E`}
                  className="w-full bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    // Slight jitter to simulate user pin
                    setCoordinates({
                      lat: 18.528 + (Math.random() - 0.5) * 0.02,
                      lng: 73.84 + (Math.random() - 0.5) * 0.02,
                    });
                  }}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium whitespace-nowrap transition-colors"
                >
                  Re-Pin GPS
                </button>
              </div>
            </div>
          </div>

          {/* Citizen contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label htmlFor="citizen-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Citizen Name
              </label>
              <input
                id="citizen-name"
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>
            <div>
              <label htmlFor="citizen-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (for SMS & Resolution Alerts)
              </label>
              <input
                id="citizen-phone"
                type="text"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Validation Error Message */}
          {formError && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{formError}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B1A30] hover:bg-[#122B48] text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#16B8C4]" />
              <span>Submit Complaint for AI Triage</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: ANALYZING STATE */}
      {step === 'analyzing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-6 max-w-lg mx-auto my-8">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-cyan-100 animate-ping opacity-60" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0B1A30] to-[#16B8C4] flex items-center justify-center text-white shadow-lg relative z-10">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              Jalrakshak AI Engine Analyzing
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Evaluating report urgency, cross-referencing hydraulic pipeline telemetry, detecting potential duplicate reports, and routing to the right municipal response wing...
            </p>
          </div>

          <div className="space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>Extracting incident keywords and sensory clues...</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>Assessing contamination biohazard vs structural rupture...</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>Generating n8n automated dispatch webhook payload...</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: AI ANALYSIS RESULT SCREEN */}
      {step === 'result' && analysisResult && (
        <div className="space-y-6">
          {/* Success banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-emerald-950">
                    Complaint Successfully Registered & Triaged
                  </h3>
                  <span className="font-mono text-xs font-bold bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    {createdComplaintId}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  An automated confirmation SMS has been prepared for dispatch to {citizenPhone}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedComplaintId(createdComplaintId);
                  setView('tracking');
                }}
                className="px-4 py-2 bg-[#0B1A30] hover:bg-[#122B48] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Track This Complaint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Precautionary Health Notice (if water quality or contamination) */}
          {analysisResult.precautionaryNotice && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <span className="font-bold text-amber-950 block text-sm">
                  Precautionary Health Notice
                </span>
                <p className="leading-relaxed">
                  {analysisResult.precautionaryNotice}
                </p>
                <p className="text-[11px] text-amber-800 italic">
                  Note: Sensory appearance or odor alone is not laboratory proof of chemical contamination. Water sample collection van has been scheduled.
                </p>
              </div>
            </div>
          )}

          {/* AI Triage Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B1A30] via-[#122B48] to-[#0B1A30] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#16B8C4]" />
                <span className="font-extrabold text-base tracking-tight">
                  Jalrakshak AI Triage Assessment
                </span>
              </div>
              <span className="text-[11px] text-cyan-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 font-mono">
                {analysisResult.aiModel || 'Gemini 3.8 Flash'}
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Top classification row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Detected Category
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">
                    {analysisResult.category}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Calculated Priority
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-extrabold px-2.5 py-0.5 rounded ${
                        analysisResult.priority === 'Critical'
                          ? 'bg-red-100 text-red-700'
                          : analysisResult.priority === 'High'
                          ? 'bg-orange-100 text-orange-700'
                          : analysisResult.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {analysisResult.priority}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      (SLA: {analysisResult.priority === 'Critical' ? '4 hrs' : analysisResult.priority === 'High' ? '12 hrs' : '24 hrs'})
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Impact Scope
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">
                    {analysisResult.estimatedHouseholdsImpacted}
                  </span>
                </div>
              </div>

              {/* Summary & Priority justification */}
              <div className="space-y-3">
                <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-100">
                  <span className="text-xs font-bold text-cyan-900 uppercase tracking-wide block mb-1">
                    AI Executive Summary
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {analysisResult.summary}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Priority Determination Rationale
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {analysisResult.priorityReason}
                  </p>
                </div>
              </div>

              {/* Department routing & Suggested next action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Recommended Department Wing
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">
                    {analysisResult.recommendedDepartment}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Ward 14 Sector Lead notified for immediate task authorization.
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Suggested Crew Action
                  </span>
                  <p className="text-xs text-slate-700 leading-snug">
                    {analysisResult.suggestedAction}
                  </p>
                </div>
              </div>

              {/* Duplicate check info & n8n payload preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>
                    Duplicate risk score: <strong className="text-slate-800 font-mono">{analysisResult.duplicateLikelihood}%</strong> (No conflicting duplicates within 150m radius).
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowN8nPayload(!showN8nPayload)}
                  className="text-cyan-700 hover:text-cyan-900 font-medium underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{showN8nPayload ? 'Hide n8n Webhook Payload' : 'View n8n Workflow Webhook'}</span>
                </button>
              </div>

              {/* n8n Payload Drawer */}
              {showN8nPayload && analysisResult.n8nPayload && (
                <div className="bg-[#0B1A30] text-cyan-200 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-cyan-900/60">
                  <div className="text-slate-400 mb-2 font-bold flex items-center justify-between">
                    <span>// Ready for n8n Municipal Webhook Trigger:</span>
                    <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-400">JSON Payload</span>
                  </div>
                  <pre>{JSON.stringify(analysisResult.n8nPayload, null, 2)}</pre>
                </div>
              )}

              {/* Mandatory transparency footnote */}
              <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-500 border border-slate-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Civic Oversight Note:</strong> All AI triage categorizations are preliminary decision-support recommendations. On-duty municipal junior engineers verify findings upon physical site inspection.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setDescription('');
                  setImageUrl('');
                  setVoiceTranscript('');
                }}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors text-center"
              >
                + Report Another Issue
              </button>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView('citizen')}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors text-center"
                >
                  Return to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedComplaintId(createdComplaintId);
                    setView('tracking');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#0B1A30] hover:bg-[#122B48] rounded-xl transition-colors shadow-xs text-center"
                >
                  View Live Tracking Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
