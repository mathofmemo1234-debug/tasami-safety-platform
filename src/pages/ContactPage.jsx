import React from 'react';
import ContactSection from '../components/ContactSection';
import TasamiLogo from '../components/TasamiLogo';
import CustomParagraphSlot, { FormattedParagraph } from '../components/CustomParagraphSlot';

export default function ContactPage({
  lang,
  content,
  onNavigate,
  onOpenConsultation
}) {
  const isAr = lang === 'ar';

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
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
          <span className="text-[#c59a45] dark:text-[#dfb76c]">{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
        </div>

        <div className="flex flex-col items-center text-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-3 flex flex-col items-center w-full">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <TasamiLogo lang={lang} className="h-10 sm:h-12" />
              <span className="text-xs font-bold text-[#9a752a] dark:text-[#dfb76c] tracking-widest uppercase bg-[#c59a45]/10 dark:bg-[#c59a45]/20 px-3 py-1 rounded-md inline-block border border-[#c59a45]/25">
                {isAr ? 'خدمة العملاء والاستشارات' : 'Customer Support & Inquiries'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white tracking-tight">
              {isAr ? 'تواصل مع فريق تسامي الأعمال' : 'Contact Tasami Business'}
            </h1>
            <FormattedParagraph
              content={content}
              lang={lang}
              paraKey="contactHeader"
              className="w-full text-slate-700 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
              defaultText={isAr
                ? 'يسعدنا الرد على استفساراتكم الهندسية، استقبال طلبات التسعير، وتحديد مواعيد المعاينات الميدانية لمشاريعكم.'
                : 'We are delighted to assist with your engineering queries, quotation requests, and site inspections.'}
            />
          </div>
        </div>
      </div>

      <CustomParagraphSlot placement="contact:top" lang={lang} content={content} />

      {/* 2. Contact Section Component */}
      <ContactSection
        lang={lang}
        content={content}
        onOpenConsultation={onOpenConsultation}
      />

      <CustomParagraphSlot placement="contact:bottom" lang={lang} content={content} />
    </div>
  );
}
