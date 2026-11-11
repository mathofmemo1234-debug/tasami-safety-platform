import React from 'react';
import ContactSection from '../components/ContactSection';

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
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#c59a45] transition"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#c59a45]">{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#c59a45] tracking-widest uppercase bg-[#c59a45]/10 px-3 py-1 rounded-md inline-block">
              {isAr ? 'خدمة العملاء والاستشارات' : 'Customer Support & Inquiries'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              {isAr ? 'تواصل مع فريق تسامي الأعمال' : 'Contact Tasami Business'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isAr
                ? 'يسعدنا الرد على استفساراتكم الهندسية، استقبال طلبات التسعير، وتحديد مواعيد المعاينات الميدانية لمشاريعكم.'
                : 'We are delighted to assist with your engineering queries, quotation requests, and site inspections.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Contact Section Component */}
      <ContactSection
        lang={lang}
        content={content}
        onOpenConsultation={onOpenConsultation}
      />
    </div>
  );
}
