import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { content } from './data/content';

export default function App() {
  const [lang, setLang] = useState('ar');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedServiceForConsultation, setSelectedServiceForConsultation] = useState('');

  // Current page state ('home', 'services', 'products', 'about', 'contact')
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '').replace('/', '').trim();
    if (['services', 'products', 'about', 'contact'].includes(hash)) {
      return hash;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  // Sync with browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').replace('/', '').trim();
      if (['services', 'products', 'about', 'contact'].includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (serviceName = '') => {
    setSelectedServiceForConsultation(serviceName);
    setIsConsultationOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 font-${lang === 'ar' ? 'cairo' : 'sans'} flex flex-col justify-between`}>
      
      {/* 1. Navigation Bar with multi-page tabs and clean horizontal logo */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        lang={lang}
        setLang={setLang}
        content={content}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* 2. Main Page Content View */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            lang={lang}
            content={content}
            onNavigate={navigateTo}
            onOpenConsultation={handleOpenConsultation}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            lang={lang}
            content={content}
            onNavigate={navigateTo}
            onOpenConsultation={handleOpenConsultation}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            lang={lang}
            content={content}
            onNavigate={navigateTo}
            onOpenConsultation={handleOpenConsultation}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            lang={lang}
            content={content}
            onNavigate={navigateTo}
            onOpenConsultation={handleOpenConsultation}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            lang={lang}
            content={content}
            onNavigate={navigateTo}
            onOpenConsultation={handleOpenConsultation}
          />
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        lang={lang}
        content={content}
        onNavigate={navigateTo}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Interactive Consultation Request Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        lang={lang}
        initialService={selectedServiceForConsultation}
      />

      {/* Admin Dashboard to view live submissions */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
}
