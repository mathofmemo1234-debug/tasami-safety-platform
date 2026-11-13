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

        {/* 1. Vision & Mission Cards Grid with Expressive Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Mission Card */}
          <div id="mission" className="bg-slate-800/90 border border-slate-700 hover:border-[#c59a45]/60 rounded-3xl overflow-hidden group shadow-xl transition-all duration-300 scroll-mt-24 flex flex-col justify-between">
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={mv.mission.image || './images/about/mission-expressive.jpg'}
                alt={mv.mission.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = './images/showcase/hero-engineer.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-4 right-4 rtl:right-4 ltr:left-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#c59a45]/90 backdrop-blur-md flex items-center justify-center text-slate-950 shadow-lg">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#dfb76c] uppercase block">OUR MISSION</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{mv.mission.title}</h3>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
                {mv.mission.content}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center gap-2 text-xs font-semibold text-[#dfb76c]">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ar' ? 'العين الساهرة واليد الماهرة في عالم السلامة' : 'The watchful eye and the skilled hand'}</span>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div id="vision" className="bg-slate-800/90 border border-slate-700 hover:border-[#c59a45]/60 rounded-3xl overflow-hidden group shadow-xl transition-all duration-300 scroll-mt-24 flex flex-col justify-between">
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={mv.vision.image || './images/about/vision-expressive.jpg'}
                alt={mv.vision.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = './images/showcase/vision-banner.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-4 right-4 rtl:right-4 ltr:left-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#c59a45]/90 backdrop-blur-md flex items-center justify-center text-slate-950 shadow-lg">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#dfb76c] uppercase block">OUR VISION</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{mv.vision.title}</h3>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
                {mv.vision.content}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center gap-2 text-xs font-semibold text-[#dfb76c]">
                <Target className="w-4 h-4" />
                <span>{lang === 'ar' ? 'سياج منيع لنحمي الإنسان ونعزز الأثر' : 'An impenetrable shield protecting humanity'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 2. Goals & Values Split Section with Expressive Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Strategic Goals (Left) */}
          <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700/80 rounded-3xl overflow-hidden flex flex-col shadow-lg">
            <div className="relative h-44 overflow-hidden">
              <img
                src={gv.goals.image || './images/about/goals-expressive.jpg'}
                alt={gv.goals.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
              <div className="absolute bottom-4 right-4 rtl:right-4 ltr:left-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c59a45]/90 flex items-center justify-center text-slate-950">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{gv.goals.title}</h3>
                  <span className="text-xs text-slate-300">{lang === 'ar' ? 'أهدافنا الاستراتيجية التنموية' : 'Strategic Milestones'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 space-y-4">
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
          <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700/80 rounded-3xl overflow-hidden flex flex-col shadow-lg">
            <div className="relative h-44 overflow-hidden">
              <img
                src={gv.values.image || './images/about/values-expressive.jpg'}
                alt={gv.values.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
              <div className="absolute bottom-4 right-4 rtl:right-4 ltr:left-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c59a45]/90 flex items-center justify-center text-slate-950">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{gv.values.title}</h3>
                  <span className="text-xs text-slate-300">{lang === 'ar' ? 'قيمنا المؤسسية الحاكمة' : 'Core Organizational Values'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 space-y-3.5">
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
