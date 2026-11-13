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
    <section id="home" className="relative pt-10 pb-16 lg:pb-24 overflow-hidden bg-white dark:bg-[#0b1120] hero-grid-bg transition-colors duration-300">
      {/* Decorative pulsing ambient auroras */}
      <div className="absolute -top-24 right-0 -mr-24 w-[440px] h-[440px] rounded-full bg-gradient-to-br from-[#dfb76c]/25 via-[#c59a45]/10 to-transparent blur-3xl pointer-events-none animate-glow-pulse"></div>
      <div className="absolute bottom-0 -left-16 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#1d4ed8]/20 via-[#162d6c]/10 to-transparent dark:from-[#1d4ed8]/30 blur-3xl pointer-events-none animate-glow-pulse" style={{ animationDelay: '2.5s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center flex flex-col items-center">
            
            {/* Luxury Shimmer Motto Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#c59a45]/15 via-[#dfb76c]/10 to-[#162d6c]/10 dark:from-[#c59a45]/25 dark:to-[#1d4ed8]/20 border border-[#c59a45]/45 shadow-gold-subtle">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c59a45] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c59a45]"></span>
              </span>
              <span className="text-xs font-extrabold tracking-wide text-[#9a752a] dark:text-[#dfb76c]">
                {isAr ? 'سلامتك أمانة • تسامي الأعمال لأنظمة السلامة' : 'Your Safety Is Our Trust • Tasami Safety Systems'}
              </span>
            </div>

            {/* Main Headline - Animated metallic gold text */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black text-[#0f172a] dark:text-white leading-[1.24] tracking-tight">
                {isAr ? (
                  <>
                    حلول هندسية متكاملة في أنظمة <span className="gold-gradient-text">الإطفاء والإنذار</span>
                  </>
                ) : (
                  <>
                    Integrated <span className="gold-gradient-text">Fire Protection & Detection</span>
                  </>
                )}
              </h1>
              <p className="text-xl sm:text-2xl text-[#162d6c] dark:text-[#60a5fa] font-extrabold leading-relaxed">
                {isAr ? 'نحو بيئة آمنة خالية تماماً من المخاطر' : 'Towards a Hazard-Free Environment'}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-loose">
              {t.description}
            </p>

            {/* Flashy Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={onOpenConsultation}
                className="btn-flashy-gold inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-black text-[#0b1120]"
              >
                <span>{t.ctaPrimary}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateServices}
                className="btn-flashy-royal inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white"
              >
                <span>{isAr ? 'استعراض الخدمات وتفريعاتها' : 'Explore All Services'}</span>
              </button>

              <button
                onClick={onNavigateProducts}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-[#162d6c] dark:text-slate-100 hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] bg-white/90 dark:bg-[#131c31]/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-[#c59a45] shadow-sm hover:shadow-md transition-all"
              >
                <span>{isAr ? 'كتالوج المنتجات' : 'Products Catalog'}</span>
              </button>
            </div>

            {/* Trust badge */}
            <div className="pt-5 w-full flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800/80 font-semibold">
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

          {/* Showcase Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glowing Gold/Royal Rim */}
              <div className="p-[2px] rounded-[26px] bg-gradient-to-br from-[#dfb76c] via-[#1d4ed8]/60 to-[#c59a45] shadow-[0_25px_60px_-15px_rgba(22,45,108,0.4)] dark:shadow-[0_25px_65px_-12px_rgba(197,154,69,0.28)] group">
                <div className="relative rounded-3xl overflow-hidden bg-[#0b1120]">
                  <img
                    src="./images/hero-tasami-engineer-clean.jpg"
                    alt="مهندس سلامة معتمد - شركة تسامي الأعمال لأنظمة السلامة"
                    className="w-full h-[430px] object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = './images/showcase/hero-engineer.jpg';
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#0f2152]/30 to-transparent"></div>

                  {/* Top Glass Pill + Gold Shield Emblem */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-2">
                    <div className="glass-dark px-3.5 py-1.5 rounded-full border border-[#c59a45]/50 text-xs text-white font-bold flex items-center gap-2 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>{isAr ? 'منشأة مرخصة ومصنفة رسمياً 🇸🇦' : 'Official Licensed Entity 🇸🇦'}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-lg border border-[#c59a45]/50 flex items-center justify-center">
                      <img src="./logo.jpg" alt="Tasami Shield" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  {/* Bottom Executive Glass Card */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl glass-dark border border-[#c59a45]/40 text-white shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl gold-gradient-bg flex items-center justify-center flex-shrink-0 shadow-gold-glow">
                        <HardHat className="w-5 h-5 text-[#0b1120]" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-white">
                          {isAr ? 'فريق هندسي وفني مؤهل ومتخصص' : 'Qualified Engineering Team'}
                        </h4>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {isAr ? 'تنفيذ المشاريع بأعلى معايير الاحترافية والالتزام' : 'Highest standards of professional safety'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Levitating Stat Pill 1 */}
              <div className="animate-float absolute -bottom-5 -right-2 rtl:-right-2 ltr:-left-2 bg-white dark:bg-[#131c31] px-4 py-2.5 rounded-2xl shadow-xl border border-[#c59a45]/40 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1d4ed8] to-[#162d6c] flex items-center justify-center text-white font-black text-xs shadow-sm">
                  100%
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0f172a] dark:text-white">{isAr ? 'أمان وجاهزية تامة' : 'Ready & Secured'}</div>
                  <div className="text-[10px] text-slate-500 dark:text-[#dfb76c] font-semibold">{isAr ? 'وفق كود البناء السعودي' : 'Per Saudi SBC Code'}</div>
                </div>
              </div>

              {/* Levitating Stat Pill 2 */}
              <div className="hidden sm:flex animate-float absolute top-24 -left-4 rtl:-left-4 ltr:-right-4 bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-[#1d4ed8]/30 dark:border-[#c59a45]/35 items-center gap-2.5" style={{ animationDelay: '1.6s' }}>
                <span className="w-7 h-7 rounded-lg bg-[#c59a45]/15 text-[#9a752a] dark:text-[#dfb76c] font-black text-xs flex items-center justify-center">
                  ★
                </span>
                <div>
                  <div className="text-xs font-black text-[#0f172a] dark:text-white">+1,200</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-300">{isAr ? 'مشروع مؤمّن' : 'Secured Sites'}</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4 Pillars Preview with Luxury Card Hover */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.features.map((feature, idx) => (
              <div
                key={idx}
                className="card-flashy relative overflow-hidden bg-white dark:bg-[#131c31] p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#c59a45]/60 shadow-sm text-center group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1d4ed8] via-[#c59a45] to-[#162d6c] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-blue-50 to-amber-50/60 dark:from-[#1d4ed8]/25 dark:to-[#c59a45]/15 border border-[#1d4ed8]/15 dark:border-[#c59a45]/25 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  {pillarIcons[idx]}
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-[#0f172a] dark:text-white group-hover:text-[#1d4ed8] dark:group-hover:text-[#dfb76c] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
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
