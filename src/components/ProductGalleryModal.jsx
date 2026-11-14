import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  Maximize2,
  Play,
  Image as ImageIcon,
  MessageCircle,
  Check,
  ShieldCheck
} from 'lucide-react';
import InlineVideoPlayer from './InlineVideoPlayer';
import {
  getProductImages,
  normalizeWhatsAppDigits,
  resolveProductVideoSource
} from '../utils/media';

/**
 * Studio-style multi-angle product gallery & inline video viewer modal,
 * modeled after the user's multi-angle showcase reference.
 */
export default function ProductGalleryModal({
  product,
  initialMode = 'images', // 'images' | 'video'
  initialAngleIndex = 0,
  isAr = true,
  whatsappNumber = '966591684133',
  onClose,
  onInquiry
}) {
  const images = getProductImages(product);
  const videoSource = resolveProductVideoSource(product);

  const [mode, setMode] = useState(
    initialMode === 'video' && videoSource ? 'video' : 'images'
  );
  const [angleIdx, setAngleIdx] = useState(
    Math.min(Math.max(0, initialAngleIndex), images.length - 1)
  );
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setMode(initialMode === 'video' && videoSource ? 'video' : 'images');
    setAngleIdx(Math.min(Math.max(0, initialAngleIndex), images.length - 1));
    setIsZoomed(false);
  }, [product?.id, initialMode, initialAngleIndex, images.length, videoSource]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (mode === 'images' && images.length > 1) {
        if (e.key === 'ArrowRight') {
          setAngleIdx((prev) => (prev + 1) % images.length);
        } else if (e.key === 'ArrowLeft') {
          setAngleIdx((prev) => (prev - 1 + images.length) % images.length);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, mode, images.length]);

  if (!product) return null;

  const title = isAr ? product.ar : product.en;
  const altTitle = isAr ? product.en : product.ar;
  const videoTitle = isAr
    ? product.videoTitle || title
    : product.videoTitleEn || title;

  const nextAngle = () => {
    setMode('images');
    setAngleIdx((prev) => (prev + 1) % images.length);
  };

  const prevAngle = () => {
    setMode('images');
    setAngleIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    const shareText = `${title} - ${isAr ? 'شركة تسامي الأعمال للسلامة' : 'Tasaami Safety'}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: shareText, url: window.location.href });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(`${shareText} — ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const waUrl = `https://wa.me/${normalizeWhatsAppDigits(
    whatsappNumber
  )}?text=${encodeURIComponent(
    isAr
      ? `السلام عليكم، أرغب بالاستفسار وطلب عرض سعر لمنتج: ${product.ar}`
      : `Hello, I would like to request pricing and details for: ${product.en}`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col"
      >
        {/* Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-[#131c31]">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#0f172a] dark:text-white leading-tight">
              {title}
            </h3>
            {altTitle && (
              <p className="text-xs font-semibold text-[#9c7224] dark:text-[#dfb76c]">
                {altTitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {videoSource && (
              <div className="inline-flex bg-slate-200/80 dark:bg-[#0b1120] p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMode('images')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    mode === 'images'
                      ? 'bg-white dark:bg-[#131c31] text-[#113163] dark:text-[#dfb76c] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{isAr ? `الزوايا (${images.length})` : `Angles (${images.length})`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('video')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    mode === 'video'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isAr ? 'الفيديو التوضيحي' : 'Video'}</span>
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Studio Showcase Area (Matches reference layout) */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/80 dark:from-[#0b1120] dark:to-[#131c31] border border-slate-200 dark:border-slate-800 overflow-hidden aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
            {mode === 'video' && videoSource ? (
              <InlineVideoPlayer
                source={videoSource}
                title={videoTitle}
                poster={images[0]}
                autoplay={true}
                isAr={isAr}
                className="w-full h-full"
              />
            ) : (
              <>
                <img
                  src={images[angleIdx] || images[0]}
                  alt={`${title} - ${isAr ? 'زاوية' : 'Angle'} ${angleIdx + 1}`}
                  onClick={() => setIsZoomed((z) => !z)}
                  className={`w-full h-full object-contain p-2 transition-transform duration-300 cursor-zoom-in ${
                    isZoomed ? 'scale-125' : 'scale-100'
                  }`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = './images/product-1.jpg';
                  }}
                />

                {/* Top-Left / Top-Right Floating Action Column (Heart, Share, Expand/Zoom) */}
                <div
                  className={`absolute top-3 ${
                    isAr ? 'left-3' : 'right-3'
                  } flex flex-col gap-2 z-10`}
                >
                  <button
                    type="button"
                    onClick={() => setLiked((l) => !l)}
                    title={isAr ? 'حفظ في المفضلة' : 'Favorite'}
                    className={`w-9 h-9 rounded-full bg-white/95 dark:bg-[#131c31]/95 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center transition hover:scale-105 ${
                      liked ? 'text-rose-500' : 'text-slate-600 dark:text-slate-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    title={isAr ? 'مشاركة المنتج' : 'Share'}
                    className="w-9 h-9 rounded-full bg-white/95 dark:bg-[#131c31]/95 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-200 transition hover:scale-105"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsZoomed((z) => !z)}
                    title={isAr ? 'تكبير / تصغير' : 'Toggle Zoom'}
                    className="w-9 h-9 rounded-full bg-white/95 dark:bg-[#131c31]/95 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-200 transition hover:scale-105"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Prev / Next Angle Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevAngle}
                      aria-label={isAr ? 'الزاوية السابقة' : 'Previous angle'}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 dark:bg-[#131c31]/95 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-800 dark:text-white hover:scale-105 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextAngle}
                      aria-label={isAr ? 'الزاوية التالية' : 'Next angle'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 dark:bg-[#131c31]/95 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-800 dark:text-white hover:scale-105 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Angle Counter Badge */}
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/65 text-white text-[11px] font-bold backdrop-blur-sm">
                  {isAr
                    ? `زاوية ${angleIdx + 1} من ${images.length}`
                    : `Angle ${angleIdx + 1} of ${images.length}`}
                </span>
              </>
            )}
          </div>

          {/* Multi-Angle Thumbnail Strip + Video Thumbnail */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            {images.map((imgUrl, idx) => {
              const isSelected = mode === 'images' && angleIdx === idx;
              return (
                <button
                  key={`${imgUrl}_${idx}`}
                  type="button"
                  onClick={() => {
                    setMode('images');
                    setAngleIdx(idx);
                    setIsZoomed(false);
                  }}
                  className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#0b1120] border-2 transition ${
                    isSelected
                      ? 'border-[#113163] dark:border-[#c59a45] ring-2 ring-[#c59a45]/40 scale-[1.03]'
                      : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${title} #${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = './images/product-1.jpg';
                    }}
                  />
                  <span className="absolute bottom-0.5 right-0.5 px-1.5 py-0.2 rounded bg-black/70 text-white text-[9px] font-bold">
                    {idx + 1}
                  </span>
                </button>
              );
            })}

            {videoSource && (
              <button
                type="button"
                onClick={() => setMode('video')}
                className={`shrink-0 w-20 h-16 sm:w-24 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition ${
                  mode === 'video'
                    ? 'border-red-600 bg-red-600 text-white ring-2 ring-red-400/50'
                    : 'border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span className="text-[10px] font-black">
                  {isAr ? 'تشغيل الفيديو' : 'Play Video'}
                </span>
              </button>
            )}
          </div>

          {/* Product Details & Action Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              {product.specs && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#113163]/10 dark:bg-[#c59a45]/15 text-[#113163] dark:text-[#dfb76c] text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{product.specs}</span>
                </div>
              )}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.desc}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-black shadow transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'استفسار واتس آب' : 'WhatsApp Inquiry'}</span>
              </a>
              {onInquiry && (
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    onInquiry(title);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#113163] hover:bg-[#0d274e] text-white text-xs font-black shadow transition"
                >
                  {isAr ? 'طلب تسعير للمشروع' : 'Request Project Quote'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
