import React from 'react';
import { Users, FileCheck2, Shield, Building2, Check, ArrowLeft, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export default function AboutSection({ lang, content, onOpenConsultation }) {
  const t = content[lang].about;

  const statIcons = [
    <Users className="w-6 h-6 text-[#1d4ed8] dark:text-[#60a5fa]" />,
    <Building2 className="w-6 h-6 text-[#1d4ed8] dark:text-[#60a5fa]" />,
    <ShieldCheck className="w-6 h-6 text-[#c59a45] dark:text-[#dfb76c]" />,
  ];

  return (
    <section id="about" className="py-16 bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Side: Modern Corporate Headquarters with 3D Tasami Logo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 group">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                alt="Corporate Headquarters"
                className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120]/95 via-[#0f2152]/40 to-transparent"></div>

              {/* Embossed Brand Banner on Building */}
              <div className="absolute top-8 left-8 right-8 p-4 rounded-2xl glass-dark border border-[#c59a45]/30 text-center">
                <div className="text-xl font-black text-white tracking-widest font-sans">
                  TASAMI
                </div>
                <div className="text-[10px] tracking-widest uppercase text-[#dfb76c] font-bold">
                  FOR SAFETY SYSTEMS
                </div>
                <div className="mt-1 text-xs text-slate-200 font-semibold font-cairo">
                  — تسامي الأعمال لأنظمة السلامة —
                </div>
              </div>

              {/* Slogan pill in the lower area */}
              <div className="absolute bottom-8 left-8 right-8 p-5 rounded-2xl bg-[#0b1120]/90 border border-[#c59a45]/40 text-white backdrop-blur-md">
                <h4 className="font-bold text-base text-[#dfb76c]">
                  الأمان ليس خياراً بل ضرورة
                </h4>
                <p className="text-[11px] text-slate-300 uppercase tracking-wider mt-1 font-mono">
                  SAFETY IS A NECESSITY • UNCOMPROMISING PROTECTION
                </p>
              </div>
            </div>
          </div>

          {/* Text and Story Side */}
          <div className="lg:col-span-7 space-y-6 text-right rtl:text-right ltr:text-left">
            <div className="space-y-3">
              <span className="text-sm font-black tracking-widest text-[#9a752a] dark:text-[#dfb76c] uppercase bg-[#c59a45]/10 dark:bg-[#c59a45]/20 px-3.5 py-1 rounded-md inline-block">
                {t.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight">
                {t.title}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#0f172a] dark:text-slate-100 leading-relaxed font-semibold">
              {t.lead}
            </p>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {t.paragraph2}
            </p>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {t.paragraph3}
            </p>

            {/* Saudi Vision 2030 Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-amber-50/50 dark:from-[#0b1120] dark:to-[#162036] border border-[#1d4ed8]/20 dark:border-[#c59a45]/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#131c31] shadow-sm flex items-center justify-center p-1.5 flex-shrink-0 border border-slate-100 dark:border-slate-700">
                <div className="text-center font-black leading-none text-[#0f172a] dark:text-white">
                  <span className="text-[9px] block text-emerald-700 dark:text-emerald-400">رؤيـــة</span>
                  <span className="text-sm tracking-tighter">2030</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                مساهمون فاعلون في تعزيز منظومة السلامة والوقاية الوطنية وفق تطلعات <strong className="text-[#0f172a] dark:text-white">رؤية السعودية 2030</strong> لتوفير بيئة خالية تماماً من المخاطر تحمي الأرواح والممتلكات.
              </p>
            </div>

            {/* Stats Row */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800">
              {t.stats.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-center hover:border-[#c59a45]/50 transition">
                  <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 dark:bg-[#131c31] shadow-sm flex items-center justify-center mb-2">
                    {statIcons[idx]}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white font-sans tracking-tight">
                    {stat.number}
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
                    {stat.sub}
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
