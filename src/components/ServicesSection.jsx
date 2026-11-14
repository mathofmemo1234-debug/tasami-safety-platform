import React, { useState } from 'react';
import { getParagraphStyle } from '../utils/typography';
import { Flame, ShieldAlert, GraduationCap, Compass, CheckSquare, Activity, ArrowLeft, ArrowRight, X, CheckCircle2 } from 'lucide-react';

export default function ServicesSection({ lang, content, onSelectService }) {
  const t = content[lang].services;
  const [selectedService, setSelectedService] = useState(null);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-7 h-7 text-amber-500" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-7 h-7 text-[#c59a45]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-7 h-7 text-emerald-600" />;
      case 'Compass':
        return <Compass className="w-7 h-7 text-blue-600" />;
      case 'CheckSquare':
        return <CheckSquare className="w-7 h-7 text-purple-600" />;
      case 'Activity':
        return <Activity className="w-7 h-7 text-rose-500" />;
      default:
        return <Flame className="w-7 h-7 text-[#c59a45]" />;
    }
  };

  const serviceImages = {
    'fire-safety': 'https://images.unsplash.com/photo-1599818497672-132d73f1d24c?auto=format&fit=crop&w=600&q=80',
    'risk-management': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    'training': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    'engineering': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    'compliance': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    'emergency': 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
  };

  return (
    <section id="services" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#c59a45]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 gap-4">
          <div className="space-y-3 flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="text-xs font-black tracking-widest text-[#dfb76c] uppercase bg-[#c59a45]/20 border border-[#c59a45]/30 px-3.5 py-1 rounded-md inline-block">
              {t.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t.title}
            </h2>
            <p className="w-full text-sm sm:text-base text-slate-400 max-w-2xl mx-auto" style={getParagraphStyle(content, lang, 'servicesCards')}>
              {t.subtitle}
            </p>
          </div>

          <a
            href="#calculator"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#dfb76c] hover:text-white transition group flex-shrink-0"
          >
            <span>{t.viewAll}</span>
            {lang === 'ar' ? (
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition" />
            ) : (
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            )}
          </a>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {t.items.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-[#c59a45]/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col group transform hover:-translate-y-1.5"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={serviceImages[service.id]}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                
                {/* English Subtitle pill */}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono tracking-widest text-[#dfb76c] uppercase border border-[#c59a45]/30">
                  {service.titleEn}
                </div>

                {/* Floating Icon */}
                <div className="absolute -bottom-4 right-6 w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 group-hover:border-[#c59a45] shadow-lg flex items-center justify-center transition-colors">
                  {getIcon(service.icon)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 pt-7 flex-1 flex flex-col justify-between text-center">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#dfb76c] transition-colors">
                    {service.title}
                  </h3>
                  <p className="w-full text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed line-clamp-3" style={getParagraphStyle(content, lang, 'servicesCards')}>
                    {service.shortDesc}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-[#dfb76c]">
                  <span>{lang === 'ar' ? 'التفاصيل والاشتراطات' : 'Details & Specs'}</span>
                  <div className="w-7 h-7 rounded-full bg-[#c59a45]/20 flex items-center justify-center group-hover:bg-[#c59a45] group-hover:text-slate-900 transition-colors">
                    {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-white relative shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#c59a45]/20 border border-[#c59a45]/40 flex items-center justify-center">
                {getIcon(selectedService.icon)}
              </div>
              <div>
                <span className="text-xs font-mono text-[#dfb76c] uppercase tracking-wider">
                  {selectedService.titleEn}
                </span>
                <h3 className="text-2xl font-black text-white">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mt-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              {selectedService.fullDesc}
            </p>

            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfb76c] mb-3">
                {lang === 'ar' ? 'المزايا والاعتمادات الرئيسية:' : 'Key Advantages & Approvals:'}
              </h4>
              <ul className="space-y-2.5">
                {selectedService.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700 flex flex-wrap gap-4 justify-end">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
              <button
                onClick={() => {
                  const serviceName = selectedService.title;
                  setSelectedService(null);
                  onSelectService(serviceName);
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#c59a45] hover:bg-[#b58a38] transition shadow-md"
              >
                {lang === 'ar' ? 'طلب هذه الخدمة الآن' : 'Request this Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
