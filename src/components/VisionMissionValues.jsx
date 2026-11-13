import React, { useState } from 'react';
import { Eye, Target, Compass, Sparkles, CheckCircle2, Shield, HeartHandshake, Zap, Award } from 'lucide-react';

export default function VisionMissionValues({ lang, content }) {
  const mv = content[lang].missionVision;
  const gv = content[lang].goalsValues;

  const [activeTab, setActiveTab] = useState('all');

  const valueIcons = [
    <Award className="w-5 h-5 text-[#c59a45]" />,
    <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    <HeartHandshake className="w-5 h-5 text-blue-600" />,
    <Zap className="w-5 h-5 text-amber-500" />,
    <Shield className="w-5 h-5 text-rose-500" />
  ];

  return (
    <section id="vision-values" className="py-20 bg-[#0b1120] dark:bg-[#131c31] rounded-3xl border border-[#1d4ed8]/30 text-white relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#c59a45]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#1d4ed8]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black tracking-widest text-[#dfb76c] uppercase bg-[#c59a45]/20 border border-[#c59a45]/30 px-3.5 py-1 rounded-md inline-block">
            {lang === 'ar' ? 'البوصلة الاستراتيجية' : 'Strategic Compass'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {lang === 'ar' ? 'الرسالة، الرؤية، الأهداف والقيم' : 'Mission, Vision, Goals & Values'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {lang === 'ar'
              ? 'المبادئ الراسخة التي تحكم عملنا الهندسي وتلهمنا لصنع بيئة خالية تماماً من المخاطر'
              : 'The core tenets driving our engineering discipline towards a hazard-free future'}
          </p>
        </div>

        {/* 1. Vision & Mission Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Mission Card */}
          <div id="mission" className="bg-slate-800/90 border border-slate-700 hover:border-[#c59a45]/60 rounded-3xl p-8 sm:p-10 relative overflow-hidden group shadow-xl transition-all duration-300 scroll-mt-24">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#c59a45]/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#c59a45]/20 border border-[#c59a45]/40 flex items-center justify-center text-[#dfb76c] shadow-lg">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-mono tracking-widest text-[#dfb76c] uppercase block">OUR MISSION</span>
                <h3 className="text-2xl font-black text-white">{mv.mission.title}</h3>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
              {mv.mission.content}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center gap-2 text-xs font-semibold text-[#dfb76c]">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? 'العين الساهرة واليد الماهرة في عالم السلامة' : 'The watchful eye and the skilled hand'}</span>
            </div>
          </div>

          {/* Vision Card */}
          <div id="vision" className="bg-slate-800/90 border border-slate-700 hover:border-[#c59a45]/60 rounded-3xl p-8 sm:p-10 relative overflow-hidden group shadow-xl transition-all duration-300 scroll-mt-24">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#c59a45]/20 border border-[#c59a45]/40 flex items-center justify-center text-[#dfb76c] shadow-lg">
                <Eye className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-mono tracking-widest text-[#dfb76c] uppercase block">OUR VISION</span>
                <h3 className="text-2xl font-black text-white">{mv.vision.title}</h3>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
              {mv.vision.content}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center gap-2 text-xs font-semibold text-[#dfb76c]">
              <Target className="w-4 h-4" />
              <span>{lang === 'ar' ? 'سياج منيع لنحمي الإنسان ونعزز الأثر' : 'An impenetrable shield protecting humanity'}</span>
            </div>
          </div>

        </div>

        {/* 2. Goals & Values Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Strategic Goals (Left) */}
          <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700/80 rounded-3xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#c59a45]/20 flex items-center justify-center text-[#dfb76c]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{gv.goals.title}</h3>
                <span className="text-xs text-slate-400">{lang === 'ar' ? 'أهدافنا الاستراتيجية التنموية' : 'Strategic Milestones'}</span>
              </div>
            </div>

            <div className="space-y-4">
              {gv.goals.items.map((goal, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50 hover:border-[#c59a45]/40 transition">
                  <div className="w-6 h-6 rounded-full bg-[#c59a45]/20 text-[#dfb76c] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 font-mono">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {goal}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Values (Right) */}
          <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700/80 rounded-3xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#c59a45]/20 flex items-center justify-center text-[#dfb76c]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{gv.values.title}</h3>
                <span className="text-xs text-slate-400">{lang === 'ar' ? 'قيمنا المؤسسية الحاكمة' : 'Core Organizational Values'}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {gv.values.items.map((val, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50 hover:border-[#c59a45]/40 transition flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/60 flex-shrink-0">
                    {valueIcons[idx % valueIcons.length]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">{val.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
