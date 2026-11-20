import React, { useState, useEffect } from 'react';
import TasamiLogo from './TasamiLogo';
import SiteExplorerMenu from './SiteExplorerMenu';
import {
  Search,
  Globe,
  Menu,
  X,
  ChevronDown,
  Quote,
  Eye,
  Network,
  FolderKanban,
  Flame,
  Shield,
  ShieldCheck,
  FileCheck,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  User,
  UserCheck,
  QrCode
} from 'lucide-react';
import VisitorAuthModal from './VisitorAuthModal';
import UserProfileModal from './UserProfileModal';
import PwaInstallModal from './PwaInstallModal';
import { subscribeToVisitorAuth } from '../services/auth';

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

  // Visitor Authentication & Profile States
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToVisitorAuth((u) => {
      setCurrentUser(u);
    });
    return () => unsubscribe();
  }, []);

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
      icon: <Quote className="w-4 h-4 text-[#C5A059]" />
    },
    {
      label: t.vision || (lang === 'ar' ? 'الرؤية والرسالة' : 'Vision & Mission'),
      page: 'about',
      sectionId: 'vision',
      desc: lang === 'ar' ? 'طموحنا نحو بيئة خالية من المخاطر' : 'Our vision towards zero-hazard future',
      icon: <Eye className="w-4 h-4 text-[#C5A059]" />
    },
    {
      label: t.orgChart || (lang === 'ar' ? 'الهيكل التنظيمي' : 'Org Structure'),
      page: 'about',
      sectionId: 'org-chart',
      desc: lang === 'ar' ? 'الهيكل الإداري والهندسي المؤسسي' : 'Organizational and technical hierarchy',
      icon: <Network className="w-4 h-4 text-[#C5A059]" />
    },
    {
      label: t.projects || (lang === 'ar' ? 'أبرز مشاريعنا' : 'Featured Projects'),
      page: 'about',
      sectionId: 'projects',
      desc: lang === 'ar' ? 'مشاريعنا المنفذة في كبرى قطاعات المملكة' : 'Flagship projects secured kingdom-wide',
      icon: <FolderKanban className="w-4 h-4 text-[#C5A059]" />
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
      icon: <Flame className="w-4 h-4 text-[#C5A059]" />
    },
    {
      label: t.certifiedServices || t.services || (lang === 'ar' ? 'الرشاشات والمضخات' : 'Sprinklers & Pumps'),
      page: 'services',
      sectionId: 'services-grid',
      filter: 'sprinklers-pumps',
      desc: lang === 'ar' ? 'الشبكات المائية ومحطات المضخات' : 'Alarms, sprinklers & pump networks',
      icon: <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
    },
    {
      label: t.licenses || (lang === 'ar' ? 'الصيانة وتراخيص سلامة' : 'Maintenance & Civil Defense'),
      page: 'services',
      sectionId: 'services-grid',
      filter: 'maintenance',
      desc: lang === 'ar' ? 'عقود الصيانة وإصدار تراخيص منصة سلامة' : 'Civil Defense approvals & maintenance',
      icon: <FileCheck className="w-4 h-4 text-[#C5A059]" />
    },
    {
      label: t.calculator || (lang === 'ar' ? 'حاسبة السلامة الهندسية' : 'Safety Estimator'),
      page: 'services',
      sectionId: 'calculator-section',
      openCalculator: true,
      desc: lang === 'ar' ? 'احسب تقدير التكاليف والمتطلبات فورياً' : 'Instant budgetary & statutory estimator',
      icon: <Calculator className="w-4 h-4 text-white" />,
      isSpecial: true
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-[#0b1120] border-b border-slate-200/80 dark:border-slate-800 text-[#0f172a] dark:text-white ${
          isScrolled
            ? 'shadow-[0_1px_12px_rgba(0,35,102,0.06)] py-2'
            : 'py-2.5 sm:py-3'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-3 sm:px-5 lg:px-4 xl:px-6">
          <div className="flex items-center justify-between gap-1.5 lg:gap-2 xl:gap-3">
            
            {/* Logo + Quick Cascading Site Explorer */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 rounded-xl py-0.5 shrink-0"
                title="تسامي الأعمال لأنظمة السلامة"
              >
                <TasamiLogo content={content} isWhite={false} compact={true} lang={lang} className="h-10 sm:h-11 md:h-12" />
              </button>

              <SiteExplorerMenu
                lang={lang}
                content={content}
                currentPage={currentPage}
                onNavigate={onNavigate}
                onOpenConsultation={onOpenConsultation}
                onOpenAdmin={onOpenAdmin}
                onOpenPwa={() => setIsPwaModalOpen(true)}
              />
            </div>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5">
              
              {/* 1. الرئيسية (Home) */}
              <button
                onClick={() => onNavigate('home')}
                className={`px-1.5 xl:px-2.5 2xl:px-3 py-2 text-xs xl:text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  currentPage === 'home'
                    ? 'text-[#002366] dark:text-[#D4AF37] border-[#C5A059]'
                    : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-[#002366] dark:hover:text-[#D4AF37]'
                }`}
              >
                {t.home}
              </button>

              {/* 2. عن الشركة (About Company - Dropdown & Direct Navigate) */}
              <div className="relative group">
                <button
                  onClick={() => onNavigate('about')}
                  className={`flex items-center gap-1 px-1.5 xl:px-2.5 2xl:px-3 py-2 text-xs xl:text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    currentPage === 'about'
                      ? 'text-[#002366] dark:text-[#D4AF37] border-[#C5A059]'
                      : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-[#002366] dark:hover:text-[#D4AF37]'
                  }`}
                >
                  <span>{t.about}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#C5A059] group-hover:rotate-180 transition-transform duration-150" />
                </button>

                {/* Dropdown Panel */}
                <div className="dropdown-flash-panel absolute top-full right-0 rtl:right-0 ltr:left-0 pt-2.5 w-72 z-50">
                  <div className="bg-white dark:bg-[#131c31] rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#002366] dark:text-[#D4AF37] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      {lang === 'ar' ? 'أقسام عن الشركة' : 'Company Highlights'}
                    </div>
                    {aboutSubItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate(item.page, item.sectionId)}
                        className="dropdown-flash-item w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition group/item text-right rtl:text-right ltr:text-left"
                      >
                        <div className="w-7 h-7 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-[#0b1120] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:border-[#C5A059] transition">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0f172a] dark:text-white group-hover/item:text-[#002366] dark:group-hover/item:text-[#D4AF37] transition">
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
                  className={`flex items-center gap-1 px-1.5 xl:px-2.5 2xl:px-3 py-2 text-xs xl:text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    currentPage === 'services'
                      ? 'text-[#002366] dark:text-[#D4AF37] border-[#C5A059]'
                      : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-[#002366] dark:hover:text-[#D4AF37]'
                  }`}
                >
                  <span>{t.services}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#C5A059] group-hover:rotate-180 transition-transform duration-150" />
                </button>

                {/* Dropdown Panel */}
                <div className="dropdown-flash-panel absolute top-full right-0 rtl:right-0 ltr:left-0 pt-2.5 w-80 z-50">
                  <div className="bg-white dark:bg-[#131c31] rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#002366] dark:text-[#D4AF37] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>{lang === 'ar' ? 'صفحة الخدمات وتفريعاتها' : 'Services & Sub-Branches'}</span>
                      <span className="text-[9px] text-[#C5A059] font-bold">{lang === 'ar' ? 'صفحة مستقلة' : 'Dedicated'}</span>
                    </div>
                    {servicesSubItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate(item.page, item.sectionId, item.filter, item.openCalculator)}
                        className={`dropdown-flash-item w-full flex items-start gap-2.5 p-2 rounded-xl transition group/item text-right rtl:text-right ltr:text-left ${
                          item.isSpecial
                            ? 'bg-white dark:bg-[#0b1120] border border-[#C5A059]/45 hover:border-[#C5A059]'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                          item.isSpecial
                            ? 'bg-[#C5A059] text-white'
                            : 'border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-[#0b1120] group-hover/item:border-[#C5A059]'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0f172a] dark:text-white group-hover/item:text-[#002366] dark:group-hover/item:text-[#D4AF37] transition">
                              {item.label}
                            </span>
                            {item.isSpecial && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#002366] text-white font-bold">
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
                        className="w-full py-2 text-center text-xs font-semibold text-white bg-[#002366] hover:bg-[#1D4ED8] rounded-full transition-colors"
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
                className={`px-1.5 xl:px-2.5 2xl:px-3 py-2 text-xs xl:text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  currentPage === 'products'
                    ? 'text-[#002366] dark:text-[#D4AF37] border-[#C5A059]'
                    : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-[#002366] dark:hover:text-[#D4AF37]'
                }`}
              >
                {t.products}
              </button>

              {/* 5. تواصل معنا */}
              <button
                onClick={() => onNavigate('contact')}
                className={`px-1.5 xl:px-2.5 2xl:px-3 py-2 text-xs xl:text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  currentPage === 'contact'
                    ? 'text-[#002366] dark:text-[#D4AF37] border-[#C5A059]'
                    : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-[#002366] dark:hover:text-[#D4AF37]'
                }`}
              >
                {t.contact}
              </button>

            </nav>

            {/* Actions (Dark Mode Toggle, Search, Lang, Account, QR, Admin, Consultation CTA) */}
            <div className="hidden md:flex items-center gap-1.5 2xl:gap-2 shrink-0">
              {/* Dark / Light Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                aria-label={darkMode ? (lang === 'ar' ? 'تفعيل الوضع الفاتح' : 'Switch to Light Mode') : (lang === 'ar' ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode')}
                title={darkMode ? (lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}
                className="p-1.5 xl:p-2 text-slate-600 dark:text-slate-300 hover:text-[#002366] dark:hover:text-[#D4AF37] bg-white dark:bg-transparent border border-slate-200/80 dark:border-slate-700 hover:border-[#C5A059] rounded-full transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4 text-[#D4AF37]" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                title={lang === 'ar' ? 'بحث' : 'Search'}
                className="p-1.5 xl:p-2 text-slate-600 dark:text-slate-300 hover:text-[#002366] dark:hover:text-[#D4AF37] bg-white dark:bg-transparent border border-slate-200/80 dark:border-slate-700 hover:border-[#C5A059] rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#002366] dark:hover:text-[#D4AF37] bg-white dark:bg-transparent border border-slate-200/80 dark:border-slate-700 hover:border-[#C5A059] rounded-full transition-colors whitespace-nowrap"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
              </button>

              {/* Visitor / Client Account Portal */}
              {currentUser ? (
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-transparent text-[#002366] dark:text-[#D4AF37] border border-[#002366]/25 dark:border-[#C5A059]/50 hover:border-[#C5A059] transition-colors"
                  title={isAr ? `حساب الزائر: ${currentUser.name} (اضغط لإدارة الحساب والمفضلة والتقييم)` : `Visitor Account: ${currentUser.name}`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="max-w-[76px] xl:max-w-[110px] truncate">{currentUser.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#002366] dark:text-[#D4AF37] bg-white dark:bg-transparent border border-[#002366]/25 dark:border-[#C5A059]/50 hover:border-[#C5A059] transition-colors"
                  title={isAr ? 'بوابة الزوار: تسجيل الدخول أو فتح حساب جديد' : 'Visitor Portal: Sign In or Register'}
                >
                  <User className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="hidden xl:inline whitespace-nowrap">{isAr ? 'دخول الزوار' : 'Visitor Login'}</span>
                  <span className="xl:hidden whitespace-nowrap">{isAr ? 'دخول' : 'Sign In'}</span>
                </button>
              )}

              {/* PWA & QR Code Install Trigger (visible in bar >= xl; also in Site Explorer & Footer) */}
              <button
                onClick={() => setIsPwaModalOpen(true)}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#002366] dark:hover:text-[#D4AF37] bg-white dark:bg-transparent border border-slate-200/80 dark:border-slate-700 hover:border-[#C5A059] transition-colors whitespace-nowrap shrink-0"
                title={isAr ? 'تثبيت التطبيق على الجوال والكمبيوتر ومسح الباركود' : 'Install App / Scan QR'}
              >
                <QrCode className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px]">{isAr ? 'التطبيق' : 'App / QR'}</span>
              </button>

              {/* Admin Portal Trigger (always visible in navbar bar on tablet & desktop; also in mobile bar/menu, Site Explorer & Footer) */}
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#002366] dark:hover:text-[#D4AF37] bg-white dark:bg-transparent border border-slate-200/80 dark:border-slate-700 hover:border-[#C5A059] transition-colors whitespace-nowrap shrink-0"
                title={lang === 'ar' ? 'بوابة مدير الموقع وقاعدة البيانات' : 'Admin & Database Portal'}
              >
                <Shield className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="text-[11px]">{lang === 'ar' ? 'الإدارة' : 'Admin'}</span>
              </button>

              {/* Request Consultation CTA Button */}
              <button
                onClick={onOpenConsultation}
                className="flex items-center gap-1.5 px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs font-semibold text-white bg-[#002366] hover:bg-[#1D4ED8] transition-colors whitespace-nowrap"
              >
                <span className={isAr ? 'hidden xl:inline' : 'hidden 2xl:inline'}>{t.requestConsultation}</span>
                <span className={isAr ? 'xl:hidden' : '2xl:hidden'}>{isAr ? 'طلب معاينة' : 'Site Survey'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
              <button
                onClick={onOpenAdmin}
                aria-label={lang === 'ar' ? 'الإدارة' : 'Admin'}
                title={lang === 'ar' ? 'بوابة مدير الموقع وقاعدة البيانات' : 'Admin & Database Portal'}
                className="md:hidden flex items-center gap-1 p-1.5 sm:px-2 bg-white dark:bg-transparent border border-slate-200/80 dark:border-slate-700 hover:border-[#C5A059] rounded-lg text-xs font-semibold text-[#002366] dark:text-[#D4AF37] transition-colors"
              >
                <Shield className="w-4 h-4 text-[#C5A059]" />
                <span className="hidden sm:inline text-[11px]">{lang === 'ar' ? 'الإدارة' : 'Admin'}</span>
              </button>
              <button
                onClick={onToggleDarkMode}
                aria-label="Toggle theme"
                className="md:hidden p-1.5 bg-white dark:bg-transparent border border-slate-200/80 dark:border-slate-700 hover:border-[#C5A059] rounded-lg text-[#002366] dark:text-white transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4 text-[#D4AF37]" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleLanguage}
                className="md:hidden px-2 py-1.5 text-xs font-semibold bg-white dark:bg-transparent border border-slate-200/80 dark:border-slate-700 hover:border-[#C5A059] rounded-lg text-[#002366] dark:text-white transition-colors"
              >
                {lang === 'ar' ? 'EN' : 'ع'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="p-2 text-[#002366] dark:text-white hover:text-[#C5A059] focus:outline-none transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="animate-dropdown-flash border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131c31] px-4 py-3 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-[#002366] dark:text-[#D4AF37]" />
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
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#002366] dark:hover:text-[#D4AF37]"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </form>
          </div>
        )}

        {/* Mobile Dropdown Menu with Full Accordions */}
        {mobileMenuOpen && (
          <div className="animate-dropdown-flash lg:hidden border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131c31] text-[#0f172a] dark:text-slate-100 shadow-lg px-4 py-5 space-y-3 max-h-[85vh] overflow-y-auto">
            
            {/* 1. الرئيسية */}
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800 ${
                currentPage === 'home' ? 'text-[#002366] dark:text-[#D4AF37]' : 'text-[#0f172a] dark:text-slate-100'
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
                  className={`text-sm font-bold ${currentPage === 'about' ? 'text-[#002366] dark:text-[#D4AF37]' : 'text-[#0f172a] dark:text-slate-100'}`}
                >
                  {t.about}
                </button>
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#C5A059]"
                  aria-label="Toggle About Submenu"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${mobileAboutOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
                </button>
              </div>

              {mobileAboutOpen && (
                <div className="animate-dropdown-flash pr-4 rtl:pr-4 ltr:pl-4 space-y-1.5 mt-1 bg-white dark:bg-[#0b1120] border border-slate-100 dark:border-slate-800 p-2.5 rounded-xl">
                  {aboutSubItems.map((sub, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onNavigate(sub.page, sub.sectionId);
                        setMobileMenuOpen(false);
                      }}
                      className="dropdown-flash-item w-full flex items-center gap-2 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#002366] dark:hover:text-[#D4AF37] text-right rtl:text-right ltr:text-left"
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
                  className={`text-sm font-bold ${currentPage === 'services' ? 'text-[#002366] dark:text-[#D4AF37]' : 'text-[#0f172a] dark:text-slate-100'}`}
                >
                  {t.services}
                </button>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#C5A059]"
                  aria-label="Toggle Services Submenu"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${mobileServicesOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
                </button>
              </div>

              {mobileServicesOpen && (
                <div className="animate-dropdown-flash pr-4 rtl:pr-4 ltr:pl-4 space-y-1.5 mt-1 bg-white dark:bg-[#0b1120] border border-slate-100 dark:border-slate-800 p-2.5 rounded-xl">
                  {servicesSubItems.map((sub, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onNavigate(sub.page, sub.sectionId, sub.filter, sub.openCalculator);
                        setMobileMenuOpen(false);
                      }}
                      className="dropdown-flash-item w-full flex items-center justify-between py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#002366] dark:hover:text-[#D4AF37] text-right rtl:text-right ltr:text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className={sub.isSpecial ? 'p-1 rounded bg-[#C5A059]' : ''}>{sub.icon}</span>
                        <span>{sub.label}</span>
                      </div>
                      {sub.isSpecial && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#002366] text-white font-bold">
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
                currentPage === 'products' ? 'text-[#002366] dark:text-[#D4AF37]' : 'text-[#0f172a] dark:text-slate-100'
              }`}
            >
              <span>{t.products}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#002366]/20 text-[#002366] dark:text-[#D4AF37] font-semibold">
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
                currentPage === 'contact' ? 'text-[#002366] dark:text-[#D4AF37]' : 'text-[#0f172a] dark:text-slate-100'
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
              className="w-full text-right rtl:text-right ltr:text-left py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[#002366] dark:text-[#D4AF37]"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C5A059]" />
                <span>{lang === 'ar' ? 'لوحة مدير الموقع (الرمز السري)' : 'Admin Dashboard'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#C5A059]/40 text-[#C5A059] font-bold">
                Admin
              </span>
            </button>

            {/* 7. حساب الزائر / العميل */}
            <div className="py-2.5 border-b border-slate-100 dark:border-slate-800">
              {currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#0b1120] border border-[#C5A059]/40 text-right rtl:text-right ltr:text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#002366] text-white font-bold flex items-center justify-center text-xs">
                      {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a] dark:text-white">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
                        {currentUser.phone || currentUser.email}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#C5A059]">
                    {isAr ? 'إدارة الحساب' : 'Profile'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold text-[#002366] dark:text-[#D4AF37] bg-white dark:bg-transparent border border-[#002366]/25 dark:border-[#C5A059]/50"
                >
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <span>{isAr ? 'دخول الزوار / إنشاء حساب جديد' : 'Visitor Sign In / Register'}</span>
                </button>
              )}
            </div>

            {/* Mobile PWA Install & QR Trigger */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsPwaModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#002366] text-white font-semibold text-xs hover:bg-[#1D4ED8] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#D4AF37]">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div className="text-right rtl:text-right ltr:text-left">
                    <div className="text-xs font-bold">{isAr ? 'تثبيت تطبيق تسامي للسلامة' : 'Install Tasami Safety App'}</div>
                    <div className="text-[10px] text-white/75">{isAr ? 'يعمل كأيقونة مستقلة وبدون متجر' : 'Standalone app for all phones'}</div>
                  </div>
                </div>
                <span className="text-[10px] bg-[#C5A059] text-white font-bold px-2.5 py-0.5 rounded-full">
                  تثبيت | PWA
                </span>
              </button>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold text-white bg-[#C5A059] hover:bg-[#b58f47] transition-colors"
              >
                <span>{t.requestConsultation}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Visitor Authentication Modal (Login / Register with Phone or Email) */}
        <VisitorAuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          lang={lang}
          onSuccess={(u) => setCurrentUser(u)}
        />

        {/* Visitor Profile & Consultation History Modal */}
        <UserProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={currentUser}
          lang={lang}
          onLogout={() => setCurrentUser(null)}
          onNavigateToProducts={() => onNavigate('products')}
          onOpenConsultation={(svc) => onOpenConsultation?.(svc)}
        />

        {/* PWA App Installation & QR Code Modal */}
        <PwaInstallModal
          isOpen={isPwaModalOpen}
          onClose={() => setIsPwaModalOpen(false)}
          lang={lang}
        />
      </header>
      <div className="h-16 sm:h-[72px] md:h-20"></div>
    </>
  );
}
