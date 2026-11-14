import React, { useState } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Star,
  Video,
  Film,
  Eye,
  EyeOff
} from 'lucide-react';
import InlineVideoPlayer from './InlineVideoPlayer';
import { getProductImages, resolveProductVideoSource } from '../utils/media';

/**
 * Rich product multi-angle image gallery + video editing widget inside AdminDashboard.
 */
export default function AdminProductMediaEditor({
  item,
  onChangeItem,
  onUploadFile
}) {
  const [newAngleUrl, setNewAngleUrl] = useState('');
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  const images = getProductImages(item);
  const videoSource = resolveProductVideoSource(item);

  const commitImages = (nextImages, nextPrimary = null) => {
    const clean = nextImages.filter((u, i, arr) => u && arr.indexOf(u) === i);
    const primary = nextPrimary || clean[0] || '';
    onChangeItem({
      ...item,
      image: primary,
      images: clean
    });
  };

  const handleAddAngleUrl = () => {
    const clean = newAngleUrl.trim();
    if (!clean) return;
    commitImages([...images, clean], item.image || clean);
    setNewAngleUrl('');
  };

  const handleSetPrimary = (url) => {
    const reordered = [url, ...images.filter((u) => u !== url)];
    commitImages(reordered, url);
  };

  const handleRemoveAngle = (url) => {
    const remaining = images.filter((u) => u !== url);
    commitImages(remaining, remaining[0] || '');
  };

  return (
    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
      {/* Multi-Angle Images Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-slate-600 dark:text-slate-300 font-bold text-xs">
            صور المنتج متعددة الزوايا ({images.length}):
          </label>
          <label className="px-2.5 py-1 bg-[#c59a45] hover:bg-[#dfb76c] text-[#0b1120] rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer">
            <Upload className="w-3 h-3" />
            <span>رفع صورة زاوية</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onUploadFile(file, (url) => {
                    commitImages([...images, url], item.image || url);
                  });
                }
              }}
            />
          </label>
        </div>

        {/* Thumbnails Grid */}
        <div className="flex flex-wrap gap-2">
          {images.map((imgUrl, aIdx) => {
            const isPrimary = aIdx === 0;
            return (
              <div
                key={`${imgUrl}_${aIdx}`}
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 bg-slate-100 dark:bg-[#0b1120] group ${
                  isPrimary
                    ? 'border-[#c59a45] ring-2 ring-[#c59a45]/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Angle ${aIdx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = './images/product-1.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(imgUrl)}
                      title="تعيين كصورة رئيسية"
                      className="p-1 rounded bg-[#c59a45] text-[#0b1120]"
                    >
                      <Star className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveAngle(imgUrl)}
                    title="إزالة هذه الزاوية"
                    className="p-1 rounded bg-rose-600 text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                {isPrimary && (
                  <span className="absolute bottom-0 right-0 left-0 bg-[#c59a45] text-[#0b1120] text-[9px] font-black text-center leading-tight py-0.5">
                    رئيسية
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Add New Angle URL */}
        <div className="flex gap-1.5">
          <input
            type="text"
            value={newAngleUrl}
            onChange={(e) => setNewAngleUrl(e.target.value)}
            placeholder="أضف رابط صورة لزاوية أخرى (URL أو ./images/...)"
            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-mono text-[11px]"
          />
          <button
            type="button"
            onClick={handleAddAngleUrl}
            className="px-3 py-1.5 rounded-lg bg-[#113163] hover:bg-[#0d274e] text-white text-[11px] font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة</span>
          </button>
        </div>
      </div>

      {/* Video Editor & Live Inline Preview */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200/80 dark:border-slate-800 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
            <Video className="w-4 h-4 text-red-500" />
            <span>تحرير الفيديو والتشغيل داخل الصفحة</span>
          </span>

          <div className="flex items-center gap-1.5">
            <label className="px-2.5 py-1 rounded-lg bg-[#113163] hover:bg-[#0d274e] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer">
              <Upload className="w-3 h-3" />
              <span>رفع ملف فيديو</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadFile(file, (url) => {
                      onChangeItem({
                        ...item,
                        videoUrl: url,
                        videoId: url
                      });
                    });
                  }
                }}
              />
            </label>

            {videoSource && (
              <button
                type="button"
                onClick={() => setShowVideoPreview((v) => !v)}
                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold flex items-center gap-1"
              >
                {showVideoPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showVideoPreview ? 'إخفاء المعاينة' : 'معاينة الفيديو'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="sm:col-span-2">
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
              رابط الفيديو (YouTube URL / ID / Vimeo / MP4):
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=... أو معرف الفيديو أو رابط MP4"
                value={item.videoUrl || item.videoId || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChangeItem({
                    ...item,
                    videoUrl: val,
                    videoId: val
                  });
                }}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[#0f172a] dark:text-white font-mono text-[11px]"
                dir="ltr"
              />
              {videoSource && (
                <button
                  type="button"
                  onClick={() =>
                    onChangeItem({
                      ...item,
                      videoUrl: '',
                      videoId: ''
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold"
                >
                  حذف الفيديو
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
              عنوان الفيديو (عربي):
            </label>
            <input
              type="text"
              value={item.videoTitle || ''}
              onChange={(e) =>
                onChangeItem({ ...item, videoTitle: e.target.value })
              }
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[#0f172a] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
              عنوان الفيديو (English):
            </label>
            <input
              type="text"
              value={item.videoTitleEn || ''}
              onChange={(e) =>
                onChangeItem({ ...item, videoTitleEn: e.target.value })
              }
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[#0f172a] dark:text-white"
              dir="ltr"
            />
          </div>
        </div>

        {showVideoPreview && videoSource && (
          <div className="rounded-xl overflow-hidden aspect-video border border-slate-300 dark:border-slate-700 bg-black">
            <InlineVideoPlayer
              source={videoSource}
              title={item.videoTitle || item.ar}
              poster={images[0]}
              isAr={true}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
