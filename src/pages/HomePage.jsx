import React from 'react';
import {
  ShieldCheck,
  Flame,
  BellRing,
  Wind,
  Droplets,
  Package,
  ArrowRight,
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  PhoneCall,
  Sparkles,
  Building2,
  Users
} from 'lucide-react';
import Hero from '../components/Hero';
import TasamiLogo from '../components/TasamiLogo';

export default function HomePage({
  lang,
  content,
  onNavigate,
  onOpenConsultation
}) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;
  const vis = content[lang]?.visibility || {};

  // 4 Core Highlight Services for a clean, spacious home preview
  const previewServices = [
    {
      id: 'suppression',
      title: isAr ? 'أنظمة الإطفاء التلقائي' : 'Automatic Suppression',
      subtitle: isAr ? 'FM-200, NOVEC 1230, الأيروسول، والمطابخ' : 'Clean agent, aerosol & commercial kitchen systems',
      desc: isAr
        ? 'حماية فورية للأماكن الحساسة وغرف الخوادم والمطابخ التجارية بدون استخدام الماء.'
        : 'Instant gas & aerosol suppression for server rooms, sensitive assets and commercial kitchens.',
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      tag: isAr ? 'إطفاء نظيف' : 'Clean Agent'
    },
    {
      id: 'alarm-smoke',
      title: isAr ? 'الإنذار والتحكم بالدخان' : 'Alarm & Smoke Evacuation',
      subtitle: isAr ? 'كواشف ذكية، لوحات تحكم، ومراوح سحب الدخان' : 'Smart detectors, panels & smoke control fans',
      desc: isAr
        ? 'اكتشاف مبكر وذكي للحرائق وتأمين مسارات الهروب وسلالم الطوارئ وفق المعايير.'
        : 'Early smart detection and certified stairwell pressurization systems.',
      icon: <BellRing className="w-6 h-6 text-blue-500" />,
      tag: isAr ? 'إنذار مبكر' : 'Early Detection'
    },
    {
      id: 'sprinklers-pumps',
      title: isAr ? 'الرشاشات المائية والمضخات' : 'Sprinklers & Fire Pumps',
      subtitle: isAr ? 'شبكات متكاملة ومحطات مضخات معتمدة UL/FM' : 'UL/FM certified pump stations & piping grids',
      desc: isAr
        ? 'تصميم وتوريد وتركيب شبكات الرشاشات وصناديق الحريق المعتمدة لكافة المنشآت.'
        : 'Certified fire sprinkler piping, hydrants, and pump networks for all facility types.',
      icon: <Droplets className="w-6 h-6 text-cyan-500" />,
      tag: isAr ? 'شبكات مائية' : 'Hydraulic Systems'
    },
    {
      id: 'maintenance-licenses',
      title: isAr ? 'الصيانة وتراخيص سلامة' : 'Maintenance & Compliance',
      subtitle: isAr ? 'عقود صيانة معتمدة وإصدار شهادات الدفاع المدني' : 'Civil defense certified maintenance contracts',
      desc: isAr
        ? 'فحص دوري وإصدار تراخيص منصة سلامة الرسمية وتأهيل المنشآت هندسياً.'
        : 'Statutory compliance inspection, civil defense approvals, and preventative maintenance.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      tag: isAr ? 'معتمد رسمياً' : 'Official Certs'
    }
  ];

  // 4 Featured Products Preview
  const previewProducts = [
    {
      name: isAr ? 'لوحات إنذار الحريق الذكية التناظرية' : 'Addressable Fire Alarm Panels',
      category: isAr ? 'أنظمة الإنذار' : 'Alarms',
      specs: isAr ? '2 إلى 8 لوبات • معتمدة UL / LPCB' : '2-8 Loops • UL / LPCB Approved',
      image: './images/product-1.jpg'
    },
    {
      name: isAr ? 'أسطوانات غاز FM-200 و NOVEC 1230' : 'Clean Agent Suppression Cylinders',
      category: isAr ? 'الإطفاء التلقائي' : 'Suppression',
      specs: isAr ? 'معتمدة UL/FM • صديقة للبيئة والبيانات' : 'UL/FM Certified • Zero Ozone Depletion',
      image: './images/product-2.jpg'
    },
    {
      name: isAr ? 'رؤوس رشاشات الحريق الأوتوماتيكية' : 'Automatic Fire Sprinkler Heads',
      category: isAr ? 'الشبكات المائية' : 'Sprinklers',
      specs: isAr ? 'درجات حرارة متعددة • نحاس معتمد UL/FM' : 'Multiple temp ratings • UL/FM Listed',
      image: './images/product-3.jpg'
    },
    {
      name: isAr ? 'صناديق ومحابس ومضخات الحريق' : 'Fire Hose Cabinets & Pump Sets',
      category: isAr ? 'معدات الإطفاء' : 'Fire Equipment',
      specs: isAr ? 'حديد غير قابل للصدأ • مواصفات الدفاع المدني' : 'Stainless steel • Civil Defense Approved',
      image: './images/product-4.jpg'
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. Hero Section - Refined, comfortable fonts and spacing */}
      {vis.hero !== false && (
        <Hero
          lang={lang}
          content={content}
          onOpenConsultation={onOpenConsultation}
          onNavigateServices={() => onNavigate('services')}
          onNavigateProducts={() => onNavigate('products')}
        />
      )}

      {/* 2. Brief Company Highlight (Executive Gold-Royal Frame) */}
      {vis.about !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-white dark:bg-[#131c31] rounded-3xl p-8 sm:p-12 shadow-[0_18px_45px_-15px_rgba(22,45,108,0.12)] dark:shadow-2xl border border-slate-200/90 dark:border-slate-800 gold-border-glow transition-colors">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#162d6c] via-[#c59a45] to-[#1d4ed8]"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <TasamiLogo lang={lang} className="h-20 sm:h-24 md:h-28" />
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#c59a45]/15 to-[#dfb76c]/10 dark:bg-[#c59a45]/20 text-[#9a752a] dark:text-[#dfb76c] text-xs font-extrabold border border-[#c59a45]/35 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-[#c59a45]" />
                    <span>{isAr ? 'تسامي الأعمال لأنظمة السلامة' : 'Tasami for Safety Systems'}</span>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
                  {isAr
                    ? 'شريككم الهندسي المعتمد لحماية الأرواح والمنشآت'
                    : 'Your Certified Engineering Partner in Safety & Life Protection'}
                </h2>
                <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-loose max-w-3xl">
                  {isAr
                    ? 'نتميز بتوفير حلول هندسية متكاملة تشمل التوريد والتركيب والصيانة لكافة أنظمة مكافحة الحريق والإنذار المبكر، وفق اشتراطات الدفاع المدني وكود البناء السعودي SBC، لضمان بيئة عمل آمنة ومستدامة.'
                    : 'We deliver comprehensive turnkey fire protection and alarm engineering solutions, ensuring full statutory compliance with Civil Defense and Saudi Building Code (SBC).'}
                </p>
                <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0b1120] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {isAr ? 'ترخيص معتمد في منصة سلامة' : 'Civil Defense Accredited'}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0b1120] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <Award className="w-4 h-4 text-[#c59a45]" />
                    {isAr ? 'مطابق لكود البناء السعودي SBC' : 'Saudi Building Code SBC'}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0b1120] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#1d4ed8] dark:text-[#60a5fa]" />
                    {isAr ? 'اعتمادات سابر والمواصفات السعودية' : 'Saber & SASO Approved'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-3">
                <button
                  onClick={() => onNavigate('about')}
                  className="btn-flashy-royal w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-white text-xs sm:text-sm font-extrabold"
                >
                  <span>{isAr ? 'تعرف على الشركة وفريق القيادة' : 'About Us & Leadership'}</span>
                  <ChevronIcon className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isAr ? 'رسالة الرئيس التنفيذي، الرؤية، والهيكل' : 'CEO message, vision & organization'}
                </span>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. Services Highlights Section (Links to Dedicated Services Page) */}
      {vis.services !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#c59a45] dark:text-[#dfb76c] uppercase tracking-wider">
                {isAr ? 'حلول وأنظمة متكاملة' : 'Integrated Systems'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] dark:text-white">
                {isAr ? 'خدماتنا الهندسية المعتمدة' : 'Our Engineering Services'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                {isAr
                  ? 'استعراض سريع لأبرز مجالات عملنا، ويمكنك الانتقال لصفحة الخدمات للاطلاع على كافة التفريعات والمواصفات.'
                  : 'A quick overview of our primary domains. Explore the full services page for complete sub-branches.'}
              </p>
            </div>

            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#1d4ed8] hover:bg-[#1e40af] px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto"
            >
              <span>{isAr ? 'عرض كافة الخدمات والتفريعات' : 'View All Services & Branches'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Flashy Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewServices.map((srv) => (
              <div
                key={srv.id}
                onClick={() => onNavigate('services')}
                className="card-flashy group relative overflow-hidden bg-white dark:bg-[#131c31] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 hover:border-[#c59a45]/75 cursor-pointer flex flex-col justify-between shadow-sm"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1d4ed8] to-[#c59a45] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-amber-50/70 dark:from-[#0b1120] dark:to-[#162d6c]/40 border border-blue-100 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                      {srv.icon}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1d4ed8]/10 dark:bg-[#1d4ed8]/25 text-[#1d4ed8] dark:text-[#60a5fa] border border-[#1d4ed8]/20">
                      {srv.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-[#1d4ed8] dark:group-hover:text-[#dfb76c] transition mb-1.5">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
                    {srv.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#9a752a] dark:text-[#dfb76c]">
                  <span>{isAr ? 'تفاصيل الخدمة' : 'Service Details'}</span>
                  <ChevronIcon className="w-3.5 h-3.5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Products Preview Section (Links to Dedicated Products Page) */}
      {vis.products !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#c59a45] dark:text-[#dfb76c] uppercase tracking-wider">
                {isAr ? 'توريدات ومعدات أصلية' : 'Certified Supplies'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] dark:text-white">
                {isAr ? 'كتالوج منتجات السلامة ومكافحة الحريق' : 'Fire Safety Products Catalog'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                {isAr
                  ? 'منتجات معتمدة من كبرى المصانع العالمية مع شهادات الاختبار والامتثال لسابر وكود البناء.'
                  : 'Approved products and systems with international certifications (UL, FM, Saber).'}
              </p>
            </div>

            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#1d4ed8] hover:bg-[#1e40af] px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto"
            >
              <span>{isAr ? 'تصفح كتالوج المنتجات بالكامل' : 'Explore Full Products Catalog'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Flashy Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewProducts.map((p, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('products')}
                className="card-flashy group bg-white dark:bg-[#131c31] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 hover:border-[#c59a45]/75 cursor-pointer flex flex-col shadow-sm"
              >
                <div className="h-44 bg-slate-100 dark:bg-[#0b1120] overflow-hidden relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1599818497672-132d73f1d24c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute top-3 right-3 rtl:right-3 ltr:left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#162d6c]/90 text-white backdrop-blur-sm border border-[#c59a45]/30">
                    {p.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a] dark:text-white group-hover:text-[#1d4ed8] dark:group-hover:text-[#dfb76c] transition mb-1.5 line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {p.specs}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#9a752a] dark:text-[#dfb76c]">
                    <span>{isAr ? 'عرض المواصفات والطلب' : 'View & Inquire'}</span>
                    <ChevronIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Trust & Accreditations Banner (Cinematic Midnight Royal Spotlight) */}
      {vis.licenses !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#070b14] via-[#102357] to-[#0b1120] border border-[#c59a45]/45 text-white p-8 sm:p-14 text-center space-y-6 shadow-[0_25px_65px_-15px_rgba(11,17,32,0.7)]">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#c59a45]/20 blur-3xl pointer-events-none animate-glow-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#1d4ed8]/30 blur-3xl pointer-events-none animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#c59a45]/15 border border-[#c59a45]/40 text-xs font-extrabold text-[#dfb76c] tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                {isAr ? 'الامتثال والاعتماد الرسمي' : 'Official Accreditations'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black max-w-2xl mx-auto leading-snug">
                {isAr
                  ? 'مرخصون من الدفاع المدني ومعتمدون وفق كود البناء السعودي (SBC)'
                  : 'Civil Defense Licensed & Saudi Building Code (SBC) Certified'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-[#dfb76c]/60 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className="text-sm font-extrabold text-white">{isAr ? 'منصة سلامة' : 'Salamah'}</div>
                  <div className="text-[11px] text-[#dfb76c] font-semibold mt-0.5">{isAr ? 'ترخيص معتمد' : 'Civil Defense'}</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-[#dfb76c]/60 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className="text-sm font-extrabold text-white">SBC</div>
                  <div className="text-[11px] text-[#dfb76c] font-semibold mt-0.5">{isAr ? 'كود البناء السعودي' : 'Saudi Code'}</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-[#dfb76c]/60 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className="text-sm font-extrabold text-white">SABER</div>
                  <div className="text-[11px] text-[#dfb76c] font-semibold mt-0.5">{isAr ? 'مطابقة ومواصفات' : 'Certified'}</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-[#dfb76c]/60 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className="text-sm font-extrabold text-white">UL / FM</div>
                  <div className="text-[11px] text-[#dfb76c] font-semibold mt-0.5">{isAr ? 'معايير عالمية' : 'Listed'}</div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={onOpenConsultation}
                  className="btn-flashy-gold px-7 py-3.5 rounded-xl text-[#0b1120] font-black text-xs sm:text-sm"
                >
                  {isAr ? 'طلب معاينة هندسية فورية' : 'Request Engineering Site Survey'}
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="btn-flashy-royal px-7 py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm border border-white/15"
                >
                  {isAr ? 'معلومات التواصل والعناوين' : 'Contact & Locations'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
