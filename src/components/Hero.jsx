import React, { useState } from 'react';
import {
  ShieldCheck,
  Settings,
  Flame,
  BellRing,
  CheckCircle2,
  Award,
  ArrowRight,
  ArrowLeft,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getParagraphStyle } from '../utils/typography';
import { FormattedParagraph } from './CustomParagraphSlot';

export default function Hero({
  lang,
  content,
  onOpenConsultation,
  onNavigateServices,
  onNavigateProducts
}) {
  const [motionPaused, setMotionPaused] = useState(false);
  const isAr = lang === 'ar';
  const t = content[lang].hero;
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  const pillarIcons = [
    <BellRing className="w-5 h-5 text-[#002366] dark:text-[#D4AF37]" />,
    <Settings className="w-5 h-5 text-[#C5A059] dark:text-[#D4AF37]" />,
    <ShieldCheck className="w-5 h-5 text-[#002366] dark:text-[#D4AF37]" />,
    <Flame className="w-5 h-5 text-[#C5A059] dark:text-[#D4AF37]" />,
  ];

  const telemetryNodes = [
    {
      id: 'alarm',
      posClass: 'left-[31%] top-[28%]',
      delay: '0s',
      Icon: BellRing,
      filter: 'alarm-smoke',
      popoverClass: 'hover-popover-down top-full pt-2 left-0',
      title: isAr ? 'الإنذار المبكر الذكي' : 'Smart Early Detection',
      code: 'SBC 801 • NFPA 72',
      desc: isAr
        ? 'كواشف دخان وحرارة معنونة مع مراقبة فورية 24/7'
        : 'Addressable smoke & heat detectors with 24/7 monitoring'
    },
    {
      id: 'suppression',
      posClass: 'left-[16%] top-[48%]',
      delay: '1.1s',
      Icon: Flame,
      filter: 'suppression',
      popoverClass: 'hover-popover-up bottom-full pb-2 left-0',
      title: isAr ? 'الإطفاء التلقائي النظيف' : 'Clean Agent Suppression',
      code: 'FM-200 • NOVEC 1230',
      desc: isAr
        ? 'إخماد تلقائي خلال 10 ثوانٍ دون إتلاف الأجهزة الحساسة'
        : '10-second clean discharge safe for critical equipment'
    },
    {
      id: 'pumps',
      posClass: 'left-[43%] top-[60%]',
      delay: '2.1s',
      Icon: ShieldCheck,
      filter: 'sprinklers-pumps',
      popoverClass: 'hover-popover-up bottom-full pb-2 -translate-x-1/2 left-1/2',
      title: isAr ? 'الشبكات والمضخات' : 'Pumps & Sprinklers',
      code: 'UL / FM • NFPA 20',
      desc: isAr
        ? 'محطات مضخات ورشاشات مائية معتمدة من الدفاع المدني'
        : 'Civil Defense approved fire pump stations & sprinklers'
    }
  ];

  const trustItems = [
    {
      icon: <CheckCircle2 className="w-4 h-4 text-[#002366] dark:text-[#D4AF37] flex-shrink-0" />,
      label: isAr ? 'ترخيص الدفاع المدني (سلامة)' : 'Civil Defense Licensed',
      badge: isAr ? 'منصة سلامة' : 'Salamah Portal',
      detail: isAr
        ? 'منشأة مصنفة ومرخصة لإصدار عقود الصيانة وتقارير السلامة الإلكترونية للدفاع المدني.'
        : 'Officially licensed on the Civil Defense Salamah portal for maintenance contracts and reports.'
    },
    {
      icon: <Award className="w-4 h-4 text-[#C5A059] flex-shrink-0" />,
      label: isAr ? 'كود البناء السعودي SBC' : 'Saudi Building Code SBC',
      badge: 'SBC 801',
      detail: isAr
        ? 'تصميم وتنفيذ جميع شبكات الإنذار والإطفاء وفق متطلبات كود الحماية من الحرائق SBC 801.'
        : 'All fire protection and alarm systems engineered in strict compliance with SBC 801.'
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-[#002366] dark:text-[#D4AF37] flex-shrink-0" />,
      label: isAr ? 'اعتمادات SABER / UL / FM' : 'UL / FM / Saber Listed',
      badge: 'SABER • UL • FM',
      detail: isAr
        ? 'توريد معدات أصلية مسجلة في سابر ومختبرة عالمياً وفق شهادات UL و FM المعتمدة.'
        : 'Original equipment registered on SASO SABER and globally tested under UL & FM.'
    }
  ];

  const pillarMeta = [
    {
      filter: 'alarm-smoke',
      code: 'NFPA 72 • SBC 801',
      specs: isAr
        ? ['لوحات إنذار معنونة وتقليدية', 'كواشف دخان وحرارة ذكية', 'ربط مباشر مع أنظمة الإخلاء']
        : ['Addressable & conventional panels', 'Smart smoke & heat sensors', 'Integrated evacuation alerts']
    },
    {
      filter: 'alarm-smoke',
      code: 'NFPA 92 • SBC 801',
      specs: isAr
        ? ['مراوح سحب الدخان عالية التحمل', 'أنظمة ضغط سلالم الطوارئ', 'مخمدات حريق أوتوماتيكية']
        : ['High-temp smoke extraction fans', 'Stairwell pressurization', 'Motorized fire & smoke dampers']
    },
    {
      filter: 'sprinklers-pumps',
      code: 'NFPA 13 & 20 • UL/FM',
      specs: isAr
        ? ['محطات مضخات كهرباء وديزل', 'شبكات رشاشات أوتوماتيكية', 'مواسير ASTM A53 ومحابس معتمدة']
        : ['Electric & diesel pump sets', 'Automated sprinkler networks', 'ASTM A53 pipes & listed valves']
    },
    {
      filter: 'suppression',
      code: 'NFPA 2001 & 96',
      specs: isAr
        ? ['غازات FM-200 و NOVEC 1230', 'أنظمة الأيروسول وغرف السيرفرات', 'إطفاء المطابخ التجارية التلقائي']
        : ['FM-200 & NOVEC 1230 clean agents', 'Aerosol & server room systems', 'Wet-chemical kitchen hoods']
    }
  ];

  return (
    <section
      id="home"
      className="bg-white dark:bg-[#0b1120] pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Text Content Column */}
          <div className="lg:col-span-6 space-y-5 text-center items-center lg:text-start lg:items-start flex flex-col">

            {/* Minimalist Eyebrow */}
            <span className="text-xs font-semibold tracking-wide text-[#C5A059] dark:text-[#D4AF37]">
              {isAr ? 'تسامي الأعمال لأنظمة السلامة' : 'Tasami Business for Safety Systems'}
            </span>

            {/* Main Headline (~50% reduced scale, balanced Apple/Microsoft hierarchy) */}
            <div className="space-y-2.5">
              <h1 className="text-lg sm:text-2xl lg:text-[1.6875rem] font-bold text-[#0f172a] dark:text-white leading-[1.45] tracking-[-0.01em]">
                {isAr ? (
                  <>
                    حلول هندسية متكاملة في أنظمة{' '}
                    <span className="text-[#002366] dark:text-[#D4AF37]">الإطفاء والإنذار</span>
                  </>
                ) : (
                  <>
                    Integrated{' '}
                    <span className="text-[#002366] dark:text-[#D4AF37]">Fire Protection &amp; Alarm</span>{' '}
                    Systems
                  </>
                )}
              </h1>

              <FormattedParagraph
                content={content}
                lang={lang}
                paraKey="heroSubtitle"
                className="w-full text-sm sm:text-base text-[#C5A059] dark:text-[#D4AF37] font-semibold leading-relaxed"
                defaultText={isAr ? 'بيئة آمنة خالية من المخاطر' : 'Towards a Hazard-Free Environment'}
              />
            </div>

            {/* Concise Description */}
            <FormattedParagraph
              content={content}
              lang={lang}
              paraKey="heroDescription"
              className="w-full text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-[1.85] max-w-lg"
              defaultText={t.description}
            />

            {/* Clean Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#002366] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                <span>{t.ctaPrimary}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateServices?.()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#C5A059] hover:bg-[#b58f47] text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                <span>{isAr ? 'الخدمات' : 'Services'}</span>
              </button>

              <button
                onClick={onNavigateProducts}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-transparent text-[#002366] dark:text-slate-100 border border-[#002366]/25 dark:border-slate-700 hover:border-[#002366] dark:hover:border-[#D4AF37] text-xs sm:text-sm font-semibold transition-colors"
              >
                <span>{isAr ? 'المنتجات' : 'Products'}</span>
              </button>
            </div>

            {/* Minimal Trust Metadata Row with Instant Hover Preview Cards */}
            <div className="pt-5 w-full border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {trustItems.map((item, idx) => (
                <div key={idx} className="relative group inline-flex items-center gap-1.5 cursor-default">
                  {item.icon}
                  <span className="group-hover:text-[#002366] dark:group-hover:text-[#D4AF37] transition-colors">
                    {item.label}
                  </span>

                  <div className="hover-popover-up hidden sm:block absolute bottom-full pb-2 left-1/2 -translate-x-1/2 w-60 z-30 text-start">
                    <div className="rounded-xl bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-xl p-3 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-[#C5A059] dark:text-[#D4AF37]">{item.badge}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="text-xs font-bold text-[#002366] dark:text-white">{item.label}</div>
                      <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Showcase Visual Column - Lightweight GPU Technical Motion + Telemetry HUD */}
          <div className="lg:col-span-6">
            <div
              className={`mx-auto max-w-md lg:max-w-none rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131c31] shadow-[0_20px_50px_-24px_rgba(0,35,102,0.18)] ${
                motionPaused ? 'hero-motion-paused' : ''
              }`}
            >
              {/* Visual Stage */}
              <div className="relative h-[320px] sm:h-[380px] lg:h-[400px]">
                {/* Clipped Image + Pure GPU Technical Motion Layer */}
                <div className="absolute inset-0 rounded-t-2xl overflow-hidden bg-[#0b1120]">
                  <img
                    src="./images/hero-tasami-engineer-clean.jpg"
                    alt="مهندس سلامة معتمد - شركة تسامي الأعمال لأنظمة السلامة"
                    fetchpriority="high"
                    decoding="async"
                    className="hero-ken-burns w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = './images/showcase/hero-engineer.jpg';
                    }}
                  />

                  {/* Subtle Atmospheric Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/55 via-transparent to-[#070b14]/25 pointer-events-none" />

                  {/* Skyline-Scoped Engineering Grid */}
                  <div className="absolute inset-0 hero-skyline-grid pointer-events-none" />

                  {/* Sweeping Technical Scan Beam */}
                  <div className="absolute inset-x-0 top-0 h-24 hero-scan-beam pointer-events-none bg-gradient-to-b from-transparent via-[#D4AF37]/15 to-[#D4AF37]/30 border-b border-[#D4AF37]/75" />

                  {/* Precision Corner Viewfinder Hairlines */}
                  <span className="absolute top-2.5 left-2.5 w-4 h-4 border-t border-l border-[#D4AF37]/70 pointer-events-none" />
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 border-t border-r border-[#D4AF37]/70 pointer-events-none" />
                  <span className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b border-l border-[#D4AF37]/70 pointer-events-none" />
                  <span className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b border-r border-[#D4AF37]/70 pointer-events-none" />

                  {/* Lightweight SVG Telemetry Links Connecting Skyline Sensors */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    <path
                      d="M 31 28 L 16 48 L 43 60"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="0.35"
                      strokeOpacity="0.55"
                      className="hero-telemetry-line"
                    />
                    <path
                      d="M 31 28 L 43 60"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="0.25"
                      strokeOpacity="0.4"
                      className="hero-telemetry-line"
                    />
                  </svg>
                </div>

                {/* Unclipped Interactive HUD Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Top-Left Live Telemetry Status Pill */}
                  <div className="absolute top-3.5 left-3.5 pointer-events-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b1120]/65 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-semibold text-white">
                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${motionPaused ? '' : 'animate-pulse'}`} />
                    <span>{isAr ? 'رصد سلامة هندسي • SBC 801' : 'Active Safety Scan • SBC 801'}</span>
                  </div>

                  {/* 3 Interactive Smart-Building Telemetry Nodes */}
                  {telemetryNodes.map((node) => {
                    const NodeIcon = node.Icon;
                    return (
                      <div
                        key={node.id}
                        className={`pointer-events-auto group absolute -translate-x-1/2 -translate-y-1/2 ${node.posClass}`}
                      >
                        <button
                          type="button"
                          onClick={() => onNavigateServices?.(node.filter)}
                          aria-label={node.title}
                          className="relative w-8 h-8 rounded-full bg-[#002366]/85 hover:bg-[#002366] text-[#D4AF37] border border-[#D4AF37]/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        >
                          <span
                            aria-hidden="true"
                            style={{ animationDelay: node.delay }}
                            className="hero-radar-ring absolute inset-0 rounded-full border border-[#D4AF37]/75 pointer-events-none"
                          />
                          <NodeIcon className="w-3.5 h-3.5 relative z-10" />
                        </button>

                        {/* Hover-to-Reveal Telemetry Readout */}
                        <div className={`${node.popoverClass} absolute w-56 sm:w-60 z-30 text-start`}>
                          <div className="rounded-xl bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-xl p-3 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#C5A059] dark:text-[#D4AF37]">
                                <NodeIcon className="w-3.5 h-3.5" />
                                <span>{node.code}</span>
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <div className="text-xs font-bold text-[#002366] dark:text-white">{node.title}</div>
                            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 text-start font-normal">
                              {node.desc}
                            </p>
                            <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-[#002366] dark:text-[#D4AF37]">
                              <span>{isAr ? 'عرض تفاصيل النظام' : 'Explore System'}</span>
                              <ChevronIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Apple-style Play / Pause Motion Control */}
                  <div className="absolute bottom-3.5 left-3.5 pointer-events-auto group">
                    <button
                      type="button"
                      onClick={() => setMotionPaused((prev) => !prev)}
                      aria-label={
                        motionPaused
                          ? isAr
                            ? 'تشغيل الحركة التقنية'
                            : 'Resume Technical Motion'
                          : isAr
                          ? 'إيقاف الحركة مؤقتاً'
                          : 'Pause Motion'
                      }
                      className="w-8 h-8 rounded-full bg-[#0b1120]/65 hover:bg-[#0b1120]/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      {motionPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>

                    <div className="hover-popover-up hidden sm:block absolute bottom-full pb-2 left-0 w-44 z-30 text-start">
                      <div className="rounded-lg bg-[#0b1120]/90 backdrop-blur-md border border-white/15 px-2.5 py-1.5 text-[11px] font-semibold text-white whitespace-nowrap shadow-lg">
                        {motionPaused
                          ? isAr
                            ? 'تشغيل الحركة التقنية'
                            : 'Resume Technical Motion'
                          : isAr
                          ? 'إيقاف الحركة مؤقتاً'
                          : 'Pause Motion'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean Caption Footer */}
              <div className="px-5 py-3.5 bg-white dark:bg-[#131c31] border-t border-slate-100 dark:border-slate-800 rounded-b-2xl flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#002366] dark:text-white">
                  {isAr ? 'فريق هندسي معتمد • +1,200 منشأة مؤمّنة' : 'Certified Engineering Team • 1,200+ Sites'}
                </span>
                <span className="text-[11px] font-semibold text-[#C5A059] dark:text-[#D4AF37]">
                  {isAr ? 'كود البناء SBC' : 'SBC Compliant'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Core Pillars Grid with Hover Content Previews */}
        <div className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {t.features.map((feature, idx) => {
              const meta = pillarMeta[idx] || pillarMeta[0];
              return (
                <div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigateServices?.(meta.filter)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNavigateServices?.(meta.filter);
                    }
                  }}
                  className="group relative bg-white dark:bg-[#131c31] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-[#C5A059] hover:shadow-md transition-all text-start cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                >
                  <div className="w-10 h-10 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-[#0b1120] flex items-center justify-center mb-4 group-hover:border-[#C5A059] transition-colors">
                    {pillarIcons[idx]}
                  </div>
                  <h3 className="font-bold text-sm sm:text-[15px] text-[#002366] dark:text-white">
                    {feature.title}
                  </h3>
                  <p
                    style={getParagraphStyle(content, lang, 'heroPillars')}
                    className="w-full text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed"
                  >
                    {feature.desc}
                  </p>

                  {/* Hover-to-Reveal Pillar Technical Specs Card */}
                  <div className="hover-popover-up hidden sm:block absolute bottom-full pb-2.5 inset-x-0 sm:w-64 z-30 text-start">
                    <div className="rounded-2xl bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-[#C5A059] dark:text-[#D4AF37]">
                          {meta.code}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <div className="text-xs font-bold text-[#002366] dark:text-white">{feature.title}</div>
                      <ul className="space-y-1">
                        {meta.specs.map((spec, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#C5A059] shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-[#002366] dark:text-[#D4AF37]">
                        <span>{isAr ? 'استعراض الأنظمة' : 'Explore Systems'}</span>
                        <ChevronIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
