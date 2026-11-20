import React from 'react';
import {
  ShieldCheck,
  Settings,
  Flame,
  BellRing,
  CheckCircle2,
  Award,
  ArrowRight,
  ArrowLeft
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
  const isAr = lang === 'ar';
  const t = content[lang].hero;
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const pillarIcons = [
    <BellRing className="w-5 h-5 text-[#002366] dark:text-[#D4AF37]" />,
    <Settings className="w-5 h-5 text-[#C5A059] dark:text-[#D4AF37]" />,
    <ShieldCheck className="w-5 h-5 text-[#002366] dark:text-[#D4AF37]" />,
    <Flame className="w-5 h-5 text-[#C5A059] dark:text-[#D4AF37]" />,
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
                onClick={onNavigateServices}
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

            {/* Minimal Trust Metadata Row */}
            <div className="pt-5 w-full border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#002366] dark:text-[#D4AF37] flex-shrink-0" />
                <span>{isAr ? 'ترخيص الدفاع المدني (سلامة)' : 'Civil Defense Licensed'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <span>{isAr ? 'كود البناء السعودي SBC' : 'Saudi Building Code SBC'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#002366] dark:text-[#D4AF37] flex-shrink-0" />
                <span>{isAr ? 'اعتمادات SABER / UL / FM' : 'UL / FM / Saber Listed'}</span>
              </div>
            </div>

          </div>

          {/* Showcase Visual Column - Clean Editorial Frame */}
          <div className="lg:col-span-6">
            <div className="mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131c31]">
              <img
                src="./images/hero-tasami-engineer-clean.jpg"
                alt="مهندس سلامة معتمد - شركة تسامي الأعمال لأنظمة السلامة"
                fetchpriority="high"
                decoding="async"
                className="w-full h-[320px] sm:h-[380px] lg:h-[400px] object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = './images/showcase/hero-engineer.jpg';
                }}
              />
              <div className="px-5 py-3.5 bg-white dark:bg-[#131c31] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
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

        {/* 4 Core Pillars Grid */}
        <div className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {t.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#131c31] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-[#C5A059] transition-colors text-start"
              >
                <div className="w-10 h-10 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-[#0b1120] flex items-center justify-center mb-4">
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
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
