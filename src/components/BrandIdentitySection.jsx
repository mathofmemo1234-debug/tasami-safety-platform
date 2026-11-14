import React, { useState } from 'react';
import { getParagraphStyle } from '../utils/typography';
import { Sparkles, Palette, Type, Award, Eye, X, CheckCircle2, FileText } from 'lucide-react';

export default function BrandIdentitySection({ lang, content }) {
  const isAr = lang === 'ar';
  const [modalOpen, setModalOpen] = useState(false);

  const colors = [
    { name: isAr ? 'الذهبي الملكي' : 'Royal Gold', hex: '#D4AF37', border: 'border-[#D4AF37]', desc: isAr ? 'رمز الفخامة والريادة والسلامة المعتمدة' : 'Symbol of excellence and premium safety' },
    { name: isAr ? 'الأسود الفحمي' : 'Charcoal Onyx', hex: '#2F2F2F', border: 'border-[#2F2F2F]', desc: isAr ? 'رمز الثقة والصلابة الهندسية والمصداقية' : 'Represents engineering strength and trust' },
    { name: isAr ? 'العاجي الفاخر' : 'Warm Cream', hex: '#F5E9D7', border: 'border-[#F5E9D7]', desc: isAr ? 'رمز الوضوح والنقاء والأناقة المعمارية' : 'Purity, architectural clarity and warmth' },
  ];

  const fonts = [
    { name: 'Cairo Bold', script: isAr ? 'الخط العربي الرسمي' : 'Official Arabic Font', sample: 'تسامي الأعمال لأنظمة السلامة • سلامتك أمانة' },
    { name: 'Montserrat', script: isAr ? 'الخط الإنجليزي الرسمي' : 'Official English Font', sample: 'TASAMI SAFETY SOLUTIONS • Certified Turnkey Engineering' },
  ];

  return (
    <section id="brand-identity" className="py-12 bg-white dark:bg-[#0b1120] relative scroll-mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c59a45]/10 dark:bg-[#c59a45]/20 text-[#9a752a] dark:text-[#dfb76c] text-xs font-extrabold border border-[#c59a45]/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'الهوية البصرية المؤسسية' : 'Corporate Brand Identity'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
              {isAr ? 'هوية تعكس التزامنا ببيئة أكثر أماناً' : 'A Brand Reflecting Uncompromising Safety'}
            </h2>
            <p className="w-full text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl mx-auto" style={getParagraphStyle(content, lang, 'brandIdentity')}>
              {isAr
                ? 'دليل الهوية البصرية الرسمية لشركة تسامي الأعمال لأنظمة السلامة: الألوان المعتمدة، الخطوط، ونماذج المطبوعات الرسمية.'
                : 'Official visual identity guidelines: primary colors, typography, corporate stationary, and certified brand elements.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn-flashy-royal inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm self-start md:self-auto"
          >
            <Eye className="w-4 h-4" />
            <span>{isAr ? 'معاينة دليل الهوية بالكامل' : 'View Full Brand Identity'}</span>
          </button>
        </div>

        {/* Brand Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visual Poster Card (Left/Main) */}
          <div className="lg:col-span-7">
            <div
              onClick={() => setModalOpen(true)}
              className="relative overflow-hidden rounded-3xl bg-slate-900 border border-[#c59a45]/40 p-2 shadow-xl group cursor-pointer hover:border-[#dfb76c] transition-all duration-300"
            >
              <img
                src="./الهويه.jfif"
                alt="دليل الهوية البصرية - شركة تسامي الأعمال لأنظمة السلامة"
                className="w-full h-[460px] object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500 filter contrast-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = './images/profile/visual-identity-1.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent rounded-2xl flex items-end p-6">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#dfb76c] uppercase block">BRAND IDENTITY MANUAL</span>
                    <h3 className="text-lg font-black text-white">
                      {isAr ? 'الملف التعريفي والمطبوعات الرسمية' : 'Corporate Profile & Official Collateral'}
                    </h3>
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-[#c59a45] text-slate-950 text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>{isAr ? 'اضغط للتكبير' : 'Enlarge'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Color & Typography Specs (Right) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Official Color Palette */}
            <div className="bg-slate-50 dark:bg-[#131c31] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-sm font-black text-[#0f172a] dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#c59a45]" />
                <span>{isAr ? 'الألوان الرئيسية المعتمدة (Primary Colors)' : 'Official Color Palette'}</span>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {colors.map((c, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#0b1120] p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                    <div
                      className="w-12 h-12 mx-auto rounded-xl shadow-inner mb-2 border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    ></div>
                    <div className="text-xs font-extrabold text-[#0f172a] dark:text-white">{c.name}</div>
                    <div className="text-[11px] font-mono font-bold text-[#c59a45] mt-0.5">{c.hex}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Official Typography */}
            <div className="bg-slate-50 dark:bg-[#131c31] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-sm font-black text-[#0f172a] dark:text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-[#1d4ed8] dark:text-[#60a5fa]" />
                <span>{isAr ? 'الخطوط المستخدمة (Typography)' : 'Official Typography'}</span>
              </h4>
              <div className="space-y-3">
                {fonts.map((f, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-[#1d4ed8] dark:text-[#dfb76c] font-sans">{f.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{f.script}</span>
                    </div>
                    <p className="w-full text-xs text-slate-700 dark:text-slate-300 font-bold truncate" style={getParagraphStyle(content, lang, 'brandIdentity')}>
                      {f.sample}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Core Values & Motto */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#162d6c]/10 to-[#c59a45]/10 dark:from-[#162d6c]/30 dark:to-[#c59a45]/20 border border-[#c59a45]/30">
              <div className="text-xs font-extrabold text-[#9a752a] dark:text-[#dfb76c] mb-1">
                {isAr ? 'شعارنا الدائم' : 'Corporate Motto'}
              </div>
              <div className="text-base font-black text-[#0f172a] dark:text-white">
                {isAr ? 'سلامتك أمانة • بيئة خالية تماماً من المخاطر' : 'Your Safety Is Our Trust • Hazard-Free Environment'}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                PEOPLE SAFETY • BUSINESS SUSTAINABILITY • FUTURE
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[92vh] bg-slate-900 rounded-3xl border border-[#c59a45]/40 overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#dfb76c]" />
                <span className="text-sm font-bold">
                  {isAr ? 'دليل الهوية البصرية الرسمية – شركة تسامي الأعمال لأنظمة السلامة' : 'Official Visual Identity Guidelines'}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-4 flex items-center justify-center bg-slate-950/60">
              <img
                src="./الهويه.jfif"
                alt="Brand Identity"
                className="max-h-[80vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
