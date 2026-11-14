import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnnouncementTicker from './components/AnnouncementTicker';
import FloatingSupportDock from './components/FloatingSupportDock';
import HomePage from './pages/HomePage';
import { content as initialFallbackContent } from './data/content';
import { subscribeToLiveContent, getCachedLiveContent } from './services/firebase';

// Code-split heavy administration suite, interactive modals and secondary pages for rapid initial load
const ConsultationModal = lazy(() => import('./components/ConsultationModal'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));


export default function App() {
  const [lang, setLang] = useState('ar');
  const [siteContent, setSiteContent] = useState(() => getCachedLiveContent() || initialFallbackContent);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('tasami-theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedServiceForConsultation, setSelectedServiceForConsultation] = useState('');

  // Subscribe to real-time live content from Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToLiveContent((updated) => {
      if (updated) {
        setSiteContent(updated);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Tailwind dark class and persistence
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('tasami-theme', darkMode ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [darkMode]);

  // Multi-page navigation state
  const parseHash = () => {
    const raw = window.location.hash.replace(/^#\/?/, '').trim();
    if (!raw) return { page: 'home', section: null };
    
    // Support formats like: 'about#ceo' or 'about' or 'services#calculator'
    const parts = raw.split('#');
    const page = parts[0] || 'home';
    const section = parts[1] || null;

    if (['services', 'products', 'about', 'contact'].includes(page)) {
      return { page, section };
    }
    return { page: 'home', section: null };
  };

  const initial = parseHash();
  const [currentPage, setCurrentPage] = useState(initial.page);
  const [targetSection, setTargetSection] = useState(initial.section);
  const [activeBranchFilter, setActiveBranchFilter] = useState(null);
  const [openCalculator, setOpenCalculator] = useState(false);

  // Sync with browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const { page, section } = parseHash();
      setCurrentPage(page);
      setTargetSection(section);

      if (section) {
        setTimeout(() => {
          const el = document.getElementById(section);
          if (el) {
            const headerOffset = 115;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle document language & direction attribute dynamically
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = lang === 'ar'
      ? 'تسامي الأعمال لأنظمة السلامة | TASAMI BUSINESS FOR SAFETY SYSTEMS'
      : 'Tasami Business for Safety Systems | Turnkey Fire & Safety Engineering';
  }, [lang]);

  // Comprehensive, robust navigation function
  const navigateTo = (page, sectionId = null, filter = null, shouldOpenCalc = false) => {
    setCurrentPage(page);
    setTargetSection(sectionId);
    
    if (filter) {
      setActiveBranchFilter(filter);
    }
    if (shouldOpenCalc !== undefined) {
      setOpenCalculator(Boolean(shouldOpenCalc));
    }

    // Update browser URL hash
    if (sectionId) {
      window.location.hash = `${page}#${sectionId}`;
    } else {
      window.location.hash = page === 'home' ? '' : page;
    }

    // Accurate scroll handling
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const headerOffset = 115;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 180);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenConsultation = (serviceName = '') => {
    setSelectedServiceForConsultation(serviceName);
    setIsConsultationOpen(true);
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-[#0b1120] text-[#0f172a] dark:text-slate-100 font-${lang === 'ar' ? 'cairo' : 'sans'} flex flex-col justify-between transition-colors duration-300`}>
      
      {/* 1. Navigation Bar with multi-page tabs, Royal Blue header, and Dark Mode toggle */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        content={siteContent}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Global Animated Announcement & Reviews Ticker */}
      <AnnouncementTicker
        lang={lang}
        content={siteContent}
        onNavigate={navigateTo}
      />

      {/* 2. Main Page Content View with smooth Suspense fallback */}
      <main className="flex-1">
        {currentPage === 'home' ? (
          <HomePage
            lang={lang}
            content={siteContent}
            onNavigate={navigateTo}
            onOpenConsultation={handleOpenConsultation}
          />
        ) : (
          <Suspense
            fallback={
              <div className="min-h-[50vh] flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-9 h-9 border-3 border-[#c59a45] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-slate-500 font-cairo">جاري تحميل المحتوى...</span>
              </div>
            }
          >
            {currentPage === 'services' && (
              <ServicesPage
                lang={lang}
                content={siteContent}
                onNavigate={navigateTo}
                onOpenConsultation={handleOpenConsultation}
                targetSection={targetSection}
                activeBranchFilter={activeBranchFilter}
                openCalculator={openCalculator}
              />
            )}

            {currentPage === 'products' && (
              <ProductsPage
                lang={lang}
                content={siteContent}
                onNavigate={navigateTo}
                onOpenConsultation={handleOpenConsultation}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                lang={lang}
                content={siteContent}
                onNavigate={navigateTo}
                onOpenConsultation={handleOpenConsultation}
                targetSection={targetSection}
              />
            )}

            {currentPage === 'contact' && (
              <ContactPage
                lang={lang}
                content={siteContent}
                onNavigate={navigateTo}
                onOpenConsultation={handleOpenConsultation}
              />
            )}
          </Suspense>
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        lang={lang}
        content={siteContent}
        onNavigate={navigateTo}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Interactive Consultation Request Modal - Lazy loaded */}
      {isConsultationOpen && (
        <Suspense fallback={null}>
          <ConsultationModal
            isOpen={isConsultationOpen}
            onClose={() => setIsConsultationOpen(false)}
            lang={lang}
            initialService={selectedServiceForConsultation}
          />
        </Suspense>
      )}

      {/* Global Floating WhatsApp & Technical Support Instant Q&A Dock */}
      <FloatingSupportDock lang={lang} content={siteContent} />

      {/* Admin Dashboard to view and edit live site & Firebase - Lazy loaded on-demand */}
      {isAdminOpen && (
        <Suspense fallback={null}>
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            currentContent={siteContent}
            onContentUpdate={(updated) => setSiteContent(updated)}
          />
        </Suspense>
      )}

    </div>
  );
}
