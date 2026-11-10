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
  Sparkles
} from 'lucide-react';

export default function Navbar({ lang, setLang, content, onOpenConsultation }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

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

  // 1. عن الشركة Sub-items
  const aboutSubItems = [
    {
      label: t.ceo || (lang === 'ar' ? 'كلمة الرئيس التنفيذي' : 'CEO Message'),
      href: '#ceo',
      desc: lang === 'ar' ? 'رسالة الإدارة التنفيذية ورؤيتها' : 'Executive leadership message',
      icon: <Quote className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.vision || (lang === 'ar' ? 'الرؤية' : 'Vision'),
      href: '#vision',
      desc: lang === 'ar' ? 'طموحنا نحو بيئة خالية من المخاطر' : 'Our vision towards zero-hazard future',
      icon: <Eye className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.mission || (lang === 'ar' ? 'الرسالة' : 'Mission'),
      href: '#mission',
      desc: lang === 'ar' ? 'العين الساهرة واليد الماهرة في عالم السلامة' : 'The watchful eye and skilled hand',
      icon: <Compass className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.orgChart || (lang === 'ar' ? 'الهيكل التنظيمي' : 'Org Structure'),
      href: '#org-chart',
      desc: lang === 'ar' ? 'الهيكل الإداري والهندسي المؤسسي' : 'Organizational and technical hierarchy',
      icon: <Network className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.projects || (lang === 'ar' ? 'أبرز مشاريعنا' : 'Featured Projects'),
      href: '#projects',
      desc: lang === 'ar' ? 'مشاريعنا المنفذة في كبرى قطاعات المملكة' : 'Flagship projects secured kingdom-wide',
      icon: <FolderKanban className="w-4 h-4 text-[#c59a45]" />
    },
  ];

  // 2. خدماتنا Sub-items
  const servicesSubItems = [
    {
      label: t.suppression || (lang === 'ar' ? 'أنظمة الإطفاء التلقائي' : 'Automatic Suppression'),
      href: '#suppression',
      desc: lang === 'ar' ? 'FM-200، NOVEC 1230، الأيروسول، والمطابخ' : 'Clean agent, aerosol & kitchen systems',
      icon: <Flame className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.certifiedServices || t.services || (lang === 'ar' ? 'خدماتنا المعتمدة' : 'Certified Services'),
      href: '#services',
      desc: lang === 'ar' ? 'الإنذار المبكر، شبكات الرشاشات، وسحب الدخان' : 'Alarms, sprinklers & smoke evacuation',
      icon: <ShieldCheck className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.licenses || (lang === 'ar' ? 'الاعتمادات والتراخيص' : 'Accreditations & Licenses'),
      href: '#licenses',
      desc: lang === 'ar' ? 'ترخيص الدفاع المدني، سابر، وكود البناء SBC' : 'Civil Defense, SABER & SBC codes',
      icon: <FileCheck className="w-4 h-4 text-[#c59a45]" />
    },
    {
      label: t.calculator || (lang === 'ar' ? 'حاسبة السلامة' : 'Safety Estimator'),
      href: '#calculator',
      desc: lang === 'ar' ? 'احسب تقدير التكاليف والمتطلبات الفورية' : 'Instant budgetary & statutory estimator',
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
            : 'bg-white/90 backdrop-blur-sm py-3 border-b border-slate-100/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <a href="#home" className="flex items-center">
              <TasamiLogo lang={lang} />
            </a>

            {/* Desktop Navigation Menu (5 main tabs per user sketch) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              
              {/* 1. الرئيسية (Home) */}
              <a
                href="#home"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-[#c59a45] hover:bg-slate-50 transition"
              >
                {t.home}
              </a>

              {/* 2. عن الشركة (About Company - Dropdown) */}
              <div className="relative group">
                <a
                  href="#about"
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-[#c59a45] hover:bg-slate-50 transition"
                >
                  <span>{t.about}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#c59a45] group-hover:rotate-180 transition-transform duration-200" />
                </a>

                {/* Dropdown Panel */}
                <div className="absolute top-full right-0 rtl:right-0 ltr:left-0 pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                      {lang === 'ar' ? 'أقسام عن الشركة' : 'Company Highlights'}
                    </div>
                    {aboutSubItems.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-amber-50/60 transition group/item"
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
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. خدماتنا (Our Services - Dropdown) */}
              <div className="relative group">
                <a
                  href="#services"
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-[#c59a45] hover:bg-slate-50 transition"
                >
                  <span>{t.services}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#c59a45] group-hover:rotate-180 transition-transform duration-200" />
                </a>

                {/* Dropdown Panel */}
                <div className="absolute top-full right-0 rtl:right-0 ltr:left-0 pt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                      {lang === 'ar' ? 'حلول وأنظمة السلامة' : 'Safety Systems & Solutions'}
                    </div>
                    {servicesSubItems.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        className={`flex items-start gap-2.5 p-2 rounded-xl transition group/item ${
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
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#c59a45] text-white font-black">
                                {lang === 'ar' ? 'حاسبة فورية' : 'CALCULATOR'}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. منتجاتنا (Products) */}
              <a
                href="#products"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-[#c59a45] hover:bg-slate-50 transition"
              >
                {t.products}
              </a>

              {/* 5. تواصل معنا (Contact Us) */}
              <a
                href="#contact"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-[#c59a45] hover:bg-slate-50 transition"
              >
                {t.contact}
              </a>

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
                <span className={lang === 'ar' ? 'rotate-180' : ''}>→</span>
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
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث في منتجات السلامة، كود البناء، المواسير، المضخات...' : 'Search fire products, pipes, sprinklers, alarms...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-xs sm:text-sm text-slate-800"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu (Accordion structure matching user diagram) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-2xl px-4 py-5 space-y-3 max-h-[85vh] overflow-y-auto">
            
            {/* 1. الرئيسية */}
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-black text-slate-800 hover:text-[#c59a45] border-b border-slate-100"
            >
              {t.home}
            </a>

            {/* 2. عن الشركة (Accordion) */}
            <div className="border-b border-slate-100 pb-2">
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="w-full flex items-center justify-between py-2 text-sm font-black text-slate-800 hover:text-[#c59a45]"
              >
                <span>{t.about}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180 text-[#c59a45]' : 'text-slate-400'}`} />
              </button>
              {mobileAboutOpen && (
                <div className="pr-4 rtl:pr-4 ltr:pl-4 space-y-2 mt-1 bg-slate-50 p-2.5 rounded-xl">
                  {aboutSubItems.map((sub, idx) => (
                    <a
                      key={idx}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#c59a45]"
                    >
                      {sub.icon}
                      <span>{sub.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* 3. خدماتنا (Accordion) */}
            <div className="border-b border-slate-100 pb-2">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex items-center justify-between py-2 text-sm font-black text-slate-800 hover:text-[#c59a45]"
              >
                <span>{t.services}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180 text-[#c59a45]' : 'text-slate-400'}`} />
              </button>
              {mobileServicesOpen && (
                <div className="pr-4 rtl:pr-4 ltr:pl-4 space-y-2 mt-1 bg-slate-50 p-2.5 rounded-xl">
                  {servicesSubItems.map((sub, idx) => (
                    <a
                      key={idx}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#c59a45]"
                    >
                      {sub.icon}
                      <span>{sub.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* 4. منتجاتنا */}
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-black text-slate-800 hover:text-[#c59a45] border-b border-slate-100"
            >
              {t.products}
            </a>

            {/* 5. تواصل معنا */}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-black text-slate-800 hover:text-[#c59a45] border-b border-slate-100"
            >
              {t.contact}
            </a>

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
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </header>
      <div className="h-16"></div>
    </>
  );
}
