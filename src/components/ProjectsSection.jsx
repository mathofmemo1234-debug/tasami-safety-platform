import React, { useState } from 'react';
import { Building2, Factory, Landmark, MapPin, ArrowLeft, ArrowRight, Eye } from 'lucide-react';

export default function ProjectsSection({ lang, content }) {
  const t = content[lang].projects;
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems = activeFilter === 'all'
    ? t.items
    : t.items.filter((item) => item.category === activeFilter);

  const filterButtons = [
    { id: 'all', label: t.filterAll },
    { id: 'commercial', label: t.filterCommercial },
    { id: 'towers', label: t.filterTowers },
    { id: 'industrial', label: t.filterIndustrial },
  ];

  return (
    <section id="projects" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-black tracking-widest text-[#9a752a] uppercase bg-[#c59a45]/10 px-3.5 py-1 rounded-md inline-block">
              {t.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
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
                    ? 'bg-[#c59a45] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
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
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col transform hover:-translate-y-1"
            >
              {/* Project Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                {/* Location badge */}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-semibold flex items-center gap-1.5 border border-white/20">
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
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {project.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{project.stats}</span>
                  <div className="text-[#c59a45] font-bold flex items-center gap-1">
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
