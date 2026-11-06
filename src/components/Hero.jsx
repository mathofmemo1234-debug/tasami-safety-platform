import React from 'react';
import { ShieldCheck, HardHat, Settings, FileText, Play, CheckCircle2, Award } from 'lucide-react';

export default function Hero({ lang, content, onOpenConsultation }) {
  const t = content[lang].hero;

  const pillarIcons = [
    <ShieldCheck className="w-6 h-6 text-[#c59a45]" />,
    <FileText className="w-6 h-6 text-[#c59a45]" />,
    <Settings className="w-6 h-6 text-[#c59a45]" />,
    <HardHat className="w-6 h-6 text-[#c59a45]" />,
  ];

  return (
    <section id="home" className="relative pt-6 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Decorative architectural background geometry */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#c59a45]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-slate-200/50 blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-right rtl:text-right ltr:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c59a45]/10 border border-[#c59a45]/30">
              <span className="w-2 h-2 rounded-full bg-[#c59a45] animate-pulse"></span>
              <span className="text-xs font-black tracking-widest text-[#9a752a] uppercase">
                {t.badge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight">
              {lang === 'ar' ? (
                <>
                  نحو بيئة <span className="text-[#c59a45] underline decoration-[#c59a45]/30 underline-offset-8">أكثر أماناً</span>
                  <br />
                  لمستقبل مستدام
                </>
              ) : (
                <>
                  Towards a <span className="text-[#c59a45]">Safer Environment</span>
                  <br />
                  for a Sustainable Future
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
              {t.description}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#c59a45] hover:bg-[#b58a38] shadow-lg hover:shadow-gold-glow transition-all transform hover:-translate-y-0.5"
              >
                <span>{t.ctaPrimary}</span>
                <span className={lang === 'ar' ? 'rotate-180' : ''}>→</span>
              </button>

              <a
                href="#services"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl text-base font-bold text-slate-800 hover:text-[#c59a45] bg-white border border-slate-200 hover:border-[#c59a45]/40 shadow-sm transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#c59a45]/15 flex items-center justify-center text-[#c59a45]">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
                <span>{t.ctaSecondary}</span>
              </a>
            </div>

            {/* Trust badge */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>معتمد من الدفاع المدني (منصة سلامة)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#c59a45]" />
                <span>مطابق لكود البناء السعودي (SBC)</span>
              </div>
            </div>
          </div>

          {/* Visual Column: Engineer & Riyadh Skyline */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#c59a45]/30 to-slate-200 transform rotate-2 scale-105 filter blur-lg opacity-70"></div>

              {/* Main Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                {/* Background: Riyadh Skyline Photo */}
                <img
                  src="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1000&q=80"
                  alt="Riyadh Skyline and Kingdom Tower"
                  className="w-full h-[460px] object-cover opacity-80 mix-blend-luminosity filter contrast-125"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

                {/* Floating Safety Helmet Badge with Brand */}
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                  <div className="glass-dark px-3 py-1.5 rounded-full border border-white/20 text-xs text-white font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>معتمد رسمياً في المملكة 🇸🇦</span>
                  </div>
                </div>

                {/* Hero Feature Overlay at Bottom */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl glass-dark border border-white/10 text-white backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c59a45] to-[#9a752a] flex items-center justify-center flex-shrink-0 shadow-md">
                      <HardHat className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">إشراف هندسي وميداني معتمد</h4>
                      <p className="text-xs text-slate-300 mt-0.5">كوادر سعودية متخصصة ومصنفة لدى هيئة المهندسين</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Pill */}
              <div className="absolute -bottom-5 -right-4 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#c59a45] font-black text-sm">
                  10+
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">سنوات ريادة</div>
                  <div className="text-[10px] text-slate-500">في الأمن والسلامة</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Quick Highlights / 4 Pillars Bar matching the design */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {t.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white hover:bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-[#c59a45]/50 shadow-sm hover:shadow-md transition-all duration-200 group text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-50 group-hover:bg-[#c59a45]/15 flex items-center justify-center mb-3 transition-colors">
                  {pillarIcons[idx]}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#c59a45] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
