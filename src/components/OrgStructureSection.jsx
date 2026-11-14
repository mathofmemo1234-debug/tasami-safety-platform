import React, { useState } from 'react';
import { ShieldCheck, Image, X } from 'lucide-react';
import { getParagraphStyle } from '../utils/typography';

export default function OrgStructureSection({ lang, content }) {
  const t = content[lang].orgChart;
  const isAr = lang === 'ar';
  const [showOrgImage, setShowOrgImage] = useState(false);

  const ceoNode = t.nodes.find((n) => n.id === 'ceo');
  const departmentNodes = t.nodes.filter((n) => n.level === 2);

  return (
    <section id="org-chart" className="py-16 bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black tracking-widest text-[#9a752a] dark:text-[#dfb76c] uppercase bg-[#c59a45]/10 dark:bg-[#c59a45]/20 border border-[#c59a45]/25 px-3.5 py-1 rounded-md inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p
            style={getParagraphStyle(content, lang, 'orgChart')}
            className="w-full text-sm sm:text-base text-slate-600 dark:text-slate-300"
          >
            {t.subtitle}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setShowOrgImage(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0b1120] hover:bg-[#162d6c] dark:hover:bg-[#1d4ed8] text-[#162d6c] dark:text-[#dfb76c] hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold transition shadow-sm"
            >
              <Image className="w-4 h-4" />
              <span>{isAr ? 'عرض المخطط التنظيمي الرسمي (صورة)' : 'View Official Org Chart Image'}</span>
            </button>
          </div>
        </div>

        {/* Interactive / Visual Hierarchy Chart */}
        <div className="flex flex-col items-center">
          
          {/* Top Level: CEO Card */}
          <div className="w-full max-w-md bg-gradient-to-r from-[#0f2152] via-[#162d6c] to-[#0b1120] text-white p-6 rounded-3xl border-2 border-[#c59a45] shadow-2xl text-center relative group">
            <div className="w-16 h-16 rounded-2xl bg-[#c59a45] text-[#0b1120] mx-auto flex items-center justify-center font-black text-xl mb-3 shadow-lg">
              TH
            </div>
            <span className="text-[11px] font-mono tracking-widest text-[#dfb76c] uppercase block">
              EXECUTIVE LEADERSHIP
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              {ceoNode?.name}
            </h3>
            <p className="text-xs font-bold text-[#dfb76c] mt-0.5">
              {ceoNode?.role}
            </p>
            <p className="text-xs text-slate-200 mt-2">
              {ceoNode?.desc}
            </p>
          </div>

          {/* Connecting Vertical Stem */}
          <div className="w-0.5 h-10 bg-[#c59a45]"></div>

          {/* Horizontal Distribution Line */}
          <div className="hidden lg:block w-5/6 h-0.5 bg-slate-300 dark:bg-slate-700 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#c59a45]"></div>
          </div>

          {/* Secondary Level: 6 Operational Departments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
            {departmentNodes.map((dept, idx) => (
              <div
                key={dept.id}
                className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 hover:border-[#c59a45] rounded-2xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-[#1d4ed8]/10 dark:bg-[#1d4ed8]/25 border border-[#1d4ed8]/20 text-[#1d4ed8] dark:text-[#60a5fa] font-bold text-xs flex items-center justify-center font-mono">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">
                      Department
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-[#0f172a] dark:text-white group-hover:text-[#1d4ed8] dark:group-hover:text-[#dfb76c] transition-colors mb-1.5 text-center">
                    {dept.role}
                  </h4>
                  <p
                    style={getParagraphStyle(content, lang, 'orgChart')}
                    className="w-full text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                  >
                    {dept.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-[#9a752a] dark:text-[#dfb76c] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>فريق متخصص معتمد</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Official Org Chart Image Lightbox */}
      {showOrgImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowOrgImage(false)}
        >
          <div
            className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm sm:text-base text-[#0f172a] dark:text-white">
                {t.title}
              </h3>
              <button
                onClick={() => setShowOrgImage(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-100 dark:bg-[#0b1120] p-4 flex items-center justify-center max-h-[78vh] overflow-auto">
              <img
                src="./images/profile/org-chart.jpg"
                alt={t.title}
                className="max-h-[72vh] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
