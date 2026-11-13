import React from 'react';
import { BellRing, Wind, Droplets, Flame, HardHat, Wrench, CheckCircle2, Shield, ArrowRight, ArrowLeft, Percent, BadgePercent } from 'lucide-react';

export default function ServicesDetailedSection({ lang, content, onSelectService }) {
  const t = content[lang].coreServices;

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'BellRing':
        return <BellRing className="w-6 h-6 text-amber-500" />;
      case 'Wind':
        return <Wind className="w-6 h-6 text-blue-500" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-cyan-500" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-rose-500" />;
      case 'HardHat':
        return <HardHat className="w-6 h-6 text-[#c59a45]" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-emerald-500" />;
      default:
        return <Shield className="w-6 h-6 text-[#c59a45]" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative lighting */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#c59a45]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black tracking-widest text-[#dfb76c] uppercase bg-[#c59a45]/20 border border-[#c59a45]/30 px-3.5 py-1 rounded-md inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* 1. Core Engineering Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {t.categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-800/90 border border-slate-700/80 hover:border-[#c59a45]/60 rounded-3xl p-7 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 group-hover:border-[#c59a45] flex items-center justify-center mb-5 transition-colors">
                  {getServiceIcon(cat.icon)}
                </div>

                <span className="text-[11px] font-bold text-[#dfb76c] tracking-wide block mb-1">
                  {cat.subtitle}
                </span>

                <h3 className="text-xl font-bold text-white group-hover:text-[#dfb76c] transition-colors mb-3">
                  {cat.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <button
                  onClick={() => onSelectService(cat.title)}
                  className="text-xs font-bold text-[#dfb76c] hover:text-white flex items-center gap-1.5 transition"
                >
                  <span>{lang === 'ar' ? 'طلب معاينة لهذا النظام' : 'Request Site Survey'}</span>
                  <span className={lang === 'ar' ? 'rotate-180' : ''}>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Structured Service Execution Matrix (جدول خدماتنا) */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#dfb76c]" />
                <span>{lang === 'ar' ? 'مصفوفة خدمات تسامي الشاملة' : 'Comprehensive Service Matrix'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'ar' ? 'خدمات احترافية متكاملة مدعومة بأفضل الأسعار وعروض خاصة للعملاء المميزين' : 'End-to-end turnkey services backed by competitive market pricing and VIP discounts'}
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#dfb76c] text-xs font-bold">
              <BadgePercent className="w-4 h-4" />
              <span>{lang === 'ar' ? 'خصم خاص للعملاء المميزين' : 'Special Corporate Discount'}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right rtl:text-right ltr:text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-[#dfb76c] font-bold">
                  <th className="py-3 px-4">{lang === 'ar' ? 'الخدمة' : 'Service'}</th>
                  <th className="py-3 px-4">{lang === 'ar' ? 'نطاق العمل والتنفيذ' : 'Scope & Delivery'}</th>
                  <th className="py-3 px-4 text-center">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {t.serviceTable.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/30 transition">
                    <td className="py-4 px-4 font-bold text-white whitespace-nowrap flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />
                      <span>{s.name}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-300 leading-relaxed">
                      {s.detail}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectService(s.name)}
                        className="px-3 py-1.5 rounded-lg bg-[#c59a45]/20 hover:bg-[#c59a45] text-[#dfb76c] hover:text-slate-900 font-bold text-xs transition"
                      >
                        {lang === 'ar' ? 'طلب الخدمة' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
