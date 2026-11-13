import React, { useEffect } from 'react';
import {
  Quote,
  Eye,
  Compass,
  Award,
  Network,
  FolderKanban,
  FileCheck,
  ShieldCheck,
  Building2,
  Users,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import AboutSection from '../components/AboutSection';
import CeoMessage from '../components/CeoMessage';
import VisionMissionValues from '../components/VisionMissionValues';
import OrgStructureSection from '../components/OrgStructureSection';
import CertificatesLicensesSection from '../components/CertificatesLicensesSection';
import ProjectsSection from '../components/ProjectsSection';
import TasamiLogo from '../components/TasamiLogo';

export default function AboutPage({
  lang,
  content,
  onNavigate,
  onOpenConsultation,
  targetSection
}) {
  const isAr = lang === 'ar';

  // Smoothly scroll to the target section when navigating from dropdown
  useEffect(() => {
    if (targetSection) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetSection);
        if (el) {
          const headerOffset = 110;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [targetSection]);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] transition"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#c59a45] dark:text-[#dfb76c]">{isAr ? 'عن الشركة' : 'About Us'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Doubled Logo size */}
              <TasamiLogo lang={lang} className="h-16 sm:h-20 md:h-24" />
              <span className="text-xs font-bold text-[#9a752a] dark:text-[#dfb76c] tracking-widest uppercase bg-[#c59a45]/10 dark:bg-[#c59a45]/20 px-3.5 py-1.5 rounded-xl inline-block border border-[#c59a45]/30">
                {isAr ? 'الريادة المؤسسية' : 'Corporate Leadership'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white tracking-tight">
              {isAr ? 'عن تسامي الأعمال لأنظمة السلامة' : 'About Tasami Business for Safety Systems'}
            </h1>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isAr
                ? 'تعرف على هويتنا، رؤيتنا، رسالتنا، وهيكل العمل الاحترافي الذي يقودنا نحو تحقيق أعلى معايير الأمان وحماية الأرواح والممتلكات.'
                : 'Discover our corporate vision, leadership, and certified team driving excellence in fire safety.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Company Story & Background */}
      <div className="scroll-mt-28">
        <AboutSection
          lang={lang}
          content={content}
          onOpenConsultation={onOpenConsultation}
        />
      </div>

      {/* 3. Executive CEO Message */}
      <div className="scroll-mt-28">
        <CeoMessage
          lang={lang}
          content={content}
        />
      </div>

      {/* 4. Vision, Mission & Core Values */}
      <div className="scroll-mt-28">
        <VisionMissionValues
          lang={lang}
          content={content}
        />
      </div>

      {/* 5. Organizational Structure */}
      <div className="scroll-mt-28">
        <OrgStructureSection
          lang={lang}
          content={content}
        />
      </div>

      {/* 6. Accreditations & Licenses */}
      <div className="scroll-mt-28">
        <CertificatesLicensesSection
          lang={lang}
          content={content}
        />
      </div>

      {/* 7. Featured Projects */}
      <div className="scroll-mt-28">
        <ProjectsSection
          lang={lang}
          content={content}
        />
      </div>

    </div>
  );
}
