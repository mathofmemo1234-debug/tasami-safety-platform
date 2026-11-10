import React, { useState } from 'react';
import { Package, ShieldCheck, Check, Sparkles, Search, Layers, Box, Wrench, Shield, AlertCircle } from 'lucide-react';

export default function ProductsCatalogSection({ lang, content, onSelectService }) {
  const t = content[lang].productsCatalog;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = t.items.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.ar.toLowerCase().includes(q) ||
      item.en.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q)
    );
  });

  return (
    <section id="products" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black tracking-widest text-[#9a752a] uppercase bg-[#c59a45]/10 border border-[#c59a45]/20 px-3.5 py-1 rounded-md inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {lang === 'ar' ? 'توريد موثوق ومباشر لكبرى المشاريع والمنشآت في المملكة' : 'Certified procurement and supply for major infrastructure projects'}
          </p>
        </div>

        {/* The Bold Corporate Promise Banner */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1e1911] to-[#3a2d16] text-white shadow-xl relative overflow-hidden border border-[#c59a45]/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c59a45]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-right rtl:lg:text-right ltr:lg:text-left">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c59a45]/20 text-[#dfb76c] text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GUARANTEED SUPPLY CHAIN</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                "{t.promise}"
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {t.certificationNotice}
              </p>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => onSelectService(lang === 'ar' ? 'طلب توريد كميات' : 'Bulk Supply Request')}
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-[#dfb76c] hover:bg-white transition shadow-lg transform hover:-translate-y-0.5"
              >
                {lang === 'ar' ? 'طلب تسعير كميات وتوريد سريع' : 'Request Rapid Supply Quote'}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث في أصناف المنتجات والمواسير والمحابس...' : 'Search product lines, pipes, valves, alarms...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3.5 px-12 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#c59a45] focus:bg-white shadow-inner"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#c59a45]/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-50 group-hover:bg-[#c59a45] text-[#9a752a] group-hover:text-white flex items-center justify-center transition-colors">
                    <Box className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
                    {item.en}
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 group-hover:text-[#c59a45] transition-colors mb-1.5">
                  {item.ar}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>معتمد وجاهز للتوريد</span>
                </span>
                <button
                  onClick={() => onSelectService(`توريد ${item.ar}`)}
                  className="text-[#9a752a] hover:underline font-bold"
                >
                  طلب تسعير
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Certificates Badges Pill */}
        <div className="mt-14 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center">
          <div className="text-xs font-bold text-slate-700">شهادات الاعتماد للمنتجات:</div>
          <div className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-800 shadow-sm">
            سابر (SABER)
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-800 shadow-sm font-mono">
            UL LISTED
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-800 shadow-sm font-mono">
            FM APPROVED
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-800 shadow-sm font-mono">
            LPCB CERTIFIED
          </div>
        </div>

      </div>
    </section>
  );
}
