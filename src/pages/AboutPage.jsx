import React from 'react';
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
  onOpenConsultation
}) {
  const isAr = lang === 'ar';

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#c59a45] transition"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#c59a45]">{isAr ? 'عن الشركة' : 'About Us'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TasamiLogo lang={lang} className="h-10 sm:h-12" />
              <span className="text-xs font-bold text-[#c59a45] tracking-widest uppercase bg-[#c59a45]/10 px-3 py-1 rounded-md inline-block">
                {isAr ? 'الريادة المؤسسية' : 'Corporate Leadership'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              {isAr ? 'عن تسامي الأعمال لأنظمة السلامة' : 'About Tasami Business for Safety Systems'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isAr
                ? 'تعرف على هويتنا، رؤيتنا، رسالتنا، وهيكل العمل الاحترافي الذي يقودنا نحو تحقيق أعلى معايير الأمان وحماية الأرواح والممتلكات.'
                : 'Discover our corporate vision, leadership, and certified team driving excellence in fire safety.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Company Story & Background */}
      <AboutSection
        lang={lang}
        content={content}
        onOpenConsultation={onOpenConsultation}
      />

      {/* 3. Executive CEO Message */}
      <CeoMessage
        lang={lang}
        content={content}
      />

      {/* 4. Vision, Mission & Core Values */}
      <VisionMissionValues
        lang={lang}
        content={content}
      />

      {/* 5. Organizational Structure */}
      <OrgStructureSection
        lang={lang}
        content={content}
      />

      {/* 6. Accreditations & Licenses */}
      <CertificatesLicensesSection
        lang={lang}
        content={content}
      />

      {/* 7. Featured Projects */}
      <ProjectsSection
        lang={lang}
        content={content}
      />

    </div>
  );
}
