import React from 'react';
import { Users, FileCheck2, Shield, Building2, Check, ArrowLeft, ArrowRight } from 'lucide-react';

export default function AboutSection({ lang, content, onOpenConsultation }) {
  const t = content[lang].about;

  const statIcons = [
    <Users className="w-6 h-6 text-[#c59a45]" />,
    <FileCheck2 className="w-6 h-6 text-[#c59a45]" />,
    <Shield className="w-6 h-6 text-[#c59a45]" />,
  ];

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Side: Modern Corporate Headquarters with 3D Tasami Logo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                alt="Corporate Headquarters"
                className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent"></div>

              {/* Embossed Brand Banner on Building */}
              <div className="absolute top-8 left-8 right-8 p-4 rounded-2xl glass-dark border border-white/20 text-center">
                <div className="text-xl font-black text-white tracking-widest font-sans">
                  TASAMI
                </div>
                <div className="text-[10px] tracking-widest uppercase text-[#c59a45] font-bold">
                  SAFETY SOLUTION
                </div>
                <div className="mt-1 text-xs text-slate-300 font-semibold font-cairo">
                  — سلامتك أمانة —
                </div>
              </div>

              {/* Slogan pill in the lower area */}
              <div className="absolute bottom-8 left-8 right-8 p-5 rounded-2xl bg-slate-900/90 border border-[#c59a45]/40 text-white backdrop-blur-md">
                <h4 className="font-bold text-base text-[#dfb76c]">
                  سلامة الإنسان أساس استدامة الأعمال
                </h4>
                <p className="text-[11px] text-slate-300 uppercase tracking-wider mt-1 font-mono">
                  PEOPLE SAFETY • BUSINESS SUSTAINABILITY
                </p>
              </div>
            </div>
          </div>

          {/* Text and Story Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-sm font-black tracking-widest text-[#9a752a] uppercase bg-[#c59a45]/10 px-3.5 py-1 rounded-md">
                {t.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {t.title}
              </h2>
            </div>

            <p className="text-lg text-slate-700 leading-relaxed font-medium">
              {t.lead}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              {t.paragraph2}
            </p>

            {/* Saudi Vision 2030 Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/40 border border-amber-200/60 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center p-1.5 flex-shrink-0">
                <div className="text-center font-black leading-none text-slate-800">
                  <span className="text-[9px] block text-emerald-700">رؤيـــة</span>
                  <span className="text-sm tracking-tighter">2030</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                مساهمون فاعلون في تحقيق مستهدفات <strong className="text-slate-900">رؤية السعودية 2030</strong> لتوفير بيئة عمل استثمارية وحضرية متقدمة وآمنة وفق أفضل الممارسات العالمية.
              </p>
            </div>

            {/* Stats Row matching the 3 cards in the design */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-100">
              {t.stats.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center hover:border-[#c59a45]/30 transition">
                  <div className="w-10 h-10 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                    {statIcons[idx]}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                    {stat.number}
                  </div>
                  <div className="text-xs font-bold text-slate-700 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#c59a45] hover:bg-[#b58a38] transition shadow"
              >
                <span>{t.learnMore}</span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
