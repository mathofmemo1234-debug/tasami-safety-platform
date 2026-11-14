import React, { useState, useEffect } from 'react';
import {
  Flame,
  BellRing,
  Wind,
  Droplets,
  ShieldCheck,
  Wrench,
  Compass,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calculator,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import SafetyCalculator from '../components/SafetyCalculator';
import TasamiLogo from '../components/TasamiLogo';

export default function ServicesPage({
  lang,
  content,
  onNavigate,
  onOpenConsultation,
  targetSection,
  activeBranchFilter,
  openCalculator
}) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const vis = content[lang]?.visibility || {};

  const [activeBranch, setActiveBranch] = useState(activeBranchFilter || 'all');
  const [showCalculator, setShowCalculator] = useState(Boolean(openCalculator));

  // Sync active branch when passed from dropdown
  useEffect(() => {
    if (activeBranchFilter) {
      setActiveBranch(activeBranchFilter);
    }
  }, [activeBranchFilter]);

  // Sync calculator state when triggered from dropdown
  useEffect(() => {
    if (openCalculator) {
      setShowCalculator(true);
    }
  }, [openCalculator]);

  // Smoothly scroll to target section when requested
  useEffect(() => {
    if (targetSection) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetSection);
        if (el) {
          const headerOffset = 110;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [targetSection, showCalculator]);

  // Sub-branches definition
  const branches = [
    { id: 'all', name: isAr ? 'جميع الخدمات الهندسية' : 'All Engineering Services' },
    { id: 'suppression', name: isAr ? 'أنظمة الإطفاء التلقائي' : 'Automatic Clean Suppression' },
    { id: 'alarm-smoke', name: isAr ? 'الإنذار وسحب الدخان' : 'Alarms & Smoke Evacuation' },
    { id: 'sprinklers-pumps', name: isAr ? 'الرشاشات والمضخات' : 'Sprinklers & Fire Pumps' },
    { id: 'safety-gear', name: isAr ? 'طفايات الحريق ومعدات الوقاية' : 'Extinguishers & PPE' },
    { id: 'maintenance', name: isAr ? 'الصيانة وتراخيص سلامة' : 'Maintenance & Civil Defense' },
    { id: 'engineering', name: isAr ? 'المخططات الهندسية SBC' : 'Engineering Design & SBC' },
  ];

  // Comprehensive Services Data with sub-branches
  const servicesList = [
    // 1. Suppression
    {
      id: 'fm200',
      branch: 'suppression',
      title: isAr ? 'نظام الإطفاء بغاز FM-200 النظيف' : 'FM-200 Clean Agent Fire Suppression',
      badge: isAr ? 'إطفاء غازي فوري' : 'Clean Agent Gas',
      desc: isAr
        ? 'نظام إخماد فوري يعمل خلال 10 ثوانٍ دون ترك أي مخلفات أو إلحاق الضرر بالأجهزة الإلكترونية الحساسة أو الوثائق، وهو آمن على الإنسان ومطابق لمعايير NFPA 2001.'
        : 'Rapid extinguishing agent discharging within 10 seconds without residue or conductive damage to electronics, fully compliant with NFPA 2001.',
      applications: isAr ? ['مراكز البيانات وغرف السيرفرات', 'غرف التحكم والاتصالات', 'المتاحف والمكتبات والأرشيفات'] : ['Data centers & server rooms', 'Control rooms & telecom', 'Museums & historical archives'],
      standards: 'NFPA 2001 • UL Listed • FM Approved',
      color: 'amber'
    },
    {
      id: 'novec',
      branch: 'suppression',
      title: isAr ? 'نظام الإطفاء بسائل NOVEC 1230' : 'NOVEC 1230 Fire Protection Fluid',
      badge: isAr ? 'صديق للبيئة 100%' : 'Eco-Friendly Agent',
      desc: isAr
        ? 'الجيل الأحدث من أنظمة الإطفاء النظيفة بمركبات فلوروكيتون؛ صديق للبيئة مع صفر تأثير على طبقة الأوزون وعمر جوي قصير جداً، مثالي للمباني الخضراء والمشاريع الكبرى.'
        : 'Next-generation sustainable clean agent fluid with zero ozone depletion potential and rapid atmospheric dissipation.',
      applications: isAr ? ['البنوك وغرف الخوادم المالية', 'المستشفيات والمختبرات الحيوية', 'منشآت النفط والغاز'] : ['Financial server vaults', 'Hospitals & bioclinical labs', 'Oil & gas switchgear rooms'],
      standards: 'UL Listed • FM Approved • LEED Compliant',
      color: 'blue'
    },
    {
      id: 'aerosol',
      branch: 'suppression',
      title: isAr ? 'أنظمة الإطفاء التلقائي بالأيروسول (Aerosol)' : 'Condensed Aerosol Fire Suppression',
      badge: isAr ? 'بدون تمديدات أنابيب' : 'No Piping Needed',
      desc: isAr
        ? 'مولدات إطفاء صلبة مدمجة لا تتطلب أسطوانات ضغط أو شبكات أنابيب، مناسبة للأماكن الضيقة والألواح الكهربائية وتوربينات الرياح وغرف المولدات.'
        : 'Compact solid-propellant generators requiring no pressure cylinders or hydraulic distribution piping, ideal for compact compartments and electrical panels.',
      applications: isAr ? ['لوحات الكهرباء وقواطع التوزيع', 'غرف المحولات والمولدات', 'حجرات المحركات والمركبات'] : ['Electrical distribution boards', 'Generator & transformer rooms', 'Engine & heavy equipment bays'],
      standards: 'NFPA 2010 • ISO 15779',
      color: 'emerald'
    },
    {
      id: 'kitchen',
      branch: 'suppression',
      title: isAr ? 'نظام إطفاء المطابخ التجارية (هود المطاعم)' : 'Commercial Kitchen Wet Chemical Hood Systems',
      badge: isAr ? 'حماية الزيوت والشحوم' : 'Kitchen Fire Protection',
      desc: isAr
        ? 'نظام كيميائي رطب متخصص (Wet Chemical) لإخماد حرائق زيوت الطهي والشحوم من الفئة K، مع صمام قطع الغاز الفوري وقفل شفاطات المطبخ تلقائياً.'
        : 'Wet chemical agent designed specifically for Class K cooking oil grease fires, coupled with automatic fuel gas shutoff and ventilation damping.',
      applications: isAr ? ['مطابخ الفنادق والمطاعم الكبرى', 'صالات الطعام بالمجمعات التجارية', 'المطابخ المركزية والمستشفيات'] : ['Commercial & hotel kitchens', 'Food courts & catering hubs', 'Central hospital kitchens'],
      standards: 'NFPA 17A • NFPA 96 • UL 300 Listed',
      color: 'rose'
    },
    {
      id: 'co2',
      branch: 'suppression',
      title: isAr ? 'نظام الإطفاء بغاز ثاني أكسيد الكربون CO₂' : 'Carbon Dioxide (CO₂) Total Flooding & Local Systems',
      badge: isAr ? 'إخماد عالي الكفاءة' : 'Industrial Extinguishing',
      desc: isAr
        ? 'نظام إخماد صناعي فائق القوة للأماكن الصناعية غير المأهولة بالبشر مثل مستودعات السوائل القابلة للاشتعال وغرف التوربينات والمحولات الكهربائية الكبرى.'
        : 'Heavy-duty industrial extinguishing system delivering rapid inerting for unoccupied hazard enclosures and flammable storage.',
      applications: isAr ? ['مستودعات المواد الكيميائية والدهانات', 'غرف التوربينات والمحركات الكبرى', 'محطات التحويل الكهربائي'] : ['Flammable liquid & chemical vaults', 'Turbines & heavy dynamos', 'Industrial electrical enclosures'],
      standards: 'NFPA 12 • UL Listed',
      color: 'purple'
    },

    // 2. Alarm & Smoke
    {
      id: 'fire-alarm',
      branch: 'alarm-smoke',
      title: isAr ? 'أنظمة الإنذار المبكر وكواشف الحريق الذكية' : 'Intelligent Addressable Fire Detection Systems',
      badge: isAr ? 'كشف ذكي وتناظري' : 'Addressable Alarms',
      desc: isAr
        ? 'توريد وتركيب لوحات إنذار الحريق الذكية التناظرية والتقليدية، مع كواشف دخان بصرية وحرارية وكواشف اللهب وشعاع الليزر للمستودعات الكبيرة.'
        : 'Design and commissioning of addressable and conventional alarm systems, multi-sensor optical heat detectors, and beam sensors.',
      applications: isAr ? ['الأبراج الإدارية والسكنية', 'المستودعات والساحات اللوجستية', 'المراكز التجارية والتعليمية'] : ['Commercial & residential towers', 'Warehouses & logistics parks', 'Retail malls & education campuses'],
      standards: 'NFPA 72 • Civil Defense • UL / EN 54',
      color: 'blue'
    },
    {
      id: 'smoke-control',
      branch: 'alarm-smoke',
      title: isAr ? 'أنظمة التحكم بالدخان وسحب الأدخنة وضغط السلالم' : 'Engineered Smoke Control & Staircase Pressurization',
      badge: isAr ? 'تأمين مسارات الهروب' : 'Life Safety Airflow',
      desc: isAr
        ? 'تصميم وتركيب مراوح طرد الدخان المقاومة لدرجات الحرارة العالية (F300/F400)، ومراوح ضغط سلالم الطوارئ لضمان خلو مسارات الهروب من الدخان أثناء الإخلاء.'
        : 'High-temperature smoke extraction fans (F300/F400) and staircase pressurization fans to maintain tenable escape routes during evacuation.',
      applications: isAr ? ['سلالم الهروب في المباني الشاهقة', 'مواقف السيارات المغلقة وتحت الأرض', 'الأتريوم والمجمعات المغلقة'] : ['High-rise escape stairs', 'Underground & enclosed car parks', 'Atriums & shopping enclosures'],
      standards: 'NFPA 92 • SBC 801 • SBC 201',
      color: 'amber'
    },

    // 3. Sprinklers & Pumps
    {
      id: 'sprinklers',
      branch: 'sprinklers-pumps',
      title: isAr ? 'شبكات الرشاشات المائية التلقائية (Sprinkler Systems)' : 'Automatic Fire Sprinkler Networks (Wet, Dry, Pre-Action)',
      badge: isAr ? 'شبكات هيدروليكية' : 'Hydraulic Networks',
      desc: isAr
        ? 'تمديد وتركيب شبكات الرشاشات المائية بكافة أنواعها (الرطبة، الجافة، المسبقة، والغمر الكلي) باستخدام أنابيب حديد أسود وجلفنة معتمدة ومحابس سيطرة ذكية.'
        : 'Complete installation of wet pipe, dry pipe, pre-action, and deluge sprinkler piping, complete with zone control assemblies and flow sensors.',
      applications: isAr ? ['المصانع والمستودعات والورش', 'المراكز والمجمعات التجارية', 'المستشفيات والمنشآت السكنية'] : ['Factories & industrial warehouses', 'Shopping malls & hypermarkets', 'Hospitals & high-density buildings'],
      standards: 'NFPA 13 • SBC 801 • UL / FM',
      color: 'cyan'
    },
    {
      id: 'pumps-hydrants',
      branch: 'sprinklers-pumps',
      title: isAr ? 'محطات مضخات الحريق المعتمدة وصناديق الحريق' : 'UL/FM Certified Fire Pump Sets & Fire Hydrants',
      badge: isAr ? 'مضخات ديزل وكهرباء' : 'Pump Sets & Hydrants',
      desc: isAr
        ? 'توريد وتركيب واختبار محطات مضخات الحريق المتكاملة (مضخة كهربائية + مضخة ديزل احتياطية + مضخة تعويض جوكي) وصناديق الحريق ومحابس تخفيض الضغط.'
        : 'Supply, alignment and testing of package pump stations (electric, diesel reserve, and jockey booster pumps) plus landing valves and hose reels.',
      applications: isAr ? ['المجمعات الصناعية والمدن اللوجستية', 'الأبراج السكنية والتجارية', 'المنشآت الحكومية والتعليمية'] : ['Industrial complexes & ports', 'Towers & mixed-use developments', 'Campus facilities'],
      standards: 'NFPA 20 • SBC 801 • UL Listed / FM Approved',
      color: 'emerald'
    },

    // 4. Maintenance & Compliance
    {
      id: 'maintenance-contracts',
      branch: 'maintenance',
      title: isAr ? 'عقود الصيانة الدورية واختبارات التشغيل' : 'Preventative Maintenance Contracts & Testing',
      badge: isAr ? 'عقود سنوية معتمدة' : 'Scheduled Maintenance',
      desc: isAr
        ? 'عقود صيانة دورية (ربع سنوية، نصف سنوية، وسنوية) لكافة أنظمة السلامة مع فرق فنية طارئة على مدار الساعة (24/7) وتقارير هندسية معتمدة لكل زيارة.'
        : 'Scheduled preventative maintenance programs with round-the-clock emergency dispatch teams and formal technical inspection logs.',
      applications: isAr ? ['الشركات والمؤسسات والمدارس', 'المستودعات والمراكز التجارية', 'الفنادق والمجمعات الطبية'] : ['Corporate offices & schools', 'Warehouses & retail chains', 'Hotels & medical centers'],
      standards: 'NFPA 25 • NFPA 72 • متطلبات الدفاع المدني',
      color: 'emerald'
    },
    {
      id: 'salamah-licensing',
      branch: 'maintenance',
      title: isAr ? 'إصدار وتجديد شهادات وتراخيص منصة سلامة' : 'Civil Defense Salamah Portal Licensing & Compliance',
      badge: isAr ? 'اعتماد حكومي فوري' : 'Civil Defense Portal',
      desc: isAr
        ? 'فحص المنشأة هندسياً وتجهيز كافة التقارير والمتطلبات وإصدار شهادة الامتثال الفورية عبر منصة سلامة التابعة للمديرية العامة للدفاع المدني.'
        : 'Comprehensive statutory inspection, compliance audit, and instant issuance of civil defense safety certificates via the official Salamah portal.',
      applications: isAr ? ['تجديد رخص الأنشطة التجارية والبلدية', 'رخص المصانع والورش والمستودعات', 'افتتاح الفروع والمقرات الجديدة'] : ['Commercial & municipal license renewals', 'Industrial factory certificates', 'New branch handovers'],
      standards: 'الدفاع المدني السعودي • منصة سلامة الرسمية',
      color: 'blue'
    },

    // 5. Engineering Design
    {
      id: 'engineering-blueprints',
      branch: 'engineering',
      title: isAr ? 'التصميم الهندسي وإعداد مخططات السلامة (SBC)' : 'Engineering Design & Saudi Building Code (SBC) Blueprints',
      badge: isAr ? 'مخططات كود البناء SBC' : 'SBC Blueprints',
      desc: isAr
        ? 'إعداد وتصميم المخططات الهندسية لمكافحة الحريق والإنذار وفق كود البناء السعودي (SBC 801 / SBC 201)، وإجراء الحسابات الهيدروليكية المتقدمة ببرامج النمذجة.'
        : 'Preparation of approved fire safety shop-drawings and blueprints per SBC 801, complete with certified hydraulic calculations and hydraulic flow models.',
      applications: isAr ? ['المشاريع قيد الإنشاء والتطوير', 'المكاتب الهندسية والمقاولين العامين', 'تعديل وتأهيل المباني القائمة'] : ['New construction & developments', 'Engineering consulting firms', 'Building retrofit projects'],
      standards: 'SBC 801 • SBC 201 • NFPA 13 / 14 / 20 / 72',
      color: 'purple'
    },

    // 6. Portable Fire Extinguishers & PPE
    {
      id: 'fire-extinguishers',
      branch: 'safety-gear',
      title: isAr ? 'طفايات الحريق اليدوية — توريد وفحص وإعادة تعبئة' : 'Portable Fire Extinguishers — Supply, Inspection & Refilling',
      badge: isAr ? 'جاهزية وقت الحاجة' : 'First-Response Gear',
      desc: isAr
        ? 'توفير طفايات الحريق بأنواع وسعات تناسب طبيعة المخاطر في المنشآت المختلفة (البودرة الكيميائية، CO2، الرغوة، والماء)، مع توزيعها وتركيبها في مواقع واضحة يسهل الوصول إليها، وتنفيذ الفحص والصيانة وإعادة التعبئة وفق المتطلبات المعتمدة.'
        : 'Supply of portable fire extinguishers in capacities and agents tailored to facility hazards, strategically mounted for immediate access alongside certified inspection, servicing, and refilling.',
      applications: isAr ? ['المكاتب والشركات والمحلات التجارية', 'المستودعات والورش والمصانع', 'المطابخ والفنادق والمباني السكنية'] : ['Offices, retail & commercial stores', 'Warehouses, workshops & plants', 'Kitchens, hotels & residential towers'],
      standards: 'NFPA 10 • سابر SABER • اشتراطات الدفاع المدني',
      color: 'rose'
    },
    {
      id: 'ppe-equipment',
      branch: 'safety-gear',
      title: isAr ? 'معدات السلامة والوقاية الشخصية (PPE)' : 'Personal Protective Equipment (PPE)',
      badge: isAr ? 'حماية العاملين' : 'Workplace PPE',
      desc: isAr
        ? 'توفير معدات الوقاية الشخصية بما يلائم طبيعة الأعمال والمخاطر داخل مواقع العمل، وتشمل خوذات السلامة، النظارات الواقية، القفازات، أحذية السلامة، السترات العاكسة، ووسائل الحماية المعتمدة لدعم بيئة عمل آمنة.'
        : 'Supplying comprehensive workplace PPE tailored to site hazards including safety helmets, protective goggles, industrial gloves, safety footwear, and high-visibility vests to protect personnel.',
      applications: isAr ? ['مواقع الإنشاءات والمشاريع الهندسية', 'المصانع والمنشآت الصناعية', 'المستودعات ومناطق المناولة اللوجستية'] : ['Construction & engineering sites', 'Factories & industrial facilities', 'Warehouses & logistics hubs'],
      standards: 'ANSI / EN ISO • معايير السلامة المهنية OSHA',
      color: 'amber'
    }
  ];

  const filteredServices = activeBranch === 'all'
    ? servicesList
    : servicesList.filter((s) => s.branch === activeBranch);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* 1. Page Header & Breadcrumb */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] transition"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#c59a45] dark:text-[#dfb76c]">{isAr ? 'خدماتنا' : 'Our Services'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <TasamiLogo lang={lang} className="h-16 sm:h-20 md:h-24" />
              <span className="text-xs font-bold text-[#9a752a] dark:text-[#dfb76c] tracking-widest uppercase bg-[#c59a45]/10 dark:bg-[#c59a45]/20 px-3.5 py-1.5 rounded-xl inline-block border border-[#c59a45]/30">
                {isAr ? 'تسامي الأعمال لأنظمة السلامة' : 'Tasami Engineering Solutions'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white tracking-tight">
              {isAr ? 'خدماتنا وتفريعاتها الهندسية المتكاملة' : 'Comprehensive Engineering Services & Sub-Branches'}
            </h1>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isAr
                ? 'نقدم منظومة متكاملة من حلول الوقاية ومكافحة الحرائق، مصممة وفق اشتراطات الدفاع المدني وكود البناء السعودي SBC، مع تفريعات متخصصة لكل قطاع.'
                : 'Turnkey fire protection and early detection solutions tailored to statutory codes and industry standards.'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {vis.calculator !== false && (
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs sm:text-sm font-bold transition shadow-sm"
              >
                <Calculator className="w-4 h-4 text-[#dfb76c]" />
                <span>{showCalculator ? (isAr ? 'إخفاء حاسبة السلامة' : 'Hide Calculator') : (isAr ? 'حاسبة السلامة الفورية' : 'Safety Estimator')}</span>
              </button>
            )}
            <button
              onClick={() => onOpenConsultation(isAr ? 'معاينة هندسية عامة وتوريد' : 'General Site Survey & Supply')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#c59a45] hover:bg-[#dfb76c] text-[#0b1120] text-xs sm:text-sm font-bold transition shadow-sm"
            >
              <span>{isAr ? 'طلب معاينة أو تسعير' : 'Request Site Survey or Quote'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Optional Interactive Safety Calculator Banner / Accordion */}
      {vis.calculator !== false && showCalculator && (
        <div id="calculator-section" className="bg-white dark:bg-[#131c31] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 scroll-mt-28">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#1d4ed8] dark:text-[#60a5fa]" />
              <span>{isAr ? 'حاسبة متطلبات السلامة التقديرية لمشروعك' : 'Interactive Safety Requirements Estimator'}</span>
            </h3>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white"
            >
              {isAr ? 'إغلاق الحاسبة ✕' : 'Close ✕'}
            </button>
          </div>
          <SafetyCalculator lang={lang} content={content} onSaveQuote={() => {}} />
        </div>
      )}

      {/* 2. Sub-branches Categories Selector (Tabs) */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {isAr ? 'اختر التفريع الهندسي المطلوب:' : 'Filter by Sub-Branch:'}
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBranch(b.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeBranch === b.id
                  ? 'bg-[#1d4ed8] text-white shadow-sm scale-105 ring-2 ring-[#c59a45]/60'
                  : 'bg-white dark:bg-[#131c31] text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Detailed Services Cards Grid */}
      <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 scroll-mt-28">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white dark:bg-[#131c31] rounded-2xl p-7 border border-slate-200/90 dark:border-slate-800 hover:border-[#c59a45]/70 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              
              {/* Badge & Standard Tag */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#c59a45]/10 dark:bg-[#c59a45]/20 text-[#9a752a] dark:text-[#dfb76c]">
                  {srv.badge}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {srv.standards.split('•')[0]}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white group-hover:text-[#1d4ed8] dark:group-hover:text-[#dfb76c] transition leading-snug">
                {srv.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {srv.desc}
              </p>

              {/* Key Applications */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 block mb-2">
                  {isAr ? 'أبرز التطبيقات المناسبة:' : 'Key Applications:'}
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {srv.applications.map((app, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1d4ed8] dark:text-[#60a5fa] flex-shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Standard info */}
              <div className="pt-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800">
                {isAr ? 'المعايير المعتمدة: ' : 'Standard Compliance: '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{srv.standards}</span>
              </div>

            </div>

            {/* Action CTA */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onOpenConsultation(srv.title)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#9a752a] dark:text-[#dfb76c] hover:underline"
              >
                <span>{isAr ? 'طلب معاينة أو عرض سعر' : 'Inquire / Request Quote'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title={isAr ? 'خدمة نشطة ومتاحة' : 'Active Service'}></span>
            </div>

          </div>
        ))}
      </div>

      {/* 3.5 Integrated Service Stages & Commercial Advantages Table */}
      {Array.isArray(content[lang]?.coreServices?.serviceTable) && content[lang].coreServices.serviceTable.length > 0 && (
        <section className="rounded-3xl bg-white dark:bg-[#131c31] border border-slate-200/90 dark:border-slate-800 p-7 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-[#c59a45]/10 dark:bg-[#c59a45]/20 text-[#9a752a] dark:text-[#dfb76c]">
                <Sparkles className="w-3.5 h-3.5" />
                {isAr ? 'مراحل التنفيذ والمزايا التنافسية' : 'Execution Lifecycle & Commercial Advantages'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] dark:text-white">
                {isAr ? 'منهجية خدماتنا وعروضنا الخاصة لعملائنا' : 'How We Serve You & Special Client Offers'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md">
              {isAr
                ? 'التزام متكامل يبدأ من المعاينة الأولية للموقع ويمتد لخدمات ما بعد البيع مع أسعار تنافسية وخصومات للعملاء المميزين.'
                : 'An end-to-end commitment from initial site inspection through after-sales support, competitive bulk pricing, and VIP partner discounts.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content[lang].coreServices.serviceTable.map((row, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 border transition-all ${
                  idx === content[lang].coreServices.serviceTable.length - 1
                    ? 'sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-[#c59a45]/10 via-[#dfb76c]/10 to-[#162d6c]/5 dark:from-[#c59a45]/20 dark:via-[#c59a45]/10 dark:to-[#1d4ed8]/10 border-[#c59a45]/40'
                    : 'bg-slate-50/80 dark:bg-[#0b1120] border-slate-200/80 dark:border-slate-800 hover:border-[#1d4ed8]/40 dark:hover:border-[#c59a45]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#162d6c] dark:bg-[#1d4ed8] text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#0f172a] dark:text-white">
                      {row.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {row.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Bottom Support CTA Card */}
      <div className="rounded-3xl bg-[#0b1120] dark:bg-[#131c31] border border-[#1d4ed8]/30 text-white p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-bold">
          {isAr
            ? 'هل تحتاج إلى دراسة هندسية خاصة بمشروعك؟'
            : 'Need a custom engineering study for your project?'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          {isAr
            ? 'فريقنا الهندسي في تسامي الأعمال على أتم الاستعداد لزيارة الموقع، فحص متطلبات كود البناء، وتقديم عرض فني ومالي متكامل ومعتمد.'
            : 'Our licensed engineers are ready to survey your facility, evaluate building codes, and prepare a statutory compliance proposal.'}
        </p>
        <div className="pt-2">
          <button
            onClick={() => onOpenConsultation(isAr ? 'دراسة هندسية متكاملة' : 'Full Engineering Study')}
            className="px-8 py-3.5 rounded-xl bg-[#c59a45] hover:bg-[#dfb76c] text-[#0b1120] font-bold text-xs sm:text-sm transition shadow-sm"
          >
            {isAr ? 'تواصل مع المهندس المختص' : 'Contact an Engineer'}
          </button>
        </div>
      </div>

    </div>
  );
}
