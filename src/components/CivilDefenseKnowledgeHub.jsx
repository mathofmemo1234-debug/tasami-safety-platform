import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Building2,
  HelpCircle,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function CivilDefenseKnowledgeHub({
  lang = 'ar',
  content,
  onOpenConsultation,
  initialTab = null
}) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState(initialTab || 'contracts'); // 'contracts' | 'comparison' | 'sbc' | 'faq'
  const [openFaqId, setOpenFaqId] = useState('faq-1');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // FAQ items with rich semantic direct answers optimized for AEO/GEO
  const faqs = [
    {
      id: 'faq-1',
      q: isAr
        ? 'ما هي اشتراطات الدفاع المدني الإلزامية لإصدار وتجديد رخصة سلامة وبلدي؟'
        : 'What are the mandatory Civil Defense requirements for Salama & Balady licenses?',
      a: isAr
        ? 'تشترط لوائح الدفاع المدني السعودي وجود عقد صيانة دوري ساري المفعول موثق في منصة «سلامة» مع شركة معتمدة ومصنفة (مثل شركة تسامي الأعمال)، بالإضافة إلى تركيب أنظمة إنذار وإطفاء مطابقة لنشاط المنشأة ومساحتها وفق كود البناء السعودي SBC 801 (طفايات حريق يدوية، كواشف دخان وحرارة، لوحات إنذار، مخارج طوارئ مضاءة، وصناديق أو رشاشات حريق للمساحات الكبيرة)، ورفع تقرير فني إلكتروني يثبت كفاءة الأجهزة للربط الفوري مع منصة بلدي.'
        : 'Saudi Civil Defense regulations require a valid periodic maintenance contract registered on the "Salama" portal with an accredited contractor (such as Tasami Business), along with compliant fire alarm and firefighting systems according to SBC 801 (portable extinguishers, smoke/heat detectors, emergency exit lighting, hose reels or sprinklers for larger areas), followed by a certified electronic inspection report submitted to the Balady portal.'
    },
    {
      id: 'faq-2',
      q: isAr
        ? 'كيف يتم إصدار وتوثيق عقد صيانة الدفاع المدني الإلكتروني مع تسامي الأعمال؟'
        : 'How is the electronic Civil Defense maintenance contract issued with Tasami?',
      a: isAr
        ? 'تتم عملية إصدار العقد إلكترونياً خلال 24 ساعة عبر 3 خطوات ميسرة: أولاً، تزويدنا برقم السجل التجاري ورخصة بلدي وموقع المنشأة. ثانياً، إجراء المعاينة الميدانية من قِبل مهندسينا للتأكد من جاهزية أنظمة الحريق أو استكمال النواقص فوراً. ثالثاً، تحرير وتوثيق العقد عبر بوابة سلامة الرسمية واعتماد تقرير السلامة، لتتمكن من تجديد رخصة البلدية والدفاع المدني فورياً.'
        : 'The contract is issued electronically within 24 hours in 3 easy steps: 1) Submitting your Commercial Register and Balady license numbers. 2) Conducting an on-site inspection by licensed Tasami engineers to verify system readiness or supply any missing units. 3) Authorizing the contract on the official Salama portal and approving the safety report for instant municipal license renewal.'
    },
    {
      id: 'faq-3',
      q: isAr
        ? 'ما هو الفرق بين نظام الإطفاء بالغاز النظيف FM-200 ونظام NOVEC 1230؟'
        : 'What is the technical difference between FM-200 and NOVEC 1230 suppression systems?',
      a: isAr
        ? 'كلا النظامين غازات نظيفة تفرغ في أقل من 10 ثوانٍ وتخمد الحريق دون ترك أي مخلفات أو إتلاف الأجهزة الإلكترونية؛ يتميز غاز FM-200 (HFC-227ea) بأنه الأكثر انتشاراً واقتصادية في التكلفة لحماية مراكز البيانات وغرف السيرفرات والأرشيف، بينما يتميز سائل NOVEC 1230 بأنه صديق فائق للبيئة بفترة بقاء جوي لا تتعدى 5 أيام وسهولة في النقل وإعادة التعبئة، وكلاهما مطابق لمعايير NFPA 2001 ومعتمد لدى الدفاع المدني.'
        : 'Both are clean gaseous agents discharging in under 10 seconds without residue or electronic damage. FM-200 (HFC-227ea) is the most widely deployed, cost-effective solution for data centers, server rooms, and archives. NOVEC 1230 offers superior environmental friendliness with a 5-day atmospheric lifetime and easier transport/recharging. Both strictly comply with NFPA 2001 and Saudi Civil Defense approvals.'
    },
    {
      id: 'faq-4',
      q: isAr
        ? 'متى يلزم تركيب نظام إطفاء تلقائي كيميائي رطب في مطابخ المطاعم والفنادق؟'
        : 'When is a wet chemical automatic suppression system mandatory for commercial kitchens?',
      a: isAr
        ? 'يلزم نظام الإطفاء التلقائي للمطابخ التجارية (Kitchen Hood Wet Chemical System) في كافة المطاعم والفنادق والمطابخ المركزية التي تحوي أجهزة قِلي وشواء تطلق أبخرة شحمية ودهنية ساخنة وفق كود البناء السعودي ومعايير NFPA 96 و NFPA 17A. يقوم النظام باستشعار الحرارة عبر وصلات حرارية (Fusible Links) ورش المادة الكيميائية الرطبة لعزل الأكسجين وتبريد الزيوت، مع إيقاف مصادر الغاز والكهرباء آلياً.'
        : 'Commercial kitchen automatic wet chemical systems are legally mandatory for all restaurants, hotels, and central catering facilities operating cooking equipment that produces grease vapors and hot oils, per the Saudi Building Code and NFPA 96 / NFPA 17A. The system detects fires via fusible links, discharges wet chemical agents to smother and cool oils, and automatically cuts off gas and electrical supply.'
    },
    {
      id: 'faq-5',
      q: isAr
        ? 'ما هي فئات وأصناف معدات السلامة التي تستوردها وتوردها شركة تسامي الأعمال؟'
        : 'What safety and fire equipment categories does Tasami import and supply?',
      a: isAr
        ? 'توفر تسامي الأعمال استيراداً وتوريداً شاملاً بأسعار تنافسية للمشاريع والمقاولين يشمل: أنابيب ومواسير الصلب ASTM A53، وصلات الجروف الميكانيكية (LEDE, Shurjoint)، محابس الساق الصاعد والفراشة المعتمدة UL/FM، رشاشات الحريق المائية، محطات مضخات الحريق ديزل وكهرباء، صناديق وخراطيم الحريق، أجهزة ولوحات الإنذار المعنونة، مهمات الوقاية الشخصية (PPE)، وأبواب الطوارئ المقاومة للحريق.'
        : 'Tasami provides end-to-end import and wholesale supply for contractors: ASTM A53 steel pipes, grooved mechanical fittings (LEDE, Shurjoint), UL/FM OS&Y and butterfly valves, certified sprinklers, NFPA 20 fire pump skids, hose cabinets, addressable fire alarm panels, personal protective equipment (PPE), and fire-rated doors.'
    },
    {
      id: 'faq-6',
      q: isAr
        ? 'هل منتجات وتجهيزات تسامي الأعمال معتمدة ومسجلة في منصة «سابر» SASO؟'
        : 'Are Tasami products certified and registered on the SABER SASO platform?',
      a: isAr
        ? 'نعم، جميع المواد والأنظمة التي توردها وتركبها شركة تسامي الأعمال معتمدة ومطابقة لكود البناء السعودي SBC 801 ومسجلة بشهادات مطابقة رسمية في منصة سابر (SABER) التابعة لهيئة المواصفات والمقاييس والجودة (SASO)، بالإضافة إلى شهادات الاختبارات العالمية UL Listed و FM Approved و LPCB.'
        : 'Yes, all equipment and systems supplied and installed by Tasami are fully compliant with Saudi Building Code SBC 801, registered on the SASO SABER platform with official conformity certificates, and backed by global testing marks such as UL Listed, FM Approved, and LPCB.'
    }
  ];

  return (
    <section
      id="civil-defense-knowledge-hub"
      className="rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 space-y-8 scroll-mt-28"
    >
      {/* 1. Header with Authority Label */}
      <div className="flex flex-col items-center text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-[#0b1120] border border-[#C5A059]/40 text-[#002366] dark:text-[#D4AF37] text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>{isAr ? 'المرجع الفني المعتمد لأنظمة السلامة' : 'Authoritative Civil Defense Reference'}</span>
        </div>

        <h2 className="text-lg sm:text-xl lg:text-[1.375rem] font-bold text-[#002366] dark:text-white leading-[1.4] tracking-[-0.01em]">
          {isAr
            ? 'دليل اشتراطات الدفاع المدني وعقود السلامة'
            : 'Civil Defense Guidelines & Maintenance Contracts'}
        </h2>

        {/* Direct Technical Answer Box */}
        <div className="w-full text-start bg-white dark:bg-[#0b1120] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 border-r-2 border-r-[#C5A059]">
          <div className="flex items-center gap-2 mb-1.5 text-[#002366] dark:text-[#D4AF37] font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{isAr ? 'ملخص الاعتماد الفني:' : 'Technical Compliance Summary:'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-[1.8]">
            {isAr
              ? 'شركة تسامي الأعمال مرخصة ومصنفة في منصة «سلامة» لإصدار عقود الصيانة الدورية للمنشآت وفق كود البناء السعودي SBC 801. نؤمّن التوريد المباشر لكافة أنظمة الإطفاء والإنذار المعتمدة بشهادات SABER و UL و FM.'
              : 'Tasami Business is officially licensed on the Civil Defense "Salama" portal to issue periodic maintenance contracts under SBC 801, with direct supply of SABER, UL, and FM certified fire protection equipment.'}
          </p>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        {[
          { id: 'contracts', label: isAr ? 'عقود صيانة سلامة والبلدية' : 'Civil Defense Contracts', icon: FileCheck2 },
          { id: 'comparison', label: isAr ? 'مقارنة أنظمة الإطفاء' : 'Suppression Matrix', icon: Flame },
          { id: 'sbc', label: isAr ? 'كود البناء SBC وسابر' : 'SBC & SABER', icon: Building2 },
          { id: 'faq', label: isAr ? 'الأسئلة الشائعة' : 'FAQ Hub', icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#002366] text-white'
                  : 'bg-white dark:bg-[#0b1120] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-[#002366]/40 hover:text-[#002366] dark:hover:text-[#D4AF37]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#C5A059]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: Civil Defense Maintenance Contracts & Balady */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200/80 dark:border-slate-800 space-y-2 text-start">
              <div className="w-8 h-8 rounded-lg border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-[#002366] dark:text-white">
                {isAr ? 'المعاينة الهندسية وتحديد النواقص' : 'Initial Engineering Survey'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr
                  ? 'زيارة مهندس سلامة معتمد لمطابقة أجهزة الإنذار والإطفاء مع اشتراطات كود البناء SBC 801.'
                  : 'A licensed safety engineer audits fire alarm and suppression units against SBC 801.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200/80 dark:border-slate-800 space-y-2 text-start">
              <div className="w-8 h-8 rounded-lg border border-[#002366]/30 text-[#002366] dark:text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-[#002366] dark:text-white">
                {isAr ? 'الفحص والتجهيز الفوري للنواقص' : 'System Testing & Unit Provision'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr
                  ? 'اختبار لوحات الإنذار والمضخات وتوفير الطفايات وأجهزة الإنذار الناقصة مباشرة من مستودعاتنا.'
                  : 'Operational testing of alarm panels and pumps with immediate supply of missing equipment.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200/80 dark:border-slate-800 space-y-2 text-start">
              <div className="w-8 h-8 rounded-lg border border-[#C5A059]/40 text-[#002366] dark:text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-[#002366] dark:text-white">
                {isAr ? 'توثيق العقد عبر منصة سلامة' : 'Salama Portal E-Certification'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr
                  ? 'إصدار العقد الرسمي ورفع التقرير الفني في منصة «سلامة» للربط الفوري مع رخصة «بلدي».'
                  : 'Issuance of the statutory contract and technical report on Salama, syncing instantly with Balady.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200/80 dark:border-slate-800">
            <div className="space-y-1 text-start">
              <h4 className="text-sm font-bold text-[#002366] dark:text-white">
                {isAr ? 'هل تحتاج إلى عقد صيانة معتمد لتجديد رخصة بلدي والدفاع المدني؟' : 'Need an official maintenance contract for license renewal?'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'فريقنا الهندسي جاهز لإنجاز العقد والتقرير الفني في نفس اليوم.' : 'Our engineers can issue the contract and report within the same day.'}
              </p>
            </div>
            <button
              onClick={() => onOpenConsultation(isAr ? 'عقد صيانة دفاع مدني معتمد' : 'Civil Defense Maintenance Contract')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#b58f47] text-white text-xs font-semibold transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{isAr ? 'طلب عقد صيانة فوري' : 'Request Instant Contract'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Clean Agent & Suppression Systems Comparison Matrix */}
      {activeTab === 'comparison' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead className="bg-[#002366] text-white">
              <tr>
                <th className="p-3.5 font-semibold">{isAr ? 'نظام الإطفاء' : 'System'}</th>
                <th className="p-3.5 font-semibold">{isAr ? 'مادة الإطفاء' : 'Extinguishing Agent'}</th>
                <th className="p-3.5 font-semibold">{isAr ? 'زمن التفريغ' : 'Discharge Time'}</th>
                <th className="p-3.5 font-semibold">{isAr ? 'التطبيقات المثالية' : 'Ideal Applications'}</th>
                <th className="p-3.5 font-semibold">{isAr ? 'سلامة الأجهزة والأشخاص' : 'Safety & Residue'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#131c31] text-slate-700 dark:text-slate-200">
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-[#002366] dark:text-[#D4AF37]">غاز FM-200</td>
                <td className="p-3.5">HFC-227ea (غاز نظيف غير موصل)</td>
                <td className="p-3.5">أقل من 10 ثوانٍ</td>
                <td className="p-3.5">غرف السيرفرات، مراكز البيانات، الأرشيف</td>
                <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">آمن تماماً للبشر، بدون أي مخلفات</td>
              </tr>
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-[#C5A059] dark:text-[#D4AF37]">غاز NOVEC 1230</td>
                <td className="p-3.5">FK-5-1-12 (سائل مفلور يتبخر فورياً)</td>
                <td className="p-3.5">أقل من 10 ثوانٍ</td>
                <td className="p-3.5">المختبرات، غرف الاتصالات، مراكز التحكم</td>
                <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">صديق فائق للبيئة (بقاء جوي 5 أيام)، آمن</td>
              </tr>
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-[#002366] dark:text-[#D4AF37]">غاز ثاني أكسيد الكربون CO₂</td>
                <td className="p-3.5">CO₂ نقي مضغوط (غمر كلي أو موضعي)</td>
                <td className="p-3.5">تأخير 30-60 ثانية للإخلاء</td>
                <td className="p-3.5">غرف المحولات، المولدات، مستودعات الوقود</td>
                <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">غير مأهول للبشر، يتطلب صفارات إخلاء مسبقة</td>
              </tr>
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-[#C5A059] dark:text-[#D4AF37]">نظام الأيروسول (Aerosol)</td>
                <td className="p-3.5">جسيمات كيميائية صلبة دقيقة</td>
                <td className="p-3.5">فوري عند استشعار الحرارة</td>
                <td className="p-3.5">اللوحات الكهربائية، حاويات الطاقة</td>
                <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">وحدات مدمجة بدون تمديد أنابيب ضخمة</td>
              </tr>
              <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-[#002366] dark:text-[#D4AF37]">إطفاء المطابخ التجارية</td>
                <td className="p-3.5">مادة كيميائية رطبة (Wet Chemical)</td>
                <td className="p-3.5">فوري عبر وصلات Fusible Links</td>
                <td className="p-3.5">هودات ومداخن مطابخ المطاعم والفنادق</td>
                <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">إخماد وتصبن للزيوت مع قفل آلي للغاز</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Saudi Building Code SBC 801 & SABER */}
      {activeTab === 'sbc' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200/80 dark:border-slate-800 space-y-4 text-start">
            <h4 className="text-sm sm:text-base font-bold text-[#002366] dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
              <span>{isAr ? 'الامتثال التام لكود البناء السعودي SBC 801 (الحماية من الحرائق)' : 'Full Compliance with SBC 801 Fire Protection Code'}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'تطبق شركة تسامي الأعمال كافة الحسابات الهيدروليكية والمواصفات الفنية الصادرة عن كود البناء السعودي SBC 801 لتصميم شبكات الرشاشات ومضخات NFPA 20 ومخارج الطوارئ بما يضمن قبول المخططات لدى الدفاع المدني.'
                : 'Tasami executes all hydraulic calculations and designs per Saudi Building Code SBC 801 covering sprinkler spacing, NFPA 20 pump flow rates, and egress paths for seamless Civil Defense approval.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 text-xs">
                <span className="font-bold text-[#002366] dark:text-[#D4AF37] block mb-1">شهادات منصة سابر (SABER):</span>
                <span className="text-slate-600 dark:text-slate-300">تسجيل المواد واستصدار شهادات المطابقة المعتمدة من هيئة المواصفات SASO.</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 text-xs">
                <span className="font-bold text-[#002366] dark:text-[#D4AF37] block mb-1">الاعتمادات الدولية (UL / FM / LPCB):</span>
                <span className="text-slate-600 dark:text-slate-300">المحابس والرشاشات والمضخات ومواسير الحريق مختومة بعلامات الجودة العالمية.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Authoritative FAQ Hub */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-start p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#002366] dark:text-white hover:text-[#1D4ED8] dark:hover:text-[#D4AF37] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0b1120] text-start animate-dropdown-flash">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
