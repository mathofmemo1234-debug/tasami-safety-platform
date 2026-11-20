import React from 'react';
import {
  ShieldCheck,
  Flame,
  BellRing,
  Droplets,
  ArrowRight,
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Hero from '../components/Hero';
import TasamiLogo from '../components/TasamiLogo';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import CivilDefenseKnowledgeHub from '../components/CivilDefenseKnowledgeHub';
import CustomParagraphSlot, { FormattedParagraph } from '../components/CustomParagraphSlot';
import { getParagraphStyle } from '../utils/typography';

export default function HomePage({
  lang,
  content,
  onNavigate,
  onOpenConsultation,
  activeKnowledgeTab = null
}) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;
  const vis = content[lang]?.visibility || {};

  // 4 Core Highlight Services
  const previewServices = [
    {
      id: 'suppression',
      filter: 'suppression',
      code: 'NFPA 2001 & 96',
      title: isAr ? 'أنظمة الإطفاء التلقائي' : 'Automatic Suppression',
      desc: isAr
        ? 'حماية فورية لغرف الخوادم والمطابخ التجارية بغازات نظيفة.'
        : 'Clean-agent and wet-chemical protection for server rooms and kitchens.',
      highlights: isAr
        ? ['غازات FM-200 و NOVEC 1230 الآمنة', 'أنظمة الأيروسول وغرف السيرفرات', 'إطفاء المطابخ التجارية التلقائي']
        : ['FM-200 & NOVEC 1230 clean agents', 'Condensed aerosol & data rooms', 'Wet-chemical commercial kitchens'],
      icon: <Flame className="w-5 h-5 text-[#C5A059]" />,
      tag: isAr ? 'إطفاء نظيف' : 'Clean Agent'
    },
    {
      id: 'alarm-smoke',
      filter: 'alarm-smoke',
      code: 'NFPA 72 & 92 • SBC 801',
      title: isAr ? 'الإنذار والتحكم بالدخان' : 'Alarm & Smoke Control',
      desc: isAr
        ? 'كواشف مبكرة ذكية ومراوح سحب وضغط لسلالم الطوارئ.'
        : 'Smart early fire detection and certified stairwell pressurization.',
      highlights: isAr
        ? ['لوحات إنذار معنونة ذكية', 'كواشف دخان وحرارة عالية الدقة', 'مراوح سحب الدخان وضغط السلالم']
        : ['Addressable smart fire panels', 'Precision smoke & heat detectors', 'Smoke extraction & pressurization'],
      icon: <BellRing className="w-5 h-5 text-[#002366] dark:text-[#D4AF37]" />,
      tag: isAr ? 'إنذار مبكر' : 'Early Detection'
    },
    {
      id: 'sprinklers-pumps',
      filter: 'sprinklers-pumps',
      code: 'NFPA 13 & 20 • UL/FM',
      title: isAr ? 'الرشاشات المائية والمضخات' : 'Sprinklers & Pumps',
      desc: isAr
        ? 'تصميم وتركيب شبكات الرشاشات ومحطات المضخات UL/FM.'
        : 'UL/FM certified fire pump stations and automated sprinkler grids.',
      highlights: isAr
        ? ['محطات مضخات كهرباء وديزل UL/FM', 'شبكات رشاشات مائية أوتوماتيكية', 'مواسير ASTM A53 ومحابس معتمدة']
        : ['UL/FM electric & diesel pumps', 'Automated wet sprinkler grids', 'ASTM A53 pipes & listed valves'],
      icon: <Droplets className="w-5 h-5 text-[#002366] dark:text-[#D4AF37]" />,
      tag: isAr ? 'شبكات مائية' : 'Hydraulic Systems'
    },
    {
      id: 'maintenance-licenses',
      filter: 'maintenance',
      code: 'SBC 801 • SALAMAH',
      title: isAr ? 'الصيانة وتراخيص سلامة' : 'Maintenance & Compliance',
      desc: isAr
        ? 'فحص دوري وإصدار عقود وتراخيص منصة سلامة الرسمية.'
        : 'Preventive maintenance contracts and official Civil Defense approvals.',
      highlights: isAr
        ? ['عقود صيانة موثقة في منصة سلامة', 'فحص دوري واختبارات تشغيل كاملة', 'تقارير فنية فورية لتجديد بلدي']
        : ['Electronic Salama portal contracts', 'Periodic preventive maintenance', 'Instant Balady compliance reports'],
      icon: <ShieldCheck className="w-5 h-5 text-[#C5A059]" />,
      tag: isAr ? 'معتمد رسمياً' : 'Official Certs'
    }
  ];

  const accreditations = [
    {
      id: 'salamah',
      title: isAr ? 'منصة سلامة' : 'Salamah',
      sub: isAr ? 'ترخيص معتمد' : 'Civil Defense',
      detail: isAr
        ? 'اعتماد رسمي لإصدار عقود الصيانة الدورية ورفع تقارير الجاهزية للدفاع المدني.'
        : 'Official authorization to issue periodic maintenance contracts and readiness reports.'
    },
    {
      id: 'sbc',
      title: 'SBC',
      sub: isAr ? 'كود البناء السعودي' : 'Saudi Code',
      detail: isAr
        ? 'الالتزام الكامل بمتطلبات كود الحماية من الحرائق SBC 801 في التصميم والتنفيذ.'
        : 'Full engineering compliance with Saudi Fire Code SBC 801 across all installations.'
    },
    {
      id: 'saber',
      title: 'SABER',
      sub: isAr ? 'مطابقة ومواصفات' : 'Certified',
      detail: isAr
        ? 'جميع الأجهزة والأنابيب واللوحات مسجلة بشهادات مطابقة معتمدة من SASO.'
        : 'All fire gear, pipes, and panels registered with SASO SABER conformity certificates.'
    },
    {
      id: 'ulfm',
      title: 'UL / FM',
      sub: isAr ? 'معايير عالمية' : 'Listed',
      detail: isAr
        ? 'معدات ومضخات ورشاشات مختبرة ومعتمدة وفق أرقى معايير الجودة العالمية.'
        : 'Fire pumps, valves, and sprinklers globally tested and listed by UL and FM.'
    }
  ];

  // 4 Featured Products Preview
  const previewProducts = [
    {
      name: isAr ? 'لوحات إنذار الحريق المعنونة' : 'Addressable Fire Alarm Panels',
      category: isAr ? 'أنظمة الإنذار' : 'Alarms',
      specs: isAr ? '2 إلى 8 لوبات • معتمدة UL / LPCB' : '2-8 Loops • UL / LPCB Approved',
      image: './images/products/alarm-1.jpg'
    },
    {
      name: isAr ? 'أسطوانات FM-200 و NOVEC 1230' : 'Clean Agent Suppression Cylinders',
      category: isAr ? 'الإطفاء التلقائي' : 'Suppression',
      specs: isAr ? 'معتمدة UL/FM • صديقة للبيئة' : 'UL/FM Certified • Zero Ozone Depletion',
      image: './images/products/gas-1.jpg'
    },
    {
      name: isAr ? 'رؤوس رشاشات الحريق' : 'Automatic Sprinkler Heads',
      category: isAr ? 'الشبكات المائية' : 'Sprinklers',
      specs: isAr ? 'درجات حرارة متعددة • معتمدة UL/FM' : 'Multiple Temp Ratings • UL/FM Listed',
      image: './images/products/sprinkler-1.jpg'
    },
    {
      name: isAr ? 'مضخات وصناديق الحريق' : 'Fire Pumps & Hose Cabinets',
      category: isAr ? 'معدات الإطفاء' : 'Fire Equipment',
      specs: isAr ? 'مضخات UL/FM • مواصفات الدفاع المدني' : 'UL/FM Pump Sets • Civil Defense Approved',
      image: './images/products/pump-angle-1.jpg'
    }
  ];

  return (
    <div className="home-minimal bg-white dark:bg-[#0b1120] space-y-24 lg:space-y-32 pb-16">
      {/* 1. Hero Section */}
      {vis.hero !== false && (
        <Hero
          lang={lang}
          content={content}
          onOpenConsultation={onOpenConsultation}
          onNavigateServices={(filter = null) => onNavigate('services', filter ? 'services-grid' : null, filter)}
          onNavigateProducts={() => onNavigate('products')}
        />
      )}

      <CustomParagraphSlot placement="home:afterHero" lang={lang} content={content} />

      {/* 2. Company Highlight (Minimalist Pure White Frame) */}
      {vis.about !== false && (
        <section id="home-about" className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 scroll-mt-24">
          <div className="bg-white dark:bg-[#131c31] rounded-2xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              <div className="lg:col-span-8 space-y-4 text-center lg:text-start flex flex-col items-center lg:items-start">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <TasamiLogo content={content} isWhite={false} lang={lang} className="h-14 sm:h-16" />
                  <span className="text-xs font-semibold text-[#C5A059] dark:text-[#D4AF37]">
                    {isAr ? 'تسامي الأعمال لأنظمة السلامة' : 'Tasami for Safety Systems'}
                  </span>
                </div>

                <div className="w-10 h-0.5 bg-[#C5A059]"></div>

                <h2 className="text-lg sm:text-xl lg:text-[1.375rem] font-bold text-[#002366] dark:text-white leading-[1.4] tracking-[-0.01em]">
                  {isAr
                    ? 'شريككم الهندسي المعتمد لحماية الأرواح والمنشآت'
                    : 'Your Certified Engineering Partner in Safety & Protection'}
                </h2>

                <FormattedParagraph
                  content={content}
                  lang={lang}
                  paraKey="homeAbout"
                  className="w-full text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-[1.85] max-w-2xl"
                  defaultText={isAr
                    ? 'نوفر حلولاً هندسية متكاملة تشمل التوريد والتركيب والصيانة لأنظمة الحريق والإنذار وفق اشتراطات الدفاع المدني وكود البناء السعودي SBC.'
                    : 'Turnkey fire protection and alarm engineering solutions fully compliant with Civil Defense and the Saudi Building Code (SBC).'}
                />

                <CustomParagraphSlot placement="home:insideAbout" lang={lang} content={content} className="w-full" />

                <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#002366] dark:text-[#D4AF37]" />
                    {isAr ? 'ترخيص منصة سلامة' : 'Civil Defense Accredited'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#C5A059]" />
                    {isAr ? 'كود البناء السعودي SBC' : 'Saudi Building Code SBC'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#002366] dark:text-[#D4AF37]" />
                    {isAr ? 'اعتمادات سابر والمواصفات' : 'Saber & SASO Approved'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-2.5 text-center lg:text-end">
                <button
                  onClick={() => onNavigate('about')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#002366] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>{isAr ? 'عن الشركة والقيادة' : 'About Us & Leadership'}</span>
                  <ChevronIcon className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-400 dark:text-slate-400">
                  {isAr ? 'الرؤية، القيادة، والهيكل التنظيمي' : 'Vision, leadership & organization'}
                </span>
              </div>

            </div>
          </div>
        </section>
      )}

      <CustomParagraphSlot placement="home:afterAbout" lang={lang} content={content} />

      {/* 3. Services Highlights Section */}
      {vis.services !== false && (
        <section id="home-services" className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 scroll-mt-24">
          <div className="flex flex-col items-center text-center mb-10 gap-3">
            <span className="text-xs font-semibold text-[#C5A059] dark:text-[#D4AF37] tracking-wide">
              {isAr ? 'حلول وأنظمة متكاملة' : 'Integrated Systems'}
            </span>
            <h2 className="text-lg sm:text-xl lg:text-[1.375rem] font-bold text-[#002366] dark:text-white leading-[1.4] tracking-[-0.01em]">
              {isAr ? 'خدماتنا الهندسية المعتمدة' : 'Our Engineering Services'}
            </h2>
            <FormattedParagraph
              content={content}
              lang={lang}
              paraKey="homeServicesHeader"
              className="w-full text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto"
              defaultText={isAr
                ? 'استعراض سريع لأبرز مجالات عملنا الهندسية.'
                : 'A focused overview of our certified safety engineering services.'}
            />
            <button
              onClick={() => onNavigate('services')}
              className="mt-1 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#002366] dark:text-[#D4AF37] hover:text-[#1D4ED8] transition-colors"
            >
              <span>{isAr ? 'عرض كافة الخدمات' : 'View All Services'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {previewServices.map((srv) => (
              <div
                key={srv.id}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate('services', 'services-grid', srv.filter)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate('services', 'services-grid', srv.filter);
                  }
                }}
                className="group relative bg-white dark:bg-[#131c31] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-[#C5A059] hover:shadow-md cursor-pointer flex flex-col justify-between transition-all text-start focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-[#0b1120] flex items-center justify-center group-hover:border-[#C5A059] transition-colors">
                      {srv.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-[#C5A059] dark:text-[#D4AF37]">
                      {srv.tag}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#002366] dark:text-white mb-2">
                    {srv.title}
                  </h3>
                  <p
                    style={getParagraphStyle(content, lang, 'homeServicesCards')}
                    className="w-full text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                  >
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#002366] dark:text-[#D4AF37]">
                  <span>{isAr ? 'تفاصيل الخدمة' : 'Service Details'}</span>
                  <ChevronIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>

                {/* Hover-to-Reveal Service Technical Highlights */}
                <div className="hover-popover-up hidden sm:block absolute bottom-full pb-2.5 inset-x-0 z-30 text-start">
                  <div className="rounded-2xl bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-[#C5A059] dark:text-[#D4AF37]">{srv.code}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xs font-bold text-[#002366] dark:text-white">{srv.title}</div>
                    <ul className="space-y-1">
                      {srv.highlights.map((hl, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#C5A059] shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-[#002366] dark:text-[#D4AF37]">
                      <span>{isAr ? 'عرض تفاصيل النظام' : 'View System Details'}</span>
                      <ChevronIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <CustomParagraphSlot placement="home:afterServices" lang={lang} content={content} />

      {/* 4. Products Preview Section */}
      {vis.products !== false && (
        <section id="home-products" className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 scroll-mt-24">
          <div className="flex flex-col items-center text-center mb-10 gap-3">
            <span className="text-xs font-semibold text-[#C5A059] dark:text-[#D4AF37] tracking-wide">
              {isAr ? 'توريدات ومعدات أصلية' : 'Certified Supplies'}
            </span>
            <h2 className="text-lg sm:text-xl lg:text-[1.375rem] font-bold text-[#002366] dark:text-white leading-[1.4] tracking-[-0.01em]">
              {isAr ? 'كتالوج منتجات السلامة' : 'Fire Safety Products'}
            </h2>
            <FormattedParagraph
              content={content}
              lang={lang}
              paraKey="homeProductsHeader"
              className="w-full text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto"
              defaultText={isAr
                ? 'منتجات معتمدة بشهادات UL و FM وسابر.'
                : 'Certified fire equipment listed under UL, FM, and SABER.'}
            />
            <button
              onClick={() => onNavigate('products')}
              className="mt-1 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#002366] dark:text-[#D4AF37] hover:text-[#1D4ED8] transition-colors"
            >
              <span>{isAr ? 'تصفح كتالوج المنتجات' : 'Explore Products Catalog'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {previewProducts.map((p, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('products')}
                className="group bg-white dark:bg-[#131c31] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-[#C5A059] cursor-pointer flex flex-col transition-colors"
              >
                <div className="h-44 bg-white dark:bg-[#0b1120] border-b border-slate-100 dark:border-slate-800 overflow-hidden relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1599818497672-132d73f1d24c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute top-3 right-3 rtl:right-3 ltr:left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#002366] text-white">
                    {p.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between text-start">
                  <div>
                    <h3 className="text-sm font-bold text-[#002366] dark:text-white mb-1.5 line-clamp-1">
                      {p.name}
                    </h3>
                    <p
                      style={getParagraphStyle(content, lang, 'homeProductsCards')}
                      className="w-full text-xs text-slate-500 dark:text-slate-400"
                    >
                      {p.specs}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#002366] dark:text-[#D4AF37]">
                    <span>{isAr ? 'عرض المواصفات' : 'View Specs'}</span>
                    <ChevronIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <CustomParagraphSlot placement="home:afterProducts" lang={lang} content={content} />

      {/* 5. Trust & Accreditations Banner (Pure White Minimalist Frame) */}
      {vis.licenses !== false && (
        <section id="home-accreditations" className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 scroll-mt-24">
          <div className="rounded-2xl bg-white dark:bg-[#131c31] border border-[#002366]/15 dark:border-slate-800 px-6 py-12 sm:px-14 sm:py-16 text-center space-y-8">
            <div className="w-12 h-0.5 bg-[#C5A059] mx-auto"></div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#C5A059] dark:text-[#D4AF37] tracking-wide uppercase">
                {isAr ? 'الامتثال والاعتماد الرسمي' : 'Official Accreditations'}
              </span>
              <h2 className="text-lg sm:text-xl lg:text-[1.375rem] font-bold text-[#002366] dark:text-white max-w-xl mx-auto leading-[1.45]">
                {isAr
                  ? 'مرخصون من الدفاع المدني ومعتمدون وفق كود البناء السعودي'
                  : 'Civil Defense Licensed & Saudi Building Code Certified'}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {accreditations.map((acc) => (
                <div
                  key={acc.id}
                  className="group relative bg-white dark:bg-[#0b1120] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-[#C5A059] transition-colors text-center cursor-default"
                >
                  <div className="text-sm font-bold text-[#002366] dark:text-white">{acc.title}</div>
                  <div className="text-[11px] text-[#C5A059] font-medium mt-0.5">{acc.sub}</div>

                  {/* Hover-to-Reveal Accreditation Guarantee */}
                  <div className="hover-popover-up hidden sm:block absolute bottom-full pb-2 left-1/2 -translate-x-1/2 w-56 z-30 text-start">
                    <div className="rounded-xl bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-xl p-3 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-[#C5A059] dark:text-[#D4AF37]">{acc.sub}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <div className="text-xs font-bold text-[#002366] dark:text-white">{acc.title}</div>
                      <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
                        {acc.detail}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="px-7 py-3 rounded-full bg-[#002366] hover:bg-[#1D4ED8] text-white font-semibold text-xs sm:text-sm transition-colors"
              >
                {isAr ? 'طلب معاينة هندسية' : 'Request Site Survey'}
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-7 py-3 rounded-full bg-white dark:bg-transparent border border-[#C5A059] text-[#002366] dark:text-[#D4AF37] hover:bg-[#C5A059] hover:text-white font-semibold text-xs sm:text-sm transition-colors"
              >
                {isAr ? 'تواصل معنا' : 'Contact Us'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5.5 Civil Defense Knowledge Hub */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <CivilDefenseKnowledgeHub
          lang={lang}
          content={content}
          onOpenConsultation={onOpenConsultation}
          initialTab={activeKnowledgeTab}
        />
      </div>

      {/* 6. Customer Ratings & Reviews */}
      <CustomerReviewsSection lang={lang} content={content} />

      <CustomParagraphSlot placement="home:afterLicenses" lang={lang} content={content} className="pb-6" />
    </div>
  );
}
