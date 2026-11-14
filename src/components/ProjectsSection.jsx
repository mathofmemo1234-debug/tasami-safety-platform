import React, { useState } from 'react';
import { getParagraphStyle } from '../utils/typography';
import { Building2, Factory, Landmark, MapPin, ArrowLeft, ArrowRight, Eye } from 'lucide-react';

export default function ProjectsSection({ lang, content }) {
  const t = content?.[lang]?.projects || {};
  const [activeFilter, setActiveFilter] = useState('all');

  const items = Array.isArray(t.items) ? t.items : [];
  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter((item) => item.category === activeFilter);

  const filterButtons = [
    { id: 'all', label: t.filterAll || (lang === 'ar' ? 'جميع المشاريع' : 'All') },
    { id: 'commercial', label: t.filterCommercial || (lang === 'ar' ? 'مجمعات تجارية' : 'Commercial') },
    { id: 'towers', label: t.filterTowers || (lang === 'ar' ? 'أبراج' : 'Towers') },
    { id: 'industrial', label: t.filterIndustrial || (lang === 'ar' ? 'صناعية' : 'Industrial') },
  ];

  return (
    <section id="projects" className="py-16 bg-white dark:bg-[#0b1120] relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 gap-4">
          <div className="space-y-3 flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="text-xs font-black tracking-widest text-[#9a752a] dark:text-[#dfb76c] uppercase bg-[#c59a45]/10 dark:bg-[#c59a45]/20 px-3.5 py-1 rounded-md inline-block">
              {t.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight">
              {t.title}
            </h2>
            <p className="w-full text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto" style={getParagraphStyle(content, lang, 'projectsHeader')}>
              {t.subtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveFilter(btn.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === btn.id
                    ? 'bg-[#1d4ed8] text-white shadow-md ring-2 ring-[#c59a45]/50'
                    : 'bg-white dark:bg-[#131c31] text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-[#131c31] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-[#c59a45]/60 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col transform hover:-translate-y-1"
            >
              {/* Project Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120]/85 via-transparent to-transparent"></div>
                
                {/* Location badge */}
                <div className="absolute top-4 right-4 bg-[#162d6c]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-semibold flex items-center gap-1.5 border border-[#c59a45]/30">
                  <MapPin className="w-3.5 h-3.5 text-[#dfb76c]" />
                  <span>{project.location}</span>
                </div>

                {/* Scope pill on image bottom */}
                <div className="absolute bottom-4 right-4 left-4">
                  <span className="text-[11px] font-bold text-[#dfb76c] uppercase tracking-wider block">
                    {project.scope}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6 flex-1 flex flex-col justify-between text-center">
                <div>
                  <p className="w-full text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed" style={getParagraphStyle(content, lang, 'projectsHeader')}>
                    {project.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>{project.stats}</span>
                  <div className="text-[#9a752a] dark:text-[#dfb76c] font-bold flex items-center gap-1">
                    <span>مكتمل ومعتمد</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
