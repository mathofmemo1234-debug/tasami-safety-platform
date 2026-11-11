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
  ShieldCheck,
  FileCheck,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  currentPage = 'home',
  onNavigate,
  lang,
  setLang,
  content,
  onOpenConsultation
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

  // 1. عن الشركة Sub-items
  const aboutSubItems = [
    {
      label: t.ceo || (lang === 'ar' ? 'كلمة الرئيس التنفيذي' : 'CEO Message'),
      target: 'about',
      desc: lang === 'ar' ? 'رسالة الإدارة التنفيذية ورؤيتها' : 'Executive leadership message',
      icon: <Quote className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.vision || (lang === 'ar' ? 'الرؤية والرسالة' : 'Vision & Mission'),
      target: 'about',
      desc: lang === 'ar' ? 'طموحنا نحو بيئة خالية من المخاطر' : 'Our vision towards zero-hazard future',
      icon: <Eye className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.orgChart || (lang === 'ar' ? 'الهيكل التنظيمي' : 'Org Structure'),
      target: 'about',
      desc: lang === 'ar' ? 'الهيكل الإداري والهندسي المؤسسي' : 'Organizational and technical hierarchy',
      icon: <Network className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.projects || (lang === 'ar' ? 'أبرز مشاريعنا' : 'Featured Projects'),
      target: 'about',
      desc: lang === 'ar' ? 'مشاريعنا المنفذة في كبرى قطاعات المملكة' : 'Flagship projects secured kingdom-wide',
      icon: <FolderKanban className="w-4 h-4 text-[#c59a45]" />
    },
  ];

  // 2. خدماتنا Sub-items
  const servicesSubItems = [
    {
      label: t.suppression || (lang === 'ar' ? 'أنظمة الإطفاء التلقائي' : 'Automatic Suppression'),
      target: 'services',
      desc: lang === 'ar' ? 'FM-200، NOVEC 1230، الأيروسول، والمطابخ' : 'Clean agent, aerosol & kitchen systems',
      icon: <Flame className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.certifiedServices || t.services || (lang === 'ar' ? 'الرشاشات والمضخات' : 'Sprinklers & Pumps'),
      target: 'services',
      desc: lang === 'ar' ? 'الشبكات المائية ومحطات المضخات' : 'Alarms, sprinklers & pump networks',
      icon: <ShieldCheck className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.licenses || (lang === 'ar' ? 'الصيانة وتراخيص سلامة' : 'Maintenance & Civil Defense'),
      target: 'services',
      desc: lang === 'ar' ? 'عقود الصيانة وإصدار تراخيص منصة سلامة' : 'Civil Defense approvals & maintenance',
      icon: <FileCheck className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.calculator || (lang === 'ar' ? 'حاسبة السلامة الهندسية' : 'Safety Estimator'),
      target: 'services',
      desc: lang === 'ar' ? 'احسب تقدير التكاليف والمتطلبات فورياً' : 'Instant budgetary & statutory estimator',
      icon: <Calculator className="w-4 h-4 text-[#dfb76c]" />,
      isSpecial: true
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-100'
            : 'bg-white/95 backdrop-blur-sm py-2 sm:py-2.5 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo - Prominently visible horizontal logo banner on all pages */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#c59a45]/40 rounded-xl"
              title="تسامي الأعمال لأنظمة السلامة"
            >
              <TasamiLogo lang={lang} className="h-12 sm:h-14 md:h-16" />
            </button>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              
              {/* 1. الرئيسية (Home) */}
              <button
                onClick={() => onNavigate('home')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  currentPage === 'home'
                    ? 'text-[#c59a45] bg-[#c59a45]/10 font-bold'
                    : 'text-slate-700 hover:text-[#c59a45] hover:bg-slate-50'
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
                      ? 'text-[#c59a45] bg-[#c59a45]/10 font-bold'
                      : 'text-slate-700 hover:text-[#c59a45] hover:bg-slate-50'
                  }`}
                >
                  <span>{t.about}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#c59a45] group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Dropdown Panel */}
                <div className="absolute top-full right-0 rtl:right-0 ltr:left-0 pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                      {lang === 'ar' ? 'أقسام عن الشركة' : 'Company Highlights'}
                    </div>
                    {aboutSubItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate(item.target)}
                        className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-amber-50/60 transition group/item text-right rtl:text-right ltr:text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#c59a45]/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-[#c59a45] group-hover/item:text-white transition">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover/item:text-[#c59a45] transition">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">
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
                      ? 'text-[#c59a45] bg-[#c59a45]/10 font-bold'
                      : 'text-slate-700 hover:text-[#c59a45] hover:bg-slate-50'
                  }`}
                >
                  <span>{t.services}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#c59a45] group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Dropdown Panel */}
                <div className="absolute top-full right-0 rtl:right-0 ltr:left-0 pt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 flex items-center justify-between">
                      <span>{lang === 'ar' ? 'صفحة الخدمات وتفريعاتها' : 'Services & Sub-Branches'}</span>
                      <span className="text-[9px] text-[#c59a45] font-bold">{lang === 'ar' ? 'صفحة مستقلة' : 'Dedicated'}</span>
                    </div>
                    {servicesSubItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate(item.target)}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl transition group/item text-right rtl:text-right ltr:text-left ${
                          item.isSpecial
                            ? 'bg-amber-50/50 hover:bg-amber-100/70 border border-[#c59a45]/20'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                          item.isSpecial
                            ? 'bg-[#c59a45] text-white shadow-sm'
                            : 'bg-slate-100 group-hover/item:bg-[#c59a45] group-hover/item:text-white'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover/item:text-[#c59a45] transition">
                              {item.label}
                            </span>
                            {item.isSpecial && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#c59a45] text-white font-bold">
                                {lang === 'ar' ? 'حاسبة فورية' : 'CALC'}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                    <div className="pt-2 border-t border-slate-100 px-2 pb-1">
                      <button
                        onClick={() => onNavigate('services')}
                        className="w-full py-2 text-center text-xs font-bold text-[#c59a45] hover:text-[#9a752a] bg-[#c59a45]/10 rounded-xl"
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
                    ? 'text-[#c59a45] bg-[#c59a45]/10 font-bold'
                    : 'text-slate-700 hover:text-[#c59a45] hover:bg-slate-50'
                }`}
              >
                {t.products}
              </button>

              {/* 5. تواصل معنا */}
              <button
                onClick={() => onNavigate('contact')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  currentPage === 'contact'
                    ? 'text-[#c59a45] bg-[#c59a45]/10 font-bold'
                    : 'text-slate-700 hover:text-[#c59a45] hover:bg-slate-50'
                }`}
              >
                {t.contact}
              </button>

            </nav>

            {/* Actions (Search, Lang, Consultation CTA) */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className="p-2 text-slate-600 hover:text-[#c59a45] hover:bg-slate-100 rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-[#c59a45] bg-slate-100 hover:bg-slate-200 rounded-full transition"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#c59a45]" />
                <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
              </button>

              {/* Request Consultation CTA Button */}
              <button
                onClick={onOpenConsultation}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-[#c59a45] hover:bg-[#dfb76c] shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <span>{t.requestConsultation}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleLanguage}
                className="p-1.5 text-xs font-bold bg-slate-100 rounded-lg text-slate-700"
              >
                {lang === 'ar' ? 'EN' : 'ع'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-[#c59a45] focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="border-t border-slate-200 bg-white/95 px-4 py-3 shadow-inner">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث في منتجات السلامة، كود البناء، المواسير، المضخات... (اضغط Enter للانتقال للمنتجات)' : 'Search products, pipes, sprinklers, alarms... (Press Enter)'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-xs sm:text-sm text-slate-800"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </form>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-2xl px-4 py-5 space-y-3 max-h-[85vh] overflow-y-auto">
            
            {/* 1. الرئيسية */}
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 ${
                currentPage === 'home' ? 'text-[#c59a45]' : 'text-slate-800'
              }`}
            >
              {t.home}
            </button>

            {/* 2. عن الشركة */}
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 ${
                currentPage === 'about' ? 'text-[#c59a45]' : 'text-slate-800'
              }`}
            >
              {t.about}
            </button>

            {/* 3. خدماتنا (صفحة مستقلة) */}
            <button
              onClick={() => {
                onNavigate('services');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 flex items-center justify-between ${
                currentPage === 'services' ? 'text-[#c59a45]' : 'text-slate-800'
              }`}
            >
              <span>{t.services}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c59a45]/15 text-[#9a752a] font-normal">
                {lang === 'ar' ? 'صفحة وتفريعات' : 'Dedicated'}
              </span>
            </button>

            {/* 4. منتجاتنا (صفحة مستقلة) */}
            <button
              onClick={() => {
                onNavigate('products');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 flex items-center justify-between ${
                currentPage === 'products' ? 'text-[#c59a45]' : 'text-slate-800'
              }`}
            >
              <span>{t.products}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c59a45]/15 text-[#9a752a] font-normal">
                {lang === 'ar' ? 'الكتالوج الكامل' : 'Catalog'}
              </span>
            </button>

            {/* 5. تواصل معنا */}
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 ${
                currentPage === 'contact' ? 'text-[#c59a45]' : 'text-slate-800'
              }`}
            >
              {t.contact}
            </button>

            {/* CTA */}
            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-slate-950 bg-[#c59a45] hover:bg-[#dfb76c] shadow"
              >
                <span>{t.requestConsultation}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>
      <div className="h-16 sm:h-18"></div>
    </>
  );
}
