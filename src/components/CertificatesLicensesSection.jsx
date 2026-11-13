import React from 'react';
import { ShieldCheck, FileCheck, Award, Building, Landmark, CheckCircle, ExternalLink, FileText } from 'lucide-react';

export default function CertificatesLicensesSection({ lang, content }) {
  const t = content[lang].certificationsAndLicenses;

  return (
    <section id="licenses" className="py-16 bg-white dark:bg-[#0b1120] relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black tracking-widest text-[#9a752a] dark:text-[#dfb76c] uppercase bg-[#c59a45]/15 border border-[#c59a45]/30 px-3.5 py-1 rounded-md inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {t.subtitle}
          </p>
        </div>

        {/* 1. Global Product Certifications Showcase */}
        <div className="mb-14">
          <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#c59a45]" />
            <span>{lang === 'ar' ? 'الاعتمادات ومطابقة المعايير الدولية' : 'Global Standards & Accreditations'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#131c31] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#c59a45] shadow-sm hover:shadow-md transition-all duration-200 text-center flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-[#1d4ed8]/20 border border-[#1d4ed8]/20 flex items-center justify-center text-[#1d4ed8] dark:text-[#60a5fa] font-black text-lg mb-4 font-mono shadow-sm">
                    {cert.name.split(' ')[0]}
                  </div>
                  <h4 className="font-black text-base text-[#0f172a] dark:text-white mb-2">
                    {cert.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {cert.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>معتمد رسمياً للمشاريع</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Official Statutory Government Licenses & Documents (الأوراق الثبوتية والتراخيص) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#1d4ed8] dark:text-[#60a5fa]" />
              <span>{lang === 'ar' ? 'الأوراق الثبوتية والتراخيص الحكومية الرسمية' : 'Official Statutory Registrations & Operating Licenses'}</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'ar' ? 'جميع الوثائق سارية ومحققة لمعايير الحوكمة والامتثال' : 'All statutory documents verified and active'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.legalDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 hover:border-[#c59a45]/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-[#1d4ed8]/20 group-hover:bg-[#c59a45]/15 text-[#1d4ed8] dark:text-[#60a5fa] group-hover:text-[#9a752a] flex items-center justify-center transition-colors">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-700/50">
                      سارٍ وموثق ✓
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#0f172a] dark:text-white group-hover:text-[#1d4ed8] dark:group-hover:text-[#dfb76c] transition-colors mb-1">
                    {doc.title}
                  </h4>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Landmark className="w-3 h-3 text-[#c59a45]" />
                    <span>{doc.authority}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  {doc.note}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
