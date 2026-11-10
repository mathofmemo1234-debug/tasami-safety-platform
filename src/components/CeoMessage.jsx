import React from 'react';
import { Quote, ShieldCheck, Award, ExternalLink } from 'lucide-react';

export default function CeoMessage({ lang, content }) {
  const t = content[lang].ceo;

  return (
    <section id="ceo" className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#c59a45]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-black tracking-widest text-[#9a752a] uppercase bg-[#c59a45]/10 border border-[#c59a45]/20 px-3.5 py-1 rounded-md inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <div className="w-16 h-1 bg-[#c59a45] mx-auto rounded-full"></div>
        </div>

        {/* Executive Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* CEO Profile Banner / Avatar Col */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-800 to-[#221a0f] p-8 sm:p-10 text-white flex flex-col justify-between h-full relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c59a45_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10 space-y-6">
                {/* Visual Avatar / Monogram */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#c59a45] to-[#f3dd98] p-1 shadow-2xl mx-auto lg:mx-0">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-center">
                    <span className="text-3xl font-black text-[#e5c172] tracking-wider font-sans">
                      TH
                    </span>
                  </div>
                </div>

                <div className="text-center lg:text-right rtl:lg:text-right ltr:lg:text-left">
                  <h3 className="text-2xl font-black text-white">{t.name}</h3>
                  <p className="text-xs font-semibold text-[#dfb76c] mt-1 font-mono tracking-wide">
                    {t.position}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-2">
                    {lang === 'ar' ? 'قيادة متخصصة ترتكز على معايير السلامة العالمية والتميز الهندسي' : 'Specialized leadership rooted in global safety standards and engineering excellence'}
                  </p>
                </div>

                {/* Social link */}
                <div className="pt-2 flex justify-center lg:justify-start">
                  <a
                    href={t.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#c59a45] text-white text-xs font-semibold transition border border-white/10"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                    <span>{lang === 'ar' ? 'الملف الشخصي على LinkedIn' : 'LinkedIn Profile'}</span>
                  </a>
                </div>
              </div>

              {/* Trust badge */}
              <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#c59a45]" />
                  <span>شركة تسامي الأعمال</span>
                </span>
                <span className="font-mono text-[#dfb76c]">TASAMI</span>
              </div>
            </div>

            {/* CEO Speech Text */}
            <div className="lg:col-span-8 p-8 sm:p-12 relative">
              <Quote className="w-16 h-16 text-[#c59a45]/15 absolute top-6 left-6 rtl:left-auto rtl:right-6 pointer-events-none" />

              <div className="space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
                
                {/* Highlighted Quote Header */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border-r-4 rtl:border-r-4 ltr:border-l-4 border-[#c59a45] text-slate-900 font-bold text-base sm:text-lg leading-snug">
                  "{t.quote}"
                </div>

                <p className="font-medium text-slate-800">
                  {t.p1}
                </p>

                <p>
                  {t.p2}
                </p>

                <p>
                  {t.p3}
                </p>

                {/* Closing signature */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-slate-900 font-bold text-sm">
                    {t.closing}
                  </div>
                  <div className="text-right rtl:text-right ltr:text-left">
                    <span className="text-xs text-slate-500 block">{lang === 'ar' ? 'المدير التنفيذي' : 'Chief Executive Officer'}</span>
                    <span className="text-sm font-black text-slate-900">{t.name}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
