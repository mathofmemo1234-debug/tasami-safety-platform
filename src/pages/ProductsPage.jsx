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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  Image as ImageIcon
} from 'lucide-react';
import TasamiLogo from '../components/TasamiLogo';
import CustomParagraphSlot, { FormattedParagraph } from '../components/CustomParagraphSlot';
import InlineVideoPlayer from '../components/InlineVideoPlayer';
import ProductGalleryModal from '../components/ProductGalleryModal';
import { getParagraphStyle } from '../utils/typography';
import {
  getProductImages,
  resolveProductVideoSource,
  normalizeWhatsAppDigits
} from '../utils/media';

function ProductCard({
  item,
  isAr,
  whatsappNumber,
  content,
  lang,
  onOpenGallery,
  onOpenConsultation
}) {
  const images = getProductImages(item);
  const videoSource = resolveProductVideoSource(item);
  const [angleIdx, setAngleIdx] = useState(0);
  const [playingInline, setPlayingInline] = useState(false);

  const safeAngleIdx = Math.min(angleIdx, images.length - 1);
  const title = isAr ? item.ar : item.en;
  const altTitle = isAr ? item.en : item.ar;
  const videoTitle = isAr ? (item.videoTitle || item.ar) : (item.videoTitleEn || item.en);

  const waHref = `https://wa.me/${normalizeWhatsAppDigits(whatsappNumber)}?text=${encodeURIComponent(
    isAr
      ? `السلام عليكم، أستفسر عن المنتج: ${item.ar}`
      : `Hello, inquiry regarding product: ${item.en}`
  )}`;

  return (
    <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#c59a45]/70 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Main Media Stage: Multi-Angle Photos OR Inline Video Player inside the Page */}
      <div>
        <div className="relative h-52 bg-gradient-to-b from-slate-100 to-slate-200/70 dark:from-[#0b1120] dark:to-[#131c31] overflow-hidden">
          {playingInline && videoSource ? (
            <div className="w-full h-full relative">
              <InlineVideoPlayer
                source={videoSource}
                title={videoTitle}
                poster={images[0]}
                autoplay={true}
                isAr={isAr}
                className="w-full h-full"
              />
              <button
                type="button"
                onClick={() => setPlayingInline(false)}
                className="absolute top-2 right-2 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 hover:bg-black text-white text-[10px] font-bold backdrop-blur-sm transition"
              >
                <ImageIcon className="w-3 h-3" />
                <span>{isAr ? 'العودة للصور' : 'Photos'}</span>
              </button>
            </div>
          ) : (
            <>
              <img
                src={images[safeAngleIdx]}
                alt={`${title} - ${isAr ? 'زاوية' : 'Angle'} ${safeAngleIdx + 1}`}
                onClick={() => onOpenGallery(item, 'images', safeAngleIdx)}
                className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = './images/product-1.jpg';
                }}
              />

              {/* Expand Full Studio Gallery Button */}
              <button
                type="button"
                onClick={() => onOpenGallery(item, 'images', safeAngleIdx)}
                title={isAr ? 'معرض الزوايا المكبر' : 'Open Multi-Angle Gallery'}
                className={`absolute top-2.5 ${
                  isAr ? 'left-2.5' : 'right-2.5'
                } w-8 h-8 rounded-full bg-white/90 dark:bg-[#131c31]/90 text-slate-700 dark:text-white shadow border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:scale-105 transition`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Angle Switch Arrows when multiple angles exist */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAngleIdx((prev) => (prev - 1 + images.length) % images.length);
                    }}
                    aria-label={isAr ? 'الزاوية السابقة' : 'Previous angle'}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 dark:bg-[#131c31]/90 text-slate-800 dark:text-white shadow flex items-center justify-center opacity-85 hover:opacity-100 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAngleIdx((prev) => (prev + 1) % images.length);
                    }}
                    aria-label={isAr ? 'الزاوية التالية' : 'Next angle'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 dark:bg-[#131c31]/90 text-slate-800 dark:text-white shadow flex items-center justify-center opacity-85 hover:opacity-100 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Inline Video Play Badge */}
              {videoSource && (
                <button
                  type="button"
                  onClick={() => setPlayingInline(true)}
                  className="absolute bottom-2.5 right-2.5 rtl:right-2.5 ltr:left-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-lg transition transform hover:scale-105"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isAr ? 'تشغيل الفيديو' : 'Play Video'}</span>
                </button>
              )}

              {/* Multi-Angle Count Pill */}
              {images.length > 1 && (
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/65 text-white text-[10px] font-bold backdrop-blur-sm">
                  {safeAngleIdx + 1} / {images.length}
                </span>
              )}
            </>
          )}
        </div>

        {/* Multi-Angle Thumbnail Strip (Matches Attached Studio Reference) */}
        {(images.length > 1 || videoSource) && (
          <div className="px-3 py-2 bg-slate-50 dark:bg-[#0b1120]/70 border-y border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto">
            {images.map((imgUrl, aIdx) => (
              <button
                key={`${imgUrl}_${aIdx}`}
                type="button"
                onClick={() => {
                  setPlayingInline(false);
                  setAngleIdx(aIdx);
                }}
                className={`shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition ${
                  !playingInline && safeAngleIdx === aIdx
                    ? 'border-[#113163] dark:border-[#c59a45] ring-1 ring-[#c59a45]/40'
                    : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = './images/product-1.jpg';
                  }}
                />
              </button>
            ))}

            {videoSource && (
              <button
                type="button"
                onClick={() => setPlayingInline((p) => !p)}
                title={isAr ? 'تشغيل الفيديو داخل البطاقة' : 'Play video inline'}
                className={`shrink-0 h-10 px-2 rounded-lg border-2 flex items-center justify-center gap-1 text-[10px] font-black transition ${
                  playingInline
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isAr ? 'فيديو' : 'Video'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#0f172a] dark:text-white leading-snug">
            {title}
          </h3>
          {altTitle && (
            <p className="text-[11px] font-semibold text-[#9c7224] dark:text-[#dfb76c] mt-0.5">
              {altTitle}
            </p>
          )}
          <p
            style={getParagraphStyle(content, lang, 'productsCards')}
            className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3"
          >
            {item.desc}
          </p>
          {item.specs && (
            <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/70 text-[10px] font-bold text-[#113163] dark:text-slate-200">
              <ShieldCheck className="w-3 h-3 text-[#c59a45] shrink-0" />
              <span>{item.specs}</span>
            </div>
          )}
        </div>

        {/* Action Row: Inline Video / Expand Gallery / WhatsApp / Consultation */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {videoSource && (
              <button
                type="button"
                onClick={() => setPlayingInline((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/70 text-red-700 dark:text-red-300 text-[11px] font-bold transition"
              >
                <Video className="w-3.5 h-3.5" />
                <span>
                  {playingInline
                    ? isAr
                      ? 'إيقاف'
                      : 'Stop'
                    : isAr
                    ? 'تشغيل بالصفحة'
                    : 'Play Inline'}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenGallery(item, playingInline ? 'video' : 'images', safeAngleIdx)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition"
            >
              <Maximize2 className="w-3 h-3" />
              <span>{isAr ? 'الزوايا' : 'Gallery'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              title={isAr ? 'اطلب عبر واتس آب' : 'Order via WhatsApp'}
              className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => onOpenConsultation?.(title)}
              className="px-3 py-1.5 rounded-lg bg-[#113163] hover:bg-[#0d274e] text-white text-[11px] font-bold transition"
            >
              {isAr ? 'طلب سعر' : 'Quote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage({
  lang,
  content,
  onNavigate,
  onOpenConsultation
}) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const t = content[lang].productsCatalog;
  const whatsappNumber = content?.[lang]?.contact?.whatsapp || content?.[lang]?.contact?.phone1 || '966591684133';
  const [searchTerm, setSearchTerm] = useState('');
  const [galleryModalState, setGalleryModalState] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);
  const [showBrandsModal, setShowBrandsModal] = useState(false);

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
    <div className="relative overflow-hidden">
      {/* Full-Page Subtle Brand Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.12] dark:opacity-[0.16]"
        style={{ backgroundImage: "url('./images/tasami-products-bg.jpg')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-white/80 via-white/70 to-slate-50/90 dark:from-[#0b1120]/85 dark:via-[#0b1120]/75 dark:to-[#0b1120]/95"
      />

      <div className="relative z-10 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* 1. Breadcrumb & Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] transition"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#c59a45] dark:text-[#dfb76c]">{isAr ? 'منتجاتنا' : 'Products'}</span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#c59a45]/30 dark:border-[#c59a45]/25 bg-white/85 dark:bg-[#131c31]/85 backdrop-blur-md shadow-md p-6 sm:p-8">
          <img
            src="./images/tasami-products-bg.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-[center_42%] opacity-25 dark:opacity-30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-white/50 rtl:bg-gradient-to-l ltr:bg-gradient-to-r dark:from-[#0b1120]/95 dark:via-[#0b1120]/80 dark:to-[#131c31]/55"
          />

          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <div className="space-y-3 flex flex-col items-center w-full">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <TasamiLogo lang={lang} className="h-10 sm:h-12" />
                <span className="text-xs font-bold text-[#9a752a] dark:text-[#dfb76c] tracking-widest uppercase bg-[#c59a45]/10 dark:bg-[#c59a45]/20 px-3 py-1 rounded-md inline-block border border-[#c59a45]/25">
                  {isAr ? 'توريدات وأنظمة معتمدة' : 'Certified Procurement'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white tracking-tight">
                {isAr ? 'كتالوج المنتجات ومعدات السلامة ومكافحة الحريق' : 'Fire Safety Products & Equipment Catalog'}
              </h1>
              <FormattedParagraph
                content={content}
                lang={lang}
                paraKey="productsHeader"
                className="w-full text-slate-700 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
                defaultText={isAr
                  ? 'توريد موثوق ومباشر لكبرى المشاريع والمنشآت في المملكة، مصحوب بشهادات الجودة والمطابقة ومقاطع توضيحية لطريقة التنفيذ.'
                  : 'Direct certified procurement for kingdom-wide infrastructure with complete test certificates and installation guides.'}
              />
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => onOpenConsultation(isAr ? 'طلب تسعير كميات وتوريدات عامة' : 'General Bulk Procurement Quote')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#c59a45] hover:bg-[#dfb76c] text-[#0b1120] text-xs sm:text-sm font-bold transition shadow-sm"
              >
                <span>{isAr ? 'طلب تسعير كميات أو مناقصة' : 'Request Bulk Quote'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CustomParagraphSlot placement="products:top" lang={lang} content={content} />

      {/* 2. Sub-branches & Search Filter */}
      <div className="space-y-6">
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <Search className="w-5 h-5 text-[#1d4ed8] dark:text-[#60a5fa] absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4" />
          <input
            type="text"
            placeholder={isAr ? 'ابحث عن اسم المنتج، الرشاشات، المحابس، أجهزة الإنذار، المواصفات...' : 'Search products, sprinklers, valves, detectors...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1d4ed8] dark:focus:border-[#c59a45] shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-4 ltr:right-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sub-branch Categories (Tafree'at) */}
        <div className="text-center">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            {isAr ? 'تفريعات وأقسام المنتجات:' : 'Product Sub-Categories:'}
          </div>
          <div className="flex items-center justify-center flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#1d4ed8] text-white shadow-sm scale-105 ring-2 ring-[#c59a45]/60'
                    : 'bg-white dark:bg-[#131c31] text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <CustomParagraphSlot placement="products:beforeGrid" lang={lang} content={content} />

      {/* 3. Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => (
          <ProductCard
            key={item.id || idx}
            item={item}
            isAr={isAr}
            whatsappNumber={whatsappNumber}
            content={content}
            lang={lang}
            onOpenConsultation={onOpenConsultation}
            onOpenGallery={(product, mode, angleIndex) =>
              setGalleryModalState({ product, mode, angleIndex })
            }
          />
        ))}
      </div>

      {galleryModalState && (
        <ProductGalleryModal
          product={galleryModalState.product}
          initialMode={galleryModalState.mode}
          initialAngleIndex={galleryModalState.angleIndex}
          isAr={isAr}
          whatsappNumber={whatsappNumber}
          onClose={() => setGalleryModalState(null)}
          onInquiry={(productTitle) => onOpenConsultation?.(productTitle)}
        />
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            {isAr ? 'لا توجد منتجات مطابقة لعملية البحث الحالية.' : 'No products found matching your search.'}
          </p>
          <button
            onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
            className="mt-3 text-xs text-[#1d4ed8] dark:text-[#dfb76c] font-bold underline"
          >
            {isAr ? 'إعادة ضبط البحث والتصنيفات' : 'Reset search & filters'}
          </button>
        </div>
      )}

      <CustomParagraphSlot placement="products:afterGrid" lang={lang} content={content} />

      {/* 4. Quality Certifications Strip & Partner Brands Trigger */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-center">
        <div className="text-xs font-bold text-[#0f172a] dark:text-slate-200">
          {isAr ? 'شهادات اعتماد وجودة المنتجات الموردة:' : 'Procurement Statutory Certifications:'}
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#162d6c] dark:text-slate-200 shadow-sm">
          سابر (SABER)
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#162d6c] dark:text-slate-200 shadow-sm font-mono">
          UL LISTED
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#162d6c] dark:text-slate-200 shadow-sm font-mono">
          FM APPROVED
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#162d6c] dark:text-slate-200 shadow-sm font-mono">
          LPCB CERTIFIED
        </div>
        <button
          onClick={() => setShowBrandsModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#162d6c] hover:bg-[#1d4ed8] text-white text-xs font-bold transition shadow-sm border border-[#c59a45]/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#dfb76c]" />
          <span>{isAr ? 'استعراض البراندات والعلامات التجارية المعتمدة' : 'View Certified Product Brands'}</span>
        </button>
      </div>

      {/* Partner Brands & Accreditations Lightbox Modal */}
      {showBrandsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowBrandsModal(false)}
        >
          <div
            className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#0f172a] dark:text-white">
                  {isAr ? 'البراندات العالمية والاعتمادات الموردة' : 'Certified Global Brands & Accreditations'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'نورّد نخبة العلامات التجارية العالمية المعتمدة في أنظمة السلامة ومكافحة الحريق' : 'Authorized supply of globally certified fire protection and alarm brands'}
                </p>
              </div>
              <button
                onClick={() => setShowBrandsModal(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 bg-slate-50 dark:bg-[#0b1120]">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#9a752a] dark:text-[#dfb76c] mb-3">
                  {isAr ? 'البراندات (العلامات التجارية للمنتجات)' : 'Product Partner Brands'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['brand-1.jpg', 'brand-2.jpg', 'brand-3.jpg', 'brand-4.jpg'].map((img, i) => (
                    <div key={img} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                      <img
                        src={`./images/profile/${img}`}
                        alt={`Partner Brands ${i + 1}`}
                        className="w-full h-auto max-h-56 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#162d6c] dark:text-[#93c5fd] mb-3">
                  {isAr ? 'الاعتمادات القياسية الرسمية' : 'Official Standard Seals'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { file: 'accred-2.jpg', label: 'SABER SASO' },
                    { file: 'accred-3.jpg', label: 'UL & FM Approved' },
                    { file: 'accred-1.jpg', label: 'LPCB' }
                  ].map((item) => (
                    <div key={item.file} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2">
                      <img
                        src={`./images/profile/${item.file}`}
                        alt={item.label}
                        className="h-28 w-auto object-contain"
                      />
                      <span className="text-[11px] font-bold text-slate-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <CustomParagraphSlot placement="products:bottom" lang={lang} content={content} />

      </div>
    </div>
  );
}
