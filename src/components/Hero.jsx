import React from 'react';
import {
  ShieldCheck,
  HardHat,
  Settings,
  Flame,
  BellRing,
  Droplets,
  CheckCircle2,
  Award,
  Layers,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function Hero({
  lang,
  content,
  onOpenConsultation,
  onNavigateServices,
  onNavigateProducts
}) {
  const isAr = lang === 'ar';
  const t = content[lang].hero;
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const pillarIcons = [
    <BellRing className="w-5 h-5 text-[#1d4ed8] dark:text-[#60a5fa]" />,
    <Settings className="w-5 h-5 text-[#1d4ed8] dark:text-[#60a5fa]" />,
    <ShieldCheck className="w-5 h-5 text-[#1d4ed8] dark:text-[#60a5fa]" />,
    <Flame className="w-5 h-5 text-[#c59a45] dark:text-[#dfb76c]" />,
  ];

  return (
    <section id="home" className="relative pt-8 pb-14 lg:pb-20 overflow-hidden bg-white dark:bg-[#0b1120] transition-colors duration-300">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#c59a45]/10 dark:bg-[#c59a45]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#1d4ed8]/10 dark:bg-[#1d4ed8]/15 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-right rtl:text-right ltr:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c59a45]/10 dark:bg-[#c59a45]/15 border border-[#c59a45]/35">
              <span className="w-2 h-2 rounded-full bg-[#c59a45] animate-pulse"></span>
              <span className="text-[11px] font-bold tracking-wider text-[#9a752a] dark:text-[#dfb76c]">
                {isAr ? 'تسامي الأعمال لأنظمة السلامة ومكافحة الحريق' : 'Tasami for Safety Systems'}
              </span>
            </div>

            {/* Main Headline - Balanced, high-contrast typography */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a] dark:text-white leading-[1.3] tracking-tight">
                {isAr ? (
                  <>
                    حلول متكاملة في أنظمة <span className="text-[#c59a45] dark:text-[#dfb76c]">الإطفاء والإنذار</span>
                  </>
                ) : (
                  <>
                    Integrated <span className="text-[#c59a45] dark:text-[#dfb76c]">Fire Protection & Detection</span>
                  </>
                )}
              </h1>
              <p className="text-xl sm:text-2xl text-[#162d6c] dark:text-[#60a5fa] font-semibold leading-relaxed">
                {isAr ? 'نحو بيئة آمنة خالية تماماً من المخاطر' : 'Towards a Hazard-Free Environment'}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-2xl leading-loose">
              {t.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-[#0b1120] bg-[#c59a45] hover:bg-[#dfb76c] shadow-sm hover:shadow-gold-glow transition-all transform hover:-translate-y-0.5"
              >
                <span>{t.ctaPrimary}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateServices}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1d4ed8] hover:bg-[#1e40af] shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <span>{isAr ? 'استعراض الخدمات وتفريعاتها' : 'Explore All Services'}</span>
              </button>

              <button
                onClick={onNavigateProducts}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-[#162d6c] dark:text-slate-100 hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 hover:border-[#1d4ed8] dark:hover:border-[#c59a45] shadow-sm transition-all"
              >
                <span>{isAr ? 'كتالوج المنتجات' : 'Products Catalog'}</span>
              </button>
            </div>

            {/* Trust badge */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{isAr ? 'ترخيص الدفاع المدني (سلامة)' : 'Civil Defense Licensed'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#c59a45] flex-shrink-0" />
                <span>{isAr ? 'مطابق لكود البناء السعودي SBC' : 'Saudi Building Code SBC'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1d4ed8] dark:text-[#60a5fa] flex-shrink-0" />
                <span>{isAr ? 'شهادات SABER / UL / FM' : 'UL / FM / Saber Listed'}</span>
              </div>
            </div>

          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-[#131c31] ring-1 ring-[#c59a45]/30 bg-[#0b1120]">
                <img
                  src="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1000&q=80"
                  alt="Fire & Safety Engineering in Saudi Arabia"
                  className="w-full h-[420px] object-cover opacity-85 mix-blend-luminosity filter contrast-125"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0f2152]/40 to-transparent"></div>

                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                  <div className="glass-dark px-3 py-1 rounded-full border border-[#c59a45]/40 text-xs text-white font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{isAr ? 'منشأة مرخصة ومصنفة رسمياً 🇸🇦' : 'Official Licensed Entity 🇸🇦'}</span>
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl glass-dark border border-[#c59a45]/30 text-white backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c59a45] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <HardHat className="w-5 h-5 text-[#0b1120]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-white">
                        {isAr ? 'فريق هندسي وفني مؤهل ومتخصص' : 'Qualified Engineering Team'}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {isAr ? 'تنفيذ المشاريع بأعلى معايير الاحترافية والالتزام' : 'Highest standards of professional safety'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Pill */}
              <div className="absolute -bottom-4 -right-2 rtl:-right-2 ltr:-left-2 bg-white dark:bg-[#131c31] px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200 dark:border-[#c59a45]/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1d4ed8]/10 dark:bg-[#1d4ed8]/30 flex items-center justify-center text-[#1d4ed8] dark:text-[#60a5fa] font-bold text-xs">
                  100%
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a] dark:text-white">{isAr ? 'أمان وجاهزية تامة' : 'Ready & Secured'}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{isAr ? 'وفق كود البناء السعودي' : 'Per Saudi SBC Code'}</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4 Pillars Preview */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#131c31] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#1d4ed8]/50 dark:hover:border-[#c59a45]/50 shadow-sm text-center transition-colors"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 dark:bg-[#1d4ed8]/20 flex items-center justify-center mb-2.5">
                  {pillarIcons[idx]}
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-[#0f172a] dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
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
