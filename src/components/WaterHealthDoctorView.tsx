import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  PhoneCall,
  Clock,
  ShieldCheck,
  AlertTriangle,
  User,
  MapPin,
  CheckCircle2,
  Camera,
  HeartPulse,
  Info,
  Calendar,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Building2,
  HelpCircle,
} from 'lucide-react';

interface DoctorProfile {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  hospital: string;
  ward: string;
  availability: string;
  languages: string[];
  rating: string;
  consultationsDone: number;
}

const ON_DUTY_DOCTORS: DoctorProfile[] = [
  {
    id: 'doc-1',
    name: 'Dr. Neha Kapoor',
    qualification: 'MD (Dermatology), DNB',
    specialization: 'Waterborne Dermal Allergies & Chemical Dermatitis',
    hospital: 'Ward 14 Central Municipal Health Clinic',
    ward: 'Ward 14 (Central Metro District)',
    availability: 'On Duty · Avg Callback 10-15 mins',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: '4.9 ★',
    consultationsDone: 342,
  },
  {
    id: 'doc-2',
    name: 'Dr. Amit Verma',
    qualification: 'MBBS, DVD (Skin & Venereology)',
    specialization: 'Contact Dermatitis & Tap Water Contamination Rashes',
    hospital: 'Civic Community Health Center #03',
    ward: 'Ward 15 (Civic Center)',
    availability: 'On Duty · Avg Callback 12 mins',
    languages: ['English', 'Hindi'],
    rating: '4.8 ★',
    consultationsDone: 289,
  },
  {
    id: 'doc-3',
    name: 'Dr. Shalini Deshmukh',
    qualification: 'MD (Pediatrics & Preventive Medicine)',
    specialization: 'Pediatric Sensitive Skin & Waterborne Pathogens',
    hospital: 'Mother & Child Civic Healthcare Wing',
    ward: 'Ward 12 (Hilltop Sector)',
    availability: 'Available · Walk-in & Tele-Consult',
    languages: ['English', 'Marathi'],
    rating: '4.9 ★',
    consultationsDone: 415,
  },
];

const COMMON_SYMPTOMS = [
  'Skin itching / burning after shower',
  'Red patches or hives (Urticaria)',
  'Dry peeling skin & eczema flare-up',
  'Eye stinging / redness after washing',
  'Blisters or small bumps on arms/legs',
  'Scalp irritation & folliculitis',
  'Child / infant sensitive skin reaction',
  'Mild nausea or accidental ingestion',
];

export const WaterHealthDoctorView: React.FC = () => {
  const { setView } = useApp();

  const [selectedDoctor, setSelectedDoctor] = useState<string>('doc-1');
  const [patientName, setPatientName] = useState('Aarav Sharma');
  const [patientPhone, setPatientPhone] = useState('1111-222-33-4');
  const [patientAge, setPatientAge] = useState('32');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Skin itching / burning after shower',
  ]);
  const [description, setDescription] = useState(
    'Skin on forearms and chest developed severe itching and red rash within 30 minutes of taking morning shower with tap water.'
  );
  const [urgency, setUrgency] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [consultationMode, setConsultationMode] = useState<'phone' | 'whatsapp' | 'clinic'>('phone');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedConsultation, setSubmittedConsultation] = useState<{
    token: string;
    doctorName: string;
    timestamp: string;
    callbackTime: string;
  } | null>(null);

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const doc = ON_DUTY_DOCTORS.find((d) => d.id === selectedDoctor) || ON_DUTY_DOCTORS[0];

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedConsultation({
        token: `DOC-HLTH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        doctorName: doc.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        callbackTime: urgency === 'Severe' ? 'Within 5-8 minutes' : 'Within 10-15 minutes',
      });
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-[#0B1A30] via-[#0E2E4E] to-[#0A223D] rounded-2xl p-5 sm:p-8 text-white shadow-sm border border-cyan-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#16B8C4]/15 to-transparent pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Civic Public Health & Water Dermatology Service</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Consult a Doctor for Water-Induced Skin & Health Issues
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Experiencing skin irritation, rashes, itching, burning eyes, or dermal inflammation after using municipal tap water? Connect with certified municipal dermatologists and public health officers for free tele-triage and treatment guidance.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="tel:1111222334"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Instant Emergency Hotline: 1111-222-33-4</span>
            </a>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Available 24/7 · Average response under 15 mins</span>
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation State if just submitted */}
      {submittedConsultation ? (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Doctor Notified
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Token: {submittedConsultation.token}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                Consultation Request Confirmed
              </h2>
            </div>
          </div>

          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/80 text-xs sm:text-sm space-y-2">
            <p className="text-slate-800">
              <strong>{submittedConsultation.doctorName}</strong> (On-Duty Specialist) has received your symptoms and photos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Expected Callback Window:</span>
                <span className="font-bold text-emerald-700 text-sm">{submittedConsultation.callbackTime}</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Patient Contact:</span>
                <span className="font-bold text-slate-800">{patientName} ({patientPhone})</span>
              </div>
            </div>
          </div>

          {/* Immediate At-Home Care Tips */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 sm:p-5 text-xs text-amber-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-950">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Immediate Medical Advice While Awaiting Callback:</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-amber-800">
              <li><strong>Do not bathe or wash face</strong> with raw tap water until tested. Use packaged or boiled and cooled water.</li>
              <li><strong>Do not scratch or rub</strong> the irritated skin. Pat gently with a sterile, dry towel.</li>
              <li>Avoid applying fragrant lotions, harsh soaps, or strong steroid ointments without the doctor's explicit instructions.</li>
              <li>If experiencing facial swelling, breathing difficulty, or fever, proceed to the nearest emergency clinic immediately.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setSubmittedConsultation(null)}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
            >
              ← File Another Consultation
            </button>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => setView('citizen')}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors text-center"
              >
                Return to Citizen Dashboard
              </button>
              <a
                href="tel:1111222334"
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#0B1A30] hover:bg-[#122B48] rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Doctor Directly (1111-222-33-4)</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column: Form to Contact Doctor */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-cyan-600" />
                  <span>Request Water-Related Medical Consultation</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill in your symptoms for instant review by on-duty civic medical staff.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Doctor Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    1. Select Available Municipal Doctor / Specialist
                  </label>
                  <div className="space-y-2">
                    {ON_DUTY_DOCTORS.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                          selectedDoctor === doc.id
                            ? 'border-cyan-500 bg-cyan-50/50 ring-2 ring-cyan-500/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center shrink-0">
                            <Stethoscope className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900">{doc.name}</span>
                              <span className="text-[10px] text-slate-500 font-medium">({doc.qualification})</span>
                            </div>
                            <div className="text-[11px] text-cyan-800 font-medium">{doc.specialization}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{doc.hospital}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-1.5 sm:pt-0 border-slate-100 shrink-0">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {doc.availability}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium mt-1">
                            {doc.languages.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Patient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Patient Age
                    </label>
                    <input
                      type="number"
                      required
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="e.g. 32"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* 3. Water-Related Symptoms */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    2. Select Experienced Symptoms (Tap all that apply)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_SYMPTOMS.map((sym) => {
                      const isSelected = selectedSymptoms.includes(sym);
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => toggleSymptom(sym)}
                          className={`text-[11px] px-2.5 py-1.5 rounded-lg border font-medium transition-all text-left ${
                            isSelected
                              ? 'bg-[#0B1A30] text-cyan-300 border-[#0B1A30] shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {sym}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    3. Detailed Problem Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe when the reaction started, which water tap was used, severity of itching/burning, and any prior allergies..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                {/* 5. Urgency & Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Urgency Level
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['Mild', 'Moderate', 'Severe'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setUrgency(lvl)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            urgency === lvl
                              ? lvl === 'Severe'
                                ? 'bg-red-600 text-white border-red-600'
                                : 'bg-[#0B1A30] text-cyan-300 border-[#0B1A30]'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Preferred Mode
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConsultationMode('phone')}
                        className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                          consultationMode === 'phone'
                            ? 'bg-[#0B1A30] text-cyan-300 border-[#0B1A30]'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        📞 Phone Call
                      </button>
                      <button
                        type="button"
                        onClick={() => setConsultationMode('whatsapp')}
                        className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                          consultationMode === 'whatsapp'
                            ? 'bg-[#0B1A30] text-cyan-300 border-[#0B1A30]'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        💬 Chat / Media
                      </button>
                      <button
                        type="button"
                        onClick={() => setConsultationMode('clinic')}
                        className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                          consultationMode === 'clinic'
                            ? 'bg-[#0B1A30] text-cyan-300 border-[#0B1A30]'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        🏥 Clinic Visit
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6. Optional Photo of skin reaction */}
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    4. Attach Photo of Skin Rash / Irritation (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-700 transition-colors">
                      <Camera className="w-4 h-4 text-cyan-600" />
                      <span>{imagePreview ? 'Change Photo' : 'Upload Skin Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <div className="flex items-center gap-2">
                        <img
                          src={imagePreview}
                          alt="Skin issue preview"
                          className="w-9 h-9 rounded-lg object-cover border border-slate-300"
                        />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500">
                    🔒 Free civic service. Encrypted medical tele-triage.
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#16B8C4] hover:bg-[#00E5FF] text-[#0B1A30] font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>{isSubmitting ? 'Dispatching Request...' : 'Confirm Doctor Consultation'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Doctor Info, Direct Phone Dial, and Water Skin Guidance */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Emergency Doctor Helpline Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                <HeartPulse className="w-4 h-4" />
                <span>Direct Tele-Health Helpline</span>
              </div>
              <h3 className="text-lg font-extrabold text-white">
                Need Immediate Spoken Medical Advice?
              </h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Connect directly with the on-duty civic medical triage team for rapid assessment of acute skin reactions or children exposed to contaminated water.
              </p>
              <div className="pt-1">
                <a
                  href="tel:1111222334"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white text-emerald-950 font-black text-sm rounded-xl hover:bg-emerald-50 active:scale-95 transition-all shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-700" />
                  <span>Call 1111-222-33-4 (Toll-Free)</span>
                </a>
              </div>
            </div>

            {/* Medical Guidance Guide: Water Skin Reactions */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>Common Water Skin Complications & Guidance</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-900">1. High Chlorine / Hard Water Dermatitis</div>
                  <p>Excessive chlorination causes intense skin drying, redness, and itching within minutes of showering. Rinse with boiled & cooled water and apply soothing emollient.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-900">2. Bacterial Folliculitis (Water Rash)</div>
                  <p>Contaminated water entering hair follicles can cause red pimple-like bumps. Do not squeeze or scratch; medical antiseptic lotion is recommended by doctor.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-900">3. Eye Redness / Conjunctival Irritation</div>
                  <p>Wash eyes only with sterile saline or distilled water. Avoid rubbing. Consult doctor immediately if burning lasts more than 2 hours.</p>
                </div>
              </div>

              {/* Red Flag Warning */}
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">When to Seek Emergency Care:</span>
                  <span>If skin blisters rapidly, oozes pus, spreads with fever, or if lips/eyelids swell, visit a hospital emergency department immediately.</span>
                </div>
              </div>
            </div>

            {/* Link back to report water grievance */}
            <div className="p-4 bg-cyan-50/60 rounded-xl border border-cyan-200/60 text-xs text-cyan-900 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold block">Need to Report the Contaminated Tap?</span>
                <span className="text-cyan-800">Submit a municipal water quality complaint to dispatch laboratory sampling vans.</span>
              </div>
              <button
                onClick={() => setView('report')}
                className="shrink-0 px-3 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg text-xs transition-colors"
              >
                Report Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
