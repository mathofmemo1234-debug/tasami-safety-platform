import React, { useState, useEffect } from 'react';
import { FileCheck, Award, Landmark, FileText, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CertificatesLicensesSection({ lang, content }) {
  const t = content[lang].certificationsAndLicenses;
  const isAr = lang === 'ar';
  const [previewItem, setPreviewItem] = useState(null);
  const [docIndex, setDocIndex] = useState(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setPreviewItem(null);
        setDocIndex(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const openDocument = (idx) => {
    setDocIndex(idx);
    const d = t.legalDocuments[idx];
    setPreviewItem({
      image: d.image,
      title: d.title,
      subtitle: d.authority,
      note: d.note
    });
  };

  const stepDoc = (dir) => {
    if (docIndex === null) return;
    const total = t.legalDocuments.length;
    const next = (docIndex + dir + total) % total;
    openDocument(next);
  };

  return (
    <section id="licenses" className="py-12 bg-white dark:bg-[#0b1120] relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* 1. Global Product Certifications Showcase */}
        <div className="mb-14">
          <h3 className="text-lg font-bold text-[#0f172a] dark:text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#c59a45]" />
            <span>{isAr ? 'الاعتمادات ومطابقة المعايير الدولية' : 'Global Standards & Accreditations'}</span>
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

                {cert.image && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    <button
                      onClick={() => {
                        setDocIndex(null);
                        setPreviewItem({
                          image: cert.image,
                          title: cert.name,
                          subtitle: cert.desc,
                          note: isAr ? 'اعتماد دولي ومحلي لمستلزمات السلامة' : 'Official product safety accreditation'
                        });
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#162d6c]/10 dark:bg-[#1d4ed8]/25 hover:bg-[#c59a45] text-[#162d6c] dark:text-[#93c5fd] hover:text-[#0b1120] text-xs font-bold transition whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? 'عرض الشعار' : 'View Seal'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Official Statutory Government Licenses & Documents (الأوراق الثبوتية والتراخيص) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#1d4ed8] dark:text-[#60a5fa]" />
              <span>{isAr ? 'الأوراق الثبوتية والتراخيص الحكومية الرسمية' : 'Official Statutory Registrations & Operating Licenses'}</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isAr ? 'اضغط «عرض الوثيقة» لمعاينة أي شهادة أو ترخيص دون مغادرة الصفحة' : 'Click "View Document" to preview any official certificate'}
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
                      {isAr ? 'سارٍ وموثق ✓' : 'Verified ✓'}
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

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {doc.note}
                  </span>
                  {doc.image && (
                    <button
                      onClick={() => openDocument(idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#162d6c]/10 dark:bg-[#1d4ed8]/25 hover:bg-[#c59a45] text-[#162d6c] dark:text-[#93c5fd] hover:text-[#0b1120] text-[11px] font-bold transition flex-shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? 'عرض الوثيقة' : 'View'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Document / Seal Lightbox Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={() => { setPreviewItem(null); setDocIndex(null); }}
        >
          <div
            className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm sm:text-base text-[#0f172a] dark:text-white">
                  {previewItem.title}
                </h3>
                {previewItem.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {previewItem.subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={() => { setPreviewItem(null); setDocIndex(null); }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-100 dark:bg-[#0b1120] p-4 flex items-center justify-center max-h-[72vh] overflow-auto">
              <img
                src={previewItem.image}
                alt={previewItem.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-md bg-white p-2"
              />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-[#131c31]">
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {previewItem.note}
              </span>
              {docIndex !== null && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => stepDoc(-1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <ChevronRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
                    <span>{isAr ? 'السابق' : 'Prev'}</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1">
                    {docIndex + 1} / {t.legalDocuments.length}
                  </span>
                  <button
                    onClick={() => stepDoc(1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#162d6c] dark:bg-[#1d4ed8] text-white text-xs font-bold hover:opacity-90 transition"
                  >
                    <span>{isAr ? 'التالي' : 'Next'}</span>
                    <ChevronLeft className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
