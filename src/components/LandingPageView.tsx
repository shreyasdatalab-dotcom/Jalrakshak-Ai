import React from 'react';
import { useApp } from '../context/AppContext';
import { JalrakshakLogo } from './JalrakshakLogo';
import {
  AlertCircle,
  Shield,
  Sparkles,
  ArrowRight,
  Droplets,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Bot,
  Zap,
  Check,
  FileCheck,
  Radio,
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const { setView, setRole, t } = useApp();

  return (
    <div className="space-y-16 pb-16 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#0B1A30] via-[#0E2442] to-[#122F52] text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#16B8C4]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-12 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Civic Tech Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#16B8C4] animate-pulse"></span>
                <span>Next-Gen Civic Water Intelligence Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-2xl mx-auto lg:mx-0">
                Smarter Water Management Starts Here.
              </h1>

              {/* Tagline & Supporting Copy */}
              <div className="space-y-2 max-w-2xl mx-auto lg:mx-0">
                <p className="text-lg sm:text-xl font-bold text-cyan-300">
                  "Every Drop Matters. Every Complaint Counts."
                </p>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Jalrakshak AI enables citizens to report leaks, water contamination, and supply interruptions via photos and multilingual voice notes, while empowering municipal water authorities to automate urgency triage and dispatch field crews systematically.
                </p>
              </div>

              {/* Primary Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-2 w-full max-w-lg mx-auto lg:mx-0">
                <button
                  onClick={() => {
                    setRole('citizen');
                    setView('report');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 bg-[#16B8C4] hover:bg-[#00E5FF] text-[#0B1A30] font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/25 active:scale-95 transition-all text-center"
                >
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>Report Water Issue</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    setRole('admin');
                    setView('admin');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-sm transition-all text-center"
                >
                  <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Department Login</span>
                </button>

                <button
                  onClick={() => {
                    setRole('citizen');
                    setView('citizen');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3.5 text-slate-300 hover:text-white font-semibold text-xs transition-colors text-center"
                >
                  <span>Citizen Portal Demo →</span>
                </button>
              </div>

              {/* Micro proof points */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B8C4]" />
                  <span>Multilingual (EN / HI / MR)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B8C4]" />
                  <span>Automated Priority Triage</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16B8C4]" />
                  <span>Field Evidence Verification</span>
                </span>
              </div>
            </div>

            {/* Right Hero Graphic Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Visual Glass Card Recreating Brand Symbol and Live Triage Preview */}
                <div className="relative rounded-3xl bg-gradient-to-b from-[#0F2847] to-[#0A1A2F] border border-cyan-500/30 p-8 shadow-2xl overflow-hidden text-center">
                  
                  {/* Subtle water ripple background pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#16B8C4_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

                  {/* Logo Centerpiece */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 shadow-inner mb-4">
                      <JalrakshakLogo size="xl" lightText showText={false} />
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tight">
                      JalRakshak <span className="text-[#16B8C4]">AI</span>
                    </h2>
                    <p className="text-xs text-slate-300 font-medium tracking-wide mt-1">
                      Detect. Dispatch. Save Water.
                    </p>
                  </div>

                  {/* Micro Live Triage Card */}
                  <div className="mt-6 pt-5 border-t border-cyan-800/40 text-left space-y-2.5 relative z-10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">Triage Engine</span>
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[10px] border border-red-500/30">
                        Critical · 4h SLA
                      </span>
                    </div>

                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-[11px] text-slate-200">
                      <span className="text-cyan-400 font-semibold block">Auto-Classified:</span>
                      Underground Trunk Line Rupture · Dispatching Squad #04
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Telemetry: 18.531° N, 73.844° E</span>
                      <span className="text-[#16B8C4]">n8n Webhook Sent ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE-STEP WORKFLOW: REPORT, ANALYZE, RESOLVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
            Operational Lifecycle
          </span>
          <h2 className="text-3xl font-extrabold text-[#0B1A30] tracking-tight">
            How Jalrakshak AI Works: In 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From the moment a citizen spots a leak to final photographic repair certification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 font-black text-lg flex items-center justify-center mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Citizen Grievance Submission
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Report an issue in seconds with photo evidence, a multilingual voice memo, or simple map geolocation. Designed for low-bandwidth mobile devices.
            </p>
            <div className="text-[11px] font-semibold text-cyan-700 bg-cyan-50/60 p-2.5 rounded-lg border border-cyan-100">
              ✓ Supports English, Hindi, and Marathi native input
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-black text-lg flex items-center justify-center mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              AI Priority & Urgency Triage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Jalrakshak AI assesses biohazard contamination risk, flags duplicate neighborhood complaints, calculates affected household scope, and suggests the appropriate wing.
            </p>
            <div className="text-[11px] font-semibold text-blue-700 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
              ✓ Instant SLA assignment (4h, 12h, 24h, 48h)
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 font-black text-lg flex items-center justify-center mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Field Dispatch & Verification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Engineers receive task assignments, perform valve isolation or pipe repairs, upload photographic resolution proof, and citizens confirm closure.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
              ✓ Dual-verification: Engineer proof + Citizen rating
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES FEATURE BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
            Engineered for Municipal Accountability
          </span>
          <h2 className="text-3xl font-extrabold text-[#0B1A30] tracking-tight">
            Key Features of Jalrakshak AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Built to replace slow paper-based logs with accountable, transparent civic technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              AI-Powered Reporting
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Intelligent categorization from unstructured descriptions, audio transcripts, and citizen photos.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Automated Route Dispatch
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct routing to specialized squads (Emergency Leak, Lab Testing, Pressure Unit) without bureaucratic lag.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Geographic GIS Issue Map
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive pin map colored by priority to spot cluster outbreaks and recurring network stress points.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Resolution Audit Proof
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every resolved case requires before/after photographic proof and citizen confirmation before closure.
            </p>
          </div>
        </div>
      </section>

      {/* STATISTICS DEMONSTRATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0B1A30] to-[#143254] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black tracking-tight">
                  Civic Impact Metrics (Prototype Demonstration)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Demonstration figures highlighting simulated performance gains for a mid-sized municipal ward.
                </p>
              </div>

              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-cyan-300 border border-white/10 shrink-0">
                Sample Hackathon Data
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono block">
                  94.2%
                </span>
                <span className="text-xs font-bold text-white mt-1 block">
                  SLA Compliance
                </span>
                <span className="text-[11px] text-slate-300 mt-0.5 block">
                  Critical leaks repaired &lt;4 hrs
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono block">
                  4.8M L
                </span>
                <span className="text-xs font-bold text-white mt-1 block">
                  Potable Water Saved
                </span>
                <span className="text-[11px] text-slate-300 mt-0.5 block">
                  Estimated leakage avoided
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono block">
                  42 mins
                </span>
                <span className="text-xs font-bold text-white mt-1 block">
                  Average Crew Dispatch
                </span>
                <span className="text-[11px] text-slate-300 mt-0.5 block">
                  Down from 4.5 hours
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono block">
                  4.8 / 5
                </span>
                <span className="text-xs font-bold text-white mt-1 block">
                  Citizen Rating
                </span>
                <span className="text-[11px] text-slate-300 mt-0.5 block">
                  Post-repair verification score
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/90 pt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
            <div className="space-y-3">
              <JalrakshakLogo size="md" showTagline={false} />
              <p className="text-slate-500 text-xs leading-relaxed">
                "Every Drop Matters. Every Complaint Counts."
                Civic water intelligence and automated grievance dispatch prototype.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">Platform</h4>
              <ul className="space-y-1.5">
                <li><button onClick={() => setView('report')} className="hover:text-slate-900">Report Water Issue</button></li>
                <li><button onClick={() => setView('tracking')} className="hover:text-slate-900">Track Complaints</button></li>
                <li><button onClick={() => setView('alerts')} className="hover:text-slate-900">Water Supply Alerts</button></li>
                <li><button onClick={() => { setRole('admin'); setView('admin'); }} className="hover:text-slate-900">Department Dashboard</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">Governance & Lab</h4>
              <ul className="space-y-1.5">
                <li><span>Water Quality Standards (BIS 10500)</span></li>
                <li><span>Microbiological Testing Protocol</span></li>
                <li><span>Non-Revenue Water (NRW) Auditing</span></li>
                <li><span>Municipal Ward Feeder Telemetry</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">Emergency Hotline</h4>
              <p className="text-xs text-slate-600 mb-1">
                For hazardous pipeline ruptures or acute contamination emergencies:
              </p>
              <div className="font-mono font-bold text-sm text-slate-900">
                1111-222-33-4 (Municipal Jal Helpline Demo)
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Hackathon prototype demonstration. Not connected to active government emergency lines.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <span>© 2026 Jalrakshak AI Civic Technology Platform. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Open Data Charter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
