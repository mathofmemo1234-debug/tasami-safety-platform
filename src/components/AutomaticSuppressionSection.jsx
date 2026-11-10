import React, { useState } from 'react';
import { ShieldCheck, Flame, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle, Zap, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AutomaticSuppressionSection({ lang, content, onSelectService }) {
  const t = content[lang].suppressionSystems;
  const [selectedSystemId, setSelectedSystemId] = useState(t.systems[0].id);

  const activeSystem = t.systems.find((s) => s.id === selectedSystemId) || t.systems[0];

  return (
    <section id="suppression" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Decorative background geometry */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#c59a45]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-black tracking-widest text-[#9a752a] uppercase bg-[#c59a45]/15 border border-[#c59a45]/30 px-3.5 py-1 rounded-md inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t.subtitle}
          </p>
        </div>

        {/* System Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {t.systems.map((system) => {
            const isSelected = system.id === selectedSystemId;
            return (
              <button
                key={system.id}
                onClick={() => setSelectedSystemId(system.id)}
                className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 border flex items-center gap-2 shadow-sm ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#c59a45] hover:text-[#c59a45]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#c59a45]' : 'bg-slate-300'}`}></span>
                <span>{system.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected System Detailed Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#221a0f] p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#c59a45]/20">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#dfb76c] uppercase block">
                {activeSystem.nameEn}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {activeSystem.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {activeSystem.overview}
              </p>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => onSelectService(activeSystem.name)}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-[#dfb76c] hover:bg-white transition shadow-md flex items-center gap-2"
              >
                <span>{lang === 'ar' ? 'طلب عرض سعر لهذا النظام' : 'Request Proposal for System'}</span>
                <span className={lang === 'ar' ? 'rotate-180' : ''}>→</span>
              </button>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            
            {/* Ideal for tag */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start sm:items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#c59a45] flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="text-xs sm:text-sm text-slate-800">
                <strong className="text-slate-900">{lang === 'ar' ? 'أبرز التطبيقات ومناطق الحماية:' : 'Recommended Application Zones:'} </strong>
                <span>{activeSystem.idealFor}</span>
              </div>
            </div>

            {/* Critical Warning if present (e.g. CO2) */}
            {activeSystem.warning && (
              <div className="p-4 rounded-2xl bg-rose-50 border-r-4 rtl:border-r-4 ltr:border-l-4 border-rose-500 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-semibold text-rose-800 leading-relaxed">
                  {activeSystem.warning}
                </p>
              </div>
            )}

            {/* Execution Steps: "كيف نخدمك وننفذ المشروع؟" */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#c59a45]/20 flex items-center justify-center text-[#9a752a]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  {lang === 'ar' ? 'كيف نخدمك وننفذ المشروع؟ (مراحل التشغيل والتدخل)' : 'How We Deliver & Execute This System (Operational Sequence)'}
                </h4>
              </div>

              {/* Steps timeline / grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {activeSystem.executionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#c59a45]/50 transition flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-7 h-7 rounded-full bg-white shadow-sm border border-slate-200 text-[#9a752a] font-black text-xs flex items-center justify-center font-mono">
                          0{idx + 1}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                          STEP {idx + 1}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-slate-900 group-hover:text-[#c59a45] transition-colors">
                        {step.title}
                      </h5>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
