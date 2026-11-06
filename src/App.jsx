import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
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
      ? 'تسامي لحلول الأمن والسلامة | TASAMI SAFETY SOLUTION - سلامتك أمانة'
      : 'TASAMI Safety Solutions | Integrated Security & Safety';
  }, [lang]);

  const handleOpenConsultation = (serviceName = '') => {
    setSelectedServiceForConsultation(serviceName);
    setIsConsultationOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-${lang === 'ar' ? 'cairo' : 'sans'}`}>
      
      {/* Navigation Bar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        content={content}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Hero Section */}
      <Hero
        lang={lang}
        content={content}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* About Us & Vision 2030 */}
      <AboutSection
        lang={lang}
        content={content}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Core Engineering Services */}
      <ServicesSection
        lang={lang}
        content={content}
        onSelectService={(serviceTitle) => handleOpenConsultation(serviceTitle)}
      />

      {/* Featured Projects Gallery */}
      <ProjectsSection
        lang={lang}
        content={content}
      />

      {/* Interactive Safety Calculator & Estimator */}
      <SafetyCalculator
        lang={lang}
        content={content}
        onSaveQuote={() => {}}
      />

      {/* Pre-Footer Banner & Direct Contact */}
      <ContactSection
        lang={lang}
        content={content}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Footer */}
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
