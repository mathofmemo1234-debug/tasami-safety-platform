import React, { useState } from 'react';
import {
  Package,
  Search,
  Check,
  Play,
  X,
  ExternalLink,
  ShieldCheck,
  Video,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import TasamiLogo from '../components/TasamiLogo';

export default function ProductsPage({
  lang,
  content,
  onNavigate,
  onOpenConsultation
}) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const t = content[lang].productsCatalog;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);

  const categories = t.categories || [
    { id: 'all', name: isAr ? 'جميع المنتجات والمعدات' : 'All Products' },
    { id: 'networks', name: isAr ? 'شبكات الأنابيب والرشاشات' : 'Piping & Sprinklers' },
    { id: 'alarms', name: isAr ? 'أنظمة الإنذار والكواشف' : 'Alarms & Detectors' },
    { id: 'valves', name: isAr ? 'المحابس وصناديق الحريق' : 'Valves & Hose Cabinets' },
    { id: 'suppression', name: isAr ? 'أنظمة الإخماد التلقائي' : 'Clean Suppression' },
    { id: 'pumps', name: isAr ? 'مضخات الحريق والمراوح' : 'Pumps & Fans' },
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
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* 1. Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#c59a45] transition"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#c59a45]">{isAr ? 'منتجاتنا' : 'Products'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <TasamiLogo lang={lang} className="h-10 sm:h-12" />
              <span className="text-xs font-bold text-[#c59a45] tracking-widest uppercase bg-[#c59a45]/10 px-3 py-1 rounded-md inline-block">
                {isAr ? 'توريدات وأنظمة معتمدة' : 'Certified Procurement'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              {isAr ? 'كتالوج المنتجات ومعدات السلامة ومكافحة الحريق' : 'Fire Safety Products & Equipment Catalog'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isAr
                ? 'توريد موثوق ومباشر لكبرى المشاريع والمنشآت في المملكة، مصحوب بشهادات الجودة والمطابقة ومقاطع توضيحية لطريقة التنفيذ.'
                : 'Direct certified procurement for kingdom-wide infrastructure with complete test certificates and installation guides.'}
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => onOpenConsultation(isAr ? 'طلب تسعير كميات وتوريدات عامة' : 'General Bulk Procurement Quote')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#c59a45] hover:bg-[#dfb76c] text-slate-950 text-xs sm:text-sm font-bold transition shadow-sm"
            >
              <span>{isAr ? 'طلب تسعير كميات أو مناقصة' : 'Request Bulk Quote'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-branches & Search Filter */}
      <div className="space-y-6">
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4" />
          <input
            type="text"
            placeholder={isAr ? 'ابحث عن اسم المنتج، الرشاشات، المحابس، أجهزة الإنذار، المواصفات...' : 'Search products, sprinklers, valves, detectors...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-12 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#c59a45] shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-4 ltr:right-4 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sub-branch Categories (Tafree'at) */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            {isAr ? 'تفريعات وأقسام المنتجات:' : 'Product Sub-Categories:'}
          </div>
          <div className="flex items-center justify-start sm:justify-center flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#c59a45] text-slate-950 shadow-sm scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#c59a45]/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            {/* Image */}
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
              
              {/* Specs Badge */}
              {item.specs && (
                <div className="absolute top-3 right-3 rtl:right-3 ltr:left-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-amber-300 font-bold border border-white/10 font-mono">
                  {item.specs}
                </div>
              )}

              {/* Video Play Badge */}
              {item.videoId && (
                <button
                  onClick={() =>
                    setActiveVideo({
                      videoId: item.videoId,
                      title: isAr ? (item.videoTitle || item.ar) : (item.videoTitleEn || item.en),
                      productName: isAr ? item.ar : item.en,
                    })
                  }
                  className="absolute bottom-3 right-3 rtl:right-3 ltr:left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-lg transition transform hover:scale-105"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isAr ? 'فيديو التركيب' : 'Watch Video'}</span>
                </button>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-slate-400 uppercase">
                  <span>{item.en}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10px]">
                    <Check className="w-3 h-3" />
                    <span>{isAr ? 'معتمد' : 'Certified'}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-800 group-hover:text-[#c59a45] transition mb-2">
                  {isAr ? item.ar : item.en}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {item.videoId ? (
                  <button
                    onClick={() =>
                      setActiveVideo({
                        videoId: item.videoId,
                        title: isAr ? (item.videoTitle || item.ar) : (item.videoTitleEn || item.en),
                        productName: isAr ? item.ar : item.en,
                      })
                    }
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{isAr ? 'طريقة التركيب' : 'Install Guide'}</span>
                  </button>
                ) : <div />}

                <button
                  onClick={() => onOpenConsultation(isAr ? `طلب تسعير منتج: ${item.ar}` : `Supply inquiry for: ${item.en}`)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#c59a45]/15 hover:bg-[#c59a45] text-[#9a752a] hover:text-slate-950 text-xs font-bold transition"
                >
                  {isAr ? 'طلب تسعير' : 'Get Quote'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">
            {isAr ? 'لا توجد منتجات مطابقة لعملية البحث الحالية.' : 'No products found matching your search.'}
          </p>
          <button
            onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
            className="mt-3 text-xs text-[#c59a45] font-bold underline"
          >
            {isAr ? 'إعادة ضبط البحث والتصنيفات' : 'Reset search & filters'}
          </button>
        </div>
      )}

      {/* 4. Quality Certifications Strip */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-center">
        <div className="text-xs font-bold text-slate-700">
          {isAr ? 'شهادات اعتماد وجودة المنتجات الموردة:' : 'Procurement Statutory Certifications:'}
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-sm">
          سابر (SABER)
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-sm font-mono">
          UL LISTED
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-sm font-mono">
          FM APPROVED
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-sm font-mono">
          LPCB CERTIFIED
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-red-500" />
                <span>{activeVideo.title}</span>
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-slate-950 text-right rtl:text-right ltr:text-left flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {isAr ? 'شرح هندسي لطريقة التركيب والاختبار الفني' : 'Technical video guide'}
              </span>
              <button
                onClick={() => {
                  const pName = activeVideo.productName;
                  setActiveVideo(null);
                  onOpenConsultation(isAr ? `استفسار عن تركيب ${pName}` : `Inquiry for ${pName}`);
                }}
                className="px-4 py-2 rounded-xl bg-[#c59a45] text-slate-950 text-xs font-bold hover:bg-[#dfb76c] transition"
              >
                {isAr ? 'طلب توريد وتركيب' : 'Inquire for Installation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
