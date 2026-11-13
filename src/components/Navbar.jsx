import React, { useState, useEffect } from 'react';
import TasamiLogo from './TasamiLogo';
import {
  Search,
  Globe,
  Menu,
  X,
  ChevronDown,
  Quote,
  Eye,
  Compass,
  Network,
  FolderKanban,
  Flame,
  Shield,
  ShieldCheck,
  FileCheck,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({
  currentPage = 'home',
  onNavigate,
  lang,
  setLang,
  darkMode = false,
  onToggleDarkMode,
  content,
  onOpenConsultation,
  onOpenAdmin
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = content[lang].nav;

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('products');
      setSearchOpen(false);
    }
  };

  // 1. عن الشركة Sub-items with strict target sections
  const aboutSubItems = [
    {
      label: t.ceo || (lang === 'ar' ? 'كلمة الرئيس التنفيذي' : 'CEO Message'),
      page: 'about',
      sectionId: 'ceo',
      desc: lang === 'ar' ? 'رسالة الإدارة التنفيذية ورؤيتها' : 'Executive leadership message',
      icon: <Quote className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.vision || (lang === 'ar' ? 'الرؤية والرسالة' : 'Vision & Mission'),
      page: 'about',
      sectionId: 'vision',
      desc: lang === 'ar' ? 'طموحنا نحو بيئة خالية من المخاطر' : 'Our vision towards zero-hazard future',
      icon: <Eye className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.orgChart || (lang === 'ar' ? 'الهيكل التنظيمي' : 'Org Structure'),
      page: 'about',
      sectionId: 'org-chart',
      desc: lang === 'ar' ? 'الهيكل الإداري والهندسي المؤسسي' : 'Organizational and technical hierarchy',
      icon: <Network className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.projects || (lang === 'ar' ? 'أبرز مشاريعنا' : 'Featured Projects'),
      page: 'about',
      sectionId: 'projects',
      desc: lang === 'ar' ? 'مشاريعنا المنفذة في كبرى قطاعات المملكة' : 'Flagship projects secured kingdom-wide',
      icon: <FolderKanban className="w-4 h-4 text-[#c59a45]" />
    },
  ];

  // 2. خدماتنا Sub-items with strict filters & sections
  const servicesSubItems = [
    {
      label: t.suppression || (lang === 'ar' ? 'أنظمة الإطفاء التلقائي' : 'Automatic Suppression'),
      page: 'services',
      sectionId: 'services-grid',
      filter: 'suppression',
      desc: lang === 'ar' ? 'FM-200، NOVEC 1230، الأيروسول، والمطابخ' : 'Clean agent, aerosol & kitchen systems',
      icon: <Flame className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.certifiedServices || t.services || (lang === 'ar' ? 'الرشاشات والمضخات' : 'Sprinklers & Pumps'),
      page: 'services',
      sectionId: 'services-grid',
      filter: 'sprinklers-pumps',
      desc: lang === 'ar' ? 'الشبكات المائية ومحطات المضخات' : 'Alarms, sprinklers & pump networks',
      icon: <ShieldCheck className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.licenses || (lang === 'ar' ? 'الصيانة وتراخيص سلامة' : 'Maintenance & Civil Defense'),
      page: 'services',
      sectionId: 'services-grid',
      filter: 'maintenance',
      desc: lang === 'ar' ? 'عقود الصيانة وإصدار تراخيص منصة سلامة' : 'Civil Defense approvals & maintenance',
      icon: <FileCheck className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.calculator || (lang === 'ar' ? 'حاسبة السلامة الهندسية' : 'Safety Estimator'),
      page: 'services',
      sectionId: 'calculator-section',
      openCalculator: true,
      desc: lang === 'ar' ? 'احسب تقدير التكاليف والمتطلبات فورياً' : 'Instant budgetary & statutory estimator',
      icon: <Calculator className="w-4 h-4 text-[#0b1120]" />,
      isSpecial: true
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-royal border-b border-[#c59a45]/30 text-white ${
          isScrolled
            ? 'shadow-xl py-2'
            : 'shadow-md py-2 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo - Prominently enlarged horizontal logo banner on all pages */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#dfb76c]/50 rounded-2xl py-0.5"
              title="تسامي الأعمال لأنظمة السلامة"
            >
              <TasamiLogo isWhite={true} compact={true} lang={lang} className="h-14 sm:h-16 md:h-20" />
            </button>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              
              {/* 1. الرئيسية (Home) */}
              <button
                onClick={() => onNavigate('home')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  currentPage === 'home'
                    ? 'text-[#dfb76c] bg-[#c59a45]/20 border border-[#c59a45]/40 font-bold'
                    : 'text-white/90 hover:text-[#dfb76c] hover:bg-white/10'
                }`}
              >
                {t.home}
              </button>

              {/* 2. عن الشركة (About Company - Dropdown & Direct Navigate) */}
              <div className="relative group">
                <button
                  onClick={() => onNavigate('about')}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                    currentPage === 'about'
                      ? 'text-[#dfb76c] bg-[#c59a45]/20 border border-[#c59a45]/40 font-bold'
                      : 'text-white/90 hover:text-[#dfb76c] hover:bg-white/10'
                  }`}
                >
                  <span>{t.about}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200 group-hover:text-[#dfb76c] group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Dropdown Panel */}
                <div className="absolute top-full right-0 rtl:right-0 ltr:left-0 pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white dark:bg-[#131c31] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#1d4ed8] dark:text-[#60a5fa] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      {lang === 'ar' ? 'أقسام عن الشركة' : 'Company Highlights'}
                    </div>
                    {aboutSubItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate(item.page, item.sectionId)}
                        className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition group/item text-right rtl:text-right ltr:text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#1d4ed8]/10 dark:bg-[#1d4ed8]/25 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-[#c59a45] group-hover/item:text-white transition">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0f172a] dark:text-white group-hover/item:text-[#1d4ed8] dark:group-hover/item:text-[#dfb76c] transition">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. خدماتنا (Dedicated Page & Dropdown) */}
              <div className="relative group">
                <button
                  onClick={() => onNavigate('services')}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                    currentPage === 'services'
                      ? 'text-[#dfb76c] bg-[#c59a45]/20 border border-[#c59a45]/40 font-bold'
                      : 'text-white/90 hover:text-[#dfb76c] hover:bg-white/10'
                  }`}
                >
                  <span>{t.services}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200 group-hover:text-[#dfb76c] group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Dropdown Panel */}
                <div className="absolute top-full right-0 rtl:right-0 ltr:left-0 pt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white dark:bg-[#131c31] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#1d4ed8] dark:text-[#60a5fa] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>{lang === 'ar' ? 'صفحة الخدمات وتفريعاتها' : 'Services & Sub-Branches'}</span>
                      <span className="text-[9px] text-[#c59a45] font-bold">{lang === 'ar' ? 'صفحة مستقلة' : 'Dedicated'}</span>
                    </div>
                    {servicesSubItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate(item.page, item.sectionId, item.filter, item.openCalculator)}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl transition group/item text-right rtl:text-right ltr:text-left ${
                          item.isSpecial
                            ? 'bg-amber-50/70 dark:bg-[#c59a45]/10 hover:bg-amber-100/80 dark:hover:bg-[#c59a45]/20 border border-[#c59a45]/30'
                            : 'hover:bg-blue-50/70 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                          item.isSpecial
                            ? 'bg-[#c59a45] text-white shadow-sm'
                            : 'bg-[#1d4ed8]/10 dark:bg-[#1d4ed8]/25 group-hover/item:bg-[#c59a45] group-hover/item:text-white'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0f172a] dark:text-white group-hover/item:text-[#1d4ed8] dark:group-hover/item:text-[#dfb76c] transition">
                              {item.label}
                            </span>
                            {item.isSpecial && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#c59a45] text-[#0b1120] font-bold">
                                {lang === 'ar' ? 'حاسبة فورية' : 'CALC'}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 px-2 pb-1">
                      <button
                        onClick={() => onNavigate('services')}
                        className="w-full py-2 text-center text-xs font-bold text-white bg-[#1d4ed8] hover:bg-[#1e40af] rounded-xl transition"
                      >
                        {lang === 'ar' ? 'الانتقال لصفحة الخدمات الكاملة ←' : 'Go to Full Services Page →'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. منتجاتنا (Dedicated Page) */}
              <button
                onClick={() => onNavigate('products')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  currentPage === 'products'
                    ? 'text-[#dfb76c] bg-[#c59a45]/20 border border-[#c59a45]/40 font-bold'
                    : 'text-white/90 hover:text-[#dfb76c] hover:bg-white/10'
                }`}
              >
                {t.products}
              </button>

              {/* 5. تواصل معنا */}
              <button
                onClick={() => onNavigate('contact')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  currentPage === 'contact'
                    ? 'text-[#dfb76c] bg-[#c59a45]/20 border border-[#c59a45]/40 font-bold'
                    : 'text-white/90 hover:text-[#dfb76c] hover:bg-white/10'
                }`}
              >
                {t.contact}
              </button>

            </nav>

            {/* Actions (Dark Mode Toggle, Search, Lang, Consultation CTA) */}
            <div className="hidden md:flex items-center gap-2">
              {/* Dark / Light Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                aria-label={darkMode ? (lang === 'ar' ? 'تفعيل الوضع الفاتح' : 'Switch to Light Mode') : (lang === 'ar' ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode')}
                title={darkMode ? (lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}
                className="p-2 text-white/90 hover:text-[#dfb76c] bg-white/10 hover:bg-white/20 border border-white/15 rounded-full transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4 text-[#dfb76c]" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className="p-2 text-white/90 hover:text-[#dfb76c] bg-white/10 hover:bg-white/20 border border-white/15 rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white hover:text-[#dfb76c] bg-white/10 hover:bg-white/20 border border-white/15 rounded-full transition"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#dfb76c]" />
                <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
              </button>

              {/* Admin Portal Trigger (Discreet & Elegant) */}
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white/90 hover:text-[#0b1120] bg-white/10 hover:bg-[#dfb76c] border border-[#c59a45]/35 hover:border-[#dfb76c] transition-all duration-200 shadow-sm"
                title={lang === 'ar' ? 'بوابة مدير الموقع وقاعدة البيانات' : 'Admin & Database Portal'}
              >
                <Shield className="w-3.5 h-3.5 text-[#dfb76c] hover:text-[#0b1120]" />
                <span className="hidden xl:inline text-[11px]">{lang === 'ar' ? 'مدير الموقع' : 'Admin'}</span>
              </button>

              {/* Request Consultation CTA Button */}
              <button
                onClick={onOpenConsultation}
                className="btn-flashy-gold flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-[#0b1120]"
              >
                <span>{t.requestConsultation}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={onToggleDarkMode}
                aria-label="Toggle theme"
                className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-white"
              >
                {darkMode ? <Sun className="w-4 h-4 text-[#dfb76c]" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleLanguage}
                className="p-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-white"
              >
                {lang === 'ar' ? 'EN' : 'ع'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white hover:text-[#dfb76c] focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="border-t border-white/15 bg-white dark:bg-[#131c31] px-4 py-3 shadow-xl">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-[#1d4ed8] dark:text-[#60a5fa]" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث في منتجات السلامة، كود البناء، المواسير، المضخات... (اضغط Enter للانتقال للمنتجات)' : 'Search products, pipes, sprinklers, alarms... (Press Enter)'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#1d4ed8] dark:hover:text-[#dfb76c]"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </form>
          </div>
        )}

        {/* Mobile Dropdown Menu with Full Accordions */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/15 bg-white dark:bg-[#131c31] text-[#0f172a] dark:text-slate-100 shadow-2xl px-4 py-5 space-y-3 max-h-[85vh] overflow-y-auto">
            
            {/* 1. الرئيسية */}
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800 ${
                currentPage === 'home' ? 'text-[#c59a45]' : 'text-[#0f172a] dark:text-slate-100'
              }`}
            >
              {t.home}
            </button>

            {/* 2. عن الشركة (مع أكورديون التفريعات) */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center justify-between py-2">
                <button
                  onClick={() => {
                    onNavigate('about');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-sm font-bold ${currentPage === 'about' ? 'text-[#c59a45]' : 'text-[#0f172a] dark:text-slate-100'}`}
                >
                  {t.about}
                </button>
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#c59a45]"
                  aria-label="Toggle About Submenu"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180 text-[#c59a45]' : ''}`} />
                </button>
              </div>

              {mobileAboutOpen && (
                <div className="pr-4 rtl:pr-4 ltr:pl-4 space-y-1.5 mt-1 bg-slate-50 dark:bg-[#0b1120] p-2.5 rounded-xl">
                  {aboutSubItems.map((sub, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onNavigate(sub.page, sub.sectionId);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] text-right rtl:text-right ltr:text-left"
                    >
                      {sub.icon}
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. خدماتنا (مع أكورديون التفريعات) */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center justify-between py-2">
                <button
                  onClick={() => {
                    onNavigate('services');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-sm font-bold ${currentPage === 'services' ? 'text-[#c59a45]' : 'text-[#0f172a] dark:text-slate-100'}`}
                >
                  {t.services}
                </button>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#c59a45]"
                  aria-label="Toggle Services Submenu"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180 text-[#c59a45]' : ''}`} />
                </button>
              </div>

              {mobileServicesOpen && (
                <div className="pr-4 rtl:pr-4 ltr:pl-4 space-y-1.5 mt-1 bg-slate-50 dark:bg-[#0b1120] p-2.5 rounded-xl">
                  {servicesSubItems.map((sub, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onNavigate(sub.page, sub.sectionId, sub.filter, sub.openCalculator);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] text-right rtl:text-right ltr:text-left"
                    >
                      <div className="flex items-center gap-2">
                        {sub.icon}
                        <span>{sub.label}</span>
                      </div>
                      {sub.isSpecial && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#c59a45] text-[#0b1120] font-bold">
                          {lang === 'ar' ? 'حاسبة' : 'CALC'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. منتجاتنا (صفحة مستقلة) */}
            <button
              onClick={() => {
                onNavigate('products');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800 flex items-center justify-between ${
                currentPage === 'products' ? 'text-[#c59a45]' : 'text-[#0f172a] dark:text-slate-100'
              }`}
            >
              <span>{t.products}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1d4ed8]/10 dark:bg-[#1d4ed8]/30 text-[#1d4ed8] dark:text-[#60a5fa] font-semibold">
                {lang === 'ar' ? 'الكتالوج الكامل' : 'Catalog'}
              </span>
            </button>

            {/* 5. تواصل معنا */}
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800 ${
                currentPage === 'contact' ? 'text-[#c59a45]' : 'text-[#0f172a] dark:text-slate-100'
              }`}
            >
              {t.contact}
            </button>

            {/* 6. مدير الموقع (لوحة التحكم) */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[#9a752a] dark:text-[#dfb76c]"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#c59a45]" />
                <span>{lang === 'ar' ? 'لوحة مدير الموقع (الرمز السري)' : 'Admin Dashboard'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c59a45]/20 text-[#9a752a] dark:text-[#dfb76c] font-bold">
                Admin
              </span>
            </button>

            {/* CTA */}
            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-[#0b1120] bg-[#c59a45] hover:bg-[#dfb76c] shadow"
              >
                <span>{t.requestConsultation}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>
      <div className="h-20 sm:h-24 md:h-28"></div>
    </>
  );
}
