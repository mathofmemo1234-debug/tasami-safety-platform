import React, { useState } from 'react';
import {
  Package,
  ShieldCheck,
  Check,
  Sparkles,
  Search,
  Play,
  X,
  ExternalLink,
  Box,
  Layers,
  Wrench,
  Video
} from 'lucide-react';

export default function ProductsCatalogSection({ lang, content, onSelectService }) {
  const t = content[lang].productsCatalog;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);

  const categories = t.categories || [
    { id: 'all', name: lang === 'ar' ? 'جميع المنتجات' : 'All Products' },
    { id: 'networks', name: lang === 'ar' ? 'شبكات الأنابيب والرشاشات' : 'Piping & Sprinklers' },
    { id: 'alarms', name: lang === 'ar' ? 'أنظمة الإنذار والكواشف' : 'Alarms & Detectors' },
    { id: 'valves', name: lang === 'ar' ? 'المحابس وصناديق الحريق' : 'Valves & Hose Cabinets' },
    { id: 'suppression', name: lang === 'ar' ? 'أنظمة الإخماد التلقائي' : 'Clean Suppression' },
    { id: 'pumps', name: lang === 'ar' ? 'مضخات الحريق والمراوح' : 'Pumps & Fans' },
  ];

  const items = Array.isArray(t.items) ? t.items : [];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (item.ar && item.ar.toLowerCase().includes(q)) ||
      (item.en && item.en.toLowerCase().includes(q)) ||
      (item.desc && item.desc.toLowerCase().includes(q)) ||
      (item.specs && item.specs.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c59a45]/15 text-[#9a752a] text-xs font-black uppercase border border-[#c59a45]/30">
            <Package className="w-3.5 h-3.5 text-[#c59a45]" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {lang === 'ar'
              ? 'توريد موثوق ومباشر لكبرى المشاريع والمنشآت في المملكة مع فيديوهات شرح هندسية لطريقة التنفيذ والتركيب'
              : 'Certified procurement for major infrastructure projects with embedded direct engineering installation guides'}
          </p>
        </div>

        {/* Corporate Promise Banner */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1e1911] to-[#3a2d16] text-white shadow-xl relative overflow-hidden border border-[#c59a45]/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c59a45]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-right rtl:lg:text-right ltr:lg:text-left">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c59a45]/20 text-[#dfb76c] text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GUARANTEED CERTIFIED SUPPLY</span>
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
                onClick={() => onSelectService(lang === 'ar' ? 'طلب توريد كميات وأنظمة سلامة' : 'Bulk Safety Supply Request')}
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-[#dfb76c] hover:bg-white transition shadow-lg transform hover:-translate-y-0.5"
              >
                {lang === 'ar' ? 'طلب تسعير وتوريد كميات' : 'Request Bulk Supply Quote'}
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#c59a45] text-white shadow-md shadow-[#c59a45]/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث في المنتجات، الرشاشات، المحابس، أجهزة الإنذار...' : 'Search product lines, sprinklers, valves, alarms...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-12 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#c59a45] shadow-sm"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#c59a45]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group transform hover:-translate-y-1"
            >
              {/* Product Image with Video Play Badge */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={item.image || './images/product-1.jpg'}
                  alt={item.ar}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                
                {/* Specifications Pill */}
                {item.specs && (
                  <div className="absolute top-3 right-3 rtl:right-3 ltr:left-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-amber-300 font-bold border border-white/10 font-mono">
                    {item.specs}
                  </div>
                )}

                {/* Video Play Overlay Button */}
                {item.videoId && (
                  <button
                    onClick={() =>
                      setActiveVideo({
                        videoId: item.videoId,
                        title: lang === 'ar' ? (item.videoTitle || item.ar) : (item.videoTitleEn || item.en),
                        productName: lang === 'ar' ? item.ar : item.en,
                      })
                    }
                    className="absolute bottom-3 right-3 rtl:right-3 ltr:left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-lg transition transform hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === 'ar' ? 'فيديو التنفيذ' : 'Watch Video'}</span>
                  </button>
                )}
              </div>

              {/* Product Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-slate-400 uppercase">
                    <span>{item.en}</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10px]">
                      <Check className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'معتمد' : 'Certified'}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 group-hover:text-[#c59a45] transition-colors mb-2">
                    {lang === 'ar' ? item.ar : item.en}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {item.videoId ? (
                    <button
                      onClick={() =>
                        setActiveVideo({
                          videoId: item.videoId,
                          title: lang === 'ar' ? (item.videoTitle || item.ar) : (item.videoTitleEn || item.en),
                          productName: lang === 'ar' ? item.ar : item.en,
                        })
                      }
                      className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'طريقة التركيب' : 'Installation'}</span>
                    </button>
                  ) : <div></div>}

                  <button
                    onClick={() => onSelectService(lang === 'ar' ? `طلب تسعير ${item.ar}` : `Supply quote for ${item.en}`)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#c59a45]/15 hover:bg-[#c59a45] text-[#9a752a] hover:text-white text-xs font-bold transition"
                  >
                    {lang === 'ar' ? 'طلب تسعير' : 'Get Quote'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Certificates Badges Pill */}
        <div className="mt-14 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-center">
          <div className="text-xs font-black text-slate-800">
            {lang === 'ar' ? 'شهادات اعتماد وجودة المنتجات الموردة:' : 'Procurement Statutory Certifications:'}
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-black text-slate-800 shadow-sm">
            سابر (SABER)
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-black text-slate-800 shadow-sm font-mono">
            UL LISTED
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-black text-slate-800 shadow-sm font-mono">
            FM APPROVED
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-black text-slate-800 shadow-sm font-mono">
            LPCB CERTIFIED
          </div>
        </div>

      </div>

      {/* Embedded Direct YouTube Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-4 sm:p-6 relative shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {activeVideo.title}
                  </h3>
                </div>
                <p className="text-xs text-[#dfb76c] font-semibold mt-0.5">
                  {activeVideo.productName} — تسامي الأعمال لأنظمة السلامة
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold transition border border-red-500/30"
                  title="فتح في يوتيوب"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'يوتيوب' : 'YouTube'}</span>
                </a>

                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded 16:9 Video Player */}
            <div className="relative w-full pb-[56.25%] h-0 rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-800">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                {lang === 'ar'
                  ? 'يتم تنفيذ وتركيب كافة المنتجات بأيدي مهندسين معتمدين وفق كود البناء السعودي وترخيص الدفاع المدني.'
                  : 'All products are installed and commissioned strictly adhering to SBC and Civil Defense codes.'}
              </span>
              <button
                onClick={() => {
                  const prod = activeVideo.productName;
                  setActiveVideo(null);
                  onSelectService(lang === 'ar' ? `معاينة هندسية وتوريد وتركيب ${prod}` : `Site survey & supply for ${prod}`);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#c59a45] hover:bg-[#dfb76c] text-slate-950 font-black transition shadow-md whitespace-nowrap"
              >
                {lang === 'ar' ? 'طلب معاينة وتوريد لهذا المنتج' : 'Inquire & Request Site Survey'}
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
