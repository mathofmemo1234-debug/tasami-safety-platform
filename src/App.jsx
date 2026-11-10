import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import CeoMessage from './components/CeoMessage';
import VisionMissionValues from './components/VisionMissionValues';
import AutomaticSuppressionSection from './components/AutomaticSuppressionSection';
import ServicesDetailedSection from './components/ServicesDetailedSection';
import ProductsCatalogSection from './components/ProductsCatalogSection';
import CertificatesLicensesSection from './components/CertificatesLicensesSection';
import OrgStructureSection from './components/OrgStructureSection';
import ProjectsSection from './components/ProjectsSection';
import SafetyCalculator from './components/SafetyCalculator';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';
import AdminDashboard from './components/AdminDashboard';
import { content } from './data/content';

export default function App() {
  const [lang, setLang] = useState('ar');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedServiceForConsultation, setSelectedServiceForConsultation] = useState('');

  // Handle document language & direction attribute dynamically
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = lang === 'ar'
      ? 'شركة تسامي الأعمال | TASAMI BUSINESS COMPANY - لأنظمة الإطفاء والإنذار من الحريق'
      : 'Tasami Business Company | Turnkey Fire & Safety Engineering';
  }, [lang]);

  const handleOpenConsultation = (serviceName = '') => {
    setSelectedServiceForConsultation(serviceName);
    setIsConsultationOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-${lang === 'ar' ? 'cairo' : 'sans'}`}>
      
      {/* 1. Navigation Bar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        content={content}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* 2. Hero Section */}
      <Hero
        lang={lang}
        content={content}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* 3. About Company Section */}
      <AboutSection
        lang={lang}
        content={content}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* 4. CEO Executive Message */}
      <CeoMessage
        lang={lang}
        content={content}
      />

      {/* 5. Vision, Mission, Goals & Values */}
      <VisionMissionValues
        lang={lang}
        content={content}
      />

      {/* 6. Automatic Fire Suppression Systems (FM-200, NOVEC 1230, Aerosol, Kitchen, CO2) */}
      <AutomaticSuppressionSection
        lang={lang}
        content={content}
        onSelectService={(serviceName) => handleOpenConsultation(serviceName)}
      />

      {/* 7. Comprehensive Services & Matrix */}
      <ServicesDetailedSection
        lang={lang}
        content={content}
        onSelectService={(serviceName) => handleOpenConsultation(serviceName)}
      />

      {/* 8. Products Catalog & Supply */}
      <ProductsCatalogSection
        lang={lang}
        content={content}
        onSelectService={(serviceName) => handleOpenConsultation(serviceName)}
      />

      {/* 9. Global Accreditations & Statutory Government Licenses */}
      <CertificatesLicensesSection
        lang={lang}
        content={content}
      />

      {/* 10. Organizational Structure */}
      <OrgStructureSection
        lang={lang}
        content={content}
      />

      {/* 11. Featured Projects Showcase */}
      <ProjectsSection
        lang={lang}
        content={content}
      />

      {/* 12. Interactive Safety Calculator & Estimator */}
      <SafetyCalculator
        lang={lang}
        content={content}
        onSaveQuote={() => {}}
      />

      {/* 13. Pre-Footer Banner & Direct Contact Channels */}
      <ContactSection
        lang={lang}
        content={content}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* 14. Footer */}
      <Footer
        lang={lang}
        content={content}
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
