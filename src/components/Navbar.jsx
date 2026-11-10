import React, { useState, useEffect } from 'react';
import TasamiLogo from './TasamiLogo';
import { Search, Globe, Menu, X, ArrowUpRight, ShieldCheck, Calculator } from 'lucide-react';

export default function Navbar({ lang, setLang, content, onOpenConsultation }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const navLinks = [
    { label: t.home, href: '#home' },
    { label: t.about, href: '#about' },
    { label: t.ceo, href: '#ceo' },
    { label: t.visionMission, href: '#vision-values' },
    { label: t.suppression, href: '#suppression' },
    { label: t.services, href: '#services' },
    { label: t.products, href: '#products' },
    { label: t.licenses, href: '#licenses' },
    { label: t.orgChart, href: '#org-chart' },
    { label: t.calculator, href: '#calculator', isCalc: true },
    { label: t.contact, href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-100'
            : 'bg-white/90 backdrop-blur-sm py-3.5 border-b border-slate-100/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="flex items-center">
              <TasamiLogo lang={lang} />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-5">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className={`text-xs font-semibold transition-colors duration-200 py-1 ${
                    idx === 0
                      ? 'text-[#c59a45] font-bold'
                      : 'text-slate-700 hover:text-[#c59a45]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Actions (Search, Lang, Consultation CTA) */}
            <div className="hidden md:flex items-center gap-3">
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
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-[#c59a45] bg-slate-100/80 hover:bg-slate-200/70 rounded-full transition"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#c59a45]" />
                <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
              </button>

              {/* Request Consultation CTA Button */}
              <button
                onClick={onOpenConsultation}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#c59a45] hover:bg-[#b58a38] shadow-sm hover:shadow-gold-glow transition-all transform hover:-translate-y-0.5"
              >
                <span>{t.requestConsultation}</span>
                <span className={lang === 'ar' ? 'rotate-180' : ''}>→</span>
              </button>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <div className="flex items-center gap-2 xl:hidden">
              <button
                onClick={toggleLanguage}
                className="p-1.5 text-xs font-bold bg-slate-100 rounded-md text-slate-700"
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
                placeholder={lang === 'ar' ? 'ابحث في أنظمة الإطفاء، كود البناء، التوريد، طفايات الحريق...' : 'Search fire suppression, codes, supply catalog...'}
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

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white shadow-xl px-4 py-5 space-y-2 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#c59a45] border-b border-slate-100"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold text-white bg-[#c59a45] hover:bg-[#b58a38] shadow"
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
