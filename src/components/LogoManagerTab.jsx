import React, { useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  Eye,
  Trash2,
  Layers,
  Check,
  Shield,
  HelpCircle,
  ExternalLink,
  Save
} from 'lucide-react';
import {
  getActiveLogoUrl,
  broadcastLogoChange,
  broadcastLogoStyleChange
} from './TasamiLogo';

export default function LogoManagerTab({
  localData,
  langTab = 'ar',
  updateNested,
  onUploadFile,
  onSaveNow,
  saveStatus
}) {
  // Current active logo in localData or localStorage
  const currentLogoUrl =
    localData?.[langTab]?.brand?.logoUrl ||
    localData?.ar?.brand?.logoUrl ||
    localData?.brand?.logoUrl ||
    '';

  const currentContainerStyle =
    localData?.[langTab]?.brand?.logoContainerStyle ||
    localData?.ar?.brand?.logoContainerStyle ||
    'badge';

  const currentAlt =
    localData?.[langTab]?.brand?.logoAlt ||
    (langTab === 'ar'
      ? 'تسامي الأعمال لأنظمة السلامة | TASAMI BUSINESS FOR SAFETY SYSTEMS'
      : 'TASAMI BUSINESS FOR SAFETY SYSTEMS');

  // Input states
  const [urlInput, setUrlInput] = useState('');
  const [previewBg, setPreviewBg] = useState('dark'); // 'light' | 'dark' | 'grid'
  const [syncBothLangs, setSyncBothLangs] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const [statusNotice, setStatusNotice] = useState(null);
  const [testUrlValid, setTestUrlValid] = useState(null);
  const [recentLogos, setRecentLogos] = useState([]);

  // Load recent logos from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tasami_recent_logos');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentLogos(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveToRecentLogos = (url) => {
    if (!url || typeof url !== 'string' || !url.trim()) return;
    try {
      const cleanUrl = url.trim();
      const existing = (recentLogos || []).filter(u => u !== cleanUrl);
      const updated = [cleanUrl, ...existing].slice(0, 8);
      setRecentLogos(updated);
      localStorage.setItem('tasami_recent_logos', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  // Helper to commit logo change to localData, broadcast, and recent list
  const applyNewLogo = (newUrl, message) => {
    const cleanUrl = (newUrl || '').trim();

    // 1. Update localData
    if (syncBothLangs) {
      updateNested(['ar', 'brand', 'logoUrl'], cleanUrl);
      updateNested(['en', 'brand', 'logoUrl'], cleanUrl);
    } else {
      updateNested([langTab, 'brand', 'logoUrl'], cleanUrl);
    }

    // 2. Broadcast immediately so Navbar, Footer, and splash react in real time
    broadcastLogoChange(cleanUrl);

    // 3. Save to recent logos if not empty
    if (cleanUrl) {
      saveToRecentLogos(cleanUrl);
    }

    setStatusNotice({
      type: 'success',
      text: message || (cleanUrl ? 'تم تطبيق الشعار الجديد بنجاح على المنصة!' : 'تمت استعادة الشعار الرسمي الافتراضي بنجاح!')
    });
    setTimeout(() => setStatusNotice(null), 5000);
  };

  // Handle local file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setStatusNotice({ type: 'error', text: 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميجابايت' });
      return;
    }

    setIsUploading(true);
    setUploadProgressMsg('جارِ الرفع والمعالجة...');

    if (onUploadFile) {
      onUploadFile(file, (url) => {
        setIsUploading(false);
        setUploadProgressMsg('');
        applyNewLogo(url, 'تم رفع وتطبيق الشعار الجديد بنجاح!');
      }, { isLogo: true });
    } else {
      // Fallback local reader
      const reader = new FileReader();
      reader.onload = () => {
        setIsUploading(false);
        setUploadProgressMsg('');
        applyNewLogo(reader.result, 'تم تطبيق الشعار بنجاح (محلياً)!');
      };
      reader.onerror = () => {
        setIsUploading(false);
        setUploadProgressMsg('');
        setStatusNotice({ type: 'error', text: 'تعذر قراءة ملف الصورة' });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL apply
  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setStatusNotice({ type: 'error', text: 'يرجى إدخال رابط صورة صالح' });
      return;
    }
    applyNewLogo(urlInput.trim(), 'تم اعتماد الشعار من الرابط بنجاح!');
    setUrlInput('');
    setTestUrlValid(null);
  };

  // Test URL
  const handleTestUrl = () => {
    if (!urlInput.trim()) return;
    setTestUrlValid('testing');
    const img = new Image();
    img.onload = () => setTestUrlValid('valid');
    img.onerror = () => setTestUrlValid('invalid');
    img.src = urlInput.trim();
  };

  // Reset to default
  const handleResetDefault = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة الشعار الافتراضي الأصلي للشركة؟')) {
      applyNewLogo('', 'تمت استعادة الشعار الأصلي الافتراضي للنظام');
    }
  };

  // Toggle container style
  const handleContainerStyleChange = (style) => {
    if (syncBothLangs) {
      updateNested(['ar', 'brand', 'logoContainerStyle'], style);
      updateNested(['en', 'brand', 'logoContainerStyle'], style);
    } else {
      updateNested([langTab, 'brand', 'logoContainerStyle'], style);
    }
    broadcastLogoStyleChange(style);
    setStatusNotice({
      type: 'success',
      text: style === 'badge' ? 'تم اختيار نمط الشارة البيضاء الفاخرة' : 'تم اختيار النمط المفرغ الشفاف'
    });
    setTimeout(() => setStatusNotice(null), 3000);
  };

  // Resolved display image for preview
  const displayLogoSrc = currentLogoUrl || './logo.jpg';
  const isCustomLogo = Boolean(currentLogoUrl);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#162d6c] via-[#1e3a8a] to-[#0f172a] text-white p-6 rounded-2xl border border-[#c59a45]/40 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c59a45]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dfb76c] to-[#9a752a] p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#131c31] rounded-[10px] flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-[#dfb76c]" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black tracking-wide text-white flex items-center gap-2">
                <span>إدارة الشعار الرسمي للشركة</span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#c59a45]/30 text-[#dfb76c] border border-[#c59a45]/40">
                  Logo Studio
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                تغيير شعار تسامي للأعمال، رفعه من جهازك، ضبط طريقة عرضه وأبعاده مع المعاينة الحية الفورية والتحديث اللحظي للموقع
              </p>
            </div>
          </div>

          {/* Quick sync options */}
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={syncBothLangs}
                onChange={(e) => setSyncBothLangs(e.target.checked)}
                className="w-4 h-4 text-[#c59a45] rounded focus:ring-0 accent-[#c59a45]"
              />
              <span className="text-slate-200 font-medium">مزامنة الشعار مع اللغتين (العربية والإنجليزية)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notice Message */}
      {statusNotice && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all duration-300 ${
            statusNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-300 dark:border-rose-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            <span>{statusNotice.text}</span>
          </div>
          <button
            onClick={() => setStatusNotice(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* 2. Interactive Live Preview & Active Logo Card */}
      <div className="bg-white dark:bg-[#131c31] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#c59a45]" />
            <h4 className="font-black text-sm text-[#0f172a] dark:text-white">
              المعاينة الحية التفاعلية للشعار (Live Real-Time Preview)
            </h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isCustomLogo
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200 border border-blue-300'
              }`}
            >
              {isCustomLogo ? 'شعار مخصص نشط' : 'الشعار الافتراضي للنظام'}
            </span>
          </div>

          {/* Background Toggle Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0b1120] p-1 rounded-xl text-xs font-semibold">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 px-2">معاينة على خلفية:</span>
            <button
              type="button"
              onClick={() => setPreviewBg('dark')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition ${
                previewBg === 'dark'
                  ? 'bg-[#162d6c] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              🌙 كحلية داكنة (Header/Footer)
            </button>
            <button
              type="button"
              onClick={() => setPreviewBg('light')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition ${
                previewBg === 'light'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              ☀️ بيضاء ناصعة
            </button>
            <button
              type="button"
              onClick={() => setPreviewBg('grid')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition ${
                previewBg === 'grid'
                  ? 'bg-[#dfb76c] text-[#0f172a] font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              🏁 شفافة (مفرغة)
            </button>
          </div>
        </div>

        {/* Preview Viewport */}
        <div
          className={`relative rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-h-[220px] border ${
            previewBg === 'dark'
              ? 'bg-[#0b1120] border-slate-800 text-white'
              : previewBg === 'light'
              ? 'bg-slate-50 border-slate-200 text-slate-900'
              : 'border-slate-300 dark:border-slate-700 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] dark:bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]'
          }`}
        >
          {/* Active Container Wrapper based on selected style */}
          <div
            className={`transition-all duration-200 ${
              currentContainerStyle === 'transparent'
                ? 'flex items-center p-2'
                : 'bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-slate-200/90 dark:border-[#c59a45]/30 inline-flex items-center'
            }`}
          >
            <img
              src={displayLogoSrc}
              alt={currentAlt}
              className="h-20 sm:h-24 max-w-[320px] sm:max-w-[420px] object-contain transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src = './logo.jpg';
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs opacity-80">
            <span>النمط المعتمد حالياً:</span>
            <span className="font-bold text-[#c59a45]">
              {currentContainerStyle === 'badge' ? 'بطاقة بيضاء بإطار ذهبي (Badge)' : 'مفرغ شفاف بدون خلفية (Transparent)'}
            </span>
          </div>
        </div>

        {/* Source info & Reset Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="truncate max-w-md font-mono text-[11px]">
            {isCustomLogo ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate">
                <Check className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">مصدر الشعار: {currentLogoUrl.startsWith('data:') ? 'صورة مرفوعة (Base64/Storage)' : currentLogoUrl}</span>
              </span>
            ) : (
              <span>مصدر الشعار: الشعار الافتراضي الرسمي (logo.jpg)</span>
            )}
          </div>

          {isCustomLogo && (
            <button
              type="button"
              onClick={handleResetDefault}
              className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استعادة الشعار الافتراضي</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Upload & URL Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card A: Upload Local Image File */}
        <div className="bg-white dark:bg-[#131c31] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Upload className="w-5 h-5 text-[#c59a45]" />
              <h4 className="font-black text-sm text-[#0f172a] dark:text-white">
                الطريقة الأولى: رفع صورة الشعار من جهازك
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختر ملف صورة من جهازك (PNG، SVG، JPG، WebP). للحصول على أفضل جودة، نوصي باستخدام صورة ذات خلفية شفافة (PNG أو SVG) بدقة 500×200 بكسل أو أعلى.
            </p>
          </div>

          <div className="border-2 border-dashed border-[#c59a45]/50 hover:border-[#c59a45] rounded-2xl p-6 text-center bg-slate-50/60 dark:bg-[#0b1120] transition group">
            <div className="w-12 h-12 rounded-full bg-[#c59a45]/10 text-[#c59a45] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <Upload className="w-6 h-6" />
            </div>

            <p className="text-xs font-bold text-[#0f172a] dark:text-white mb-1">
              اضغط لاختيار صورة الشعار الجديد من حاسوبك أو هاتفك
            </p>
            <p className="text-[11px] text-slate-400 mb-4">
              يدعم PNG المفرغة، SVG، JPG حتى 8 ميجابايت
            </p>

            <label className="btn-flashy-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-[#0b1120] cursor-pointer shadow-md hover:shadow-lg transition">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? (uploadProgressMsg || 'جارِ الرفع...') : 'اختيار الشعار ورفعه الآن'}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                disabled={isUploading}
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-50 dark:bg-[#0b1120] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            💡 <strong>نصيحة تقنية:</strong> عند رفع الشعار يتم حفظه فوراً في الذاكرة السحابية وتحديثه في الهيدر والفوتر وشاشة البدء الترحيبية وأيقونة المتصفح (Favicon).
          </div>
        </div>

        {/* Card B: Direct Image URL */}
        <div className="bg-white dark:bg-[#131c31] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LinkIcon className="w-5 h-5 text-[#c59a45]" />
              <h4 className="font-black text-sm text-[#0f172a] dark:text-white">
                الطريقة الثانية: تعيين الشعار عبر رابط مباشر
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              إذا كان الشعار مرفوعاً على رابط خارجي أو موقعك أو خدمة سحابية، الصق الرابط المباشر هنا.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                رابط صورة الشعار (Direct Image URL):
              </label>
              <div className="relative">
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://example.com/images/tasami-logo.png"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setTestUrlValid(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#c59a45] outline-none"
                />
              </div>
            </div>

            {/* Test validation feedback */}
            {testUrlValid === 'testing' && (
              <p className="text-[11px] text-blue-500 font-bold flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> جارِ اختبار صلاحية الرابط...
              </p>
            )}
            {testUrlValid === 'valid' && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> الرابط صالح وتم تحميل الصورة بنجاح!
              </p>
            )}
            {testUrlValid === 'invalid' && (
              <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> تعذر تحميل الصورة من هذا الرابط، تأكد من صحته.
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestUrl}
                disabled={!urlInput.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition disabled:opacity-50"
              >
                اختبار الرابط
              </button>
              <button
                type="button"
                onClick={handleApplyUrl}
                disabled={!urlInput.trim()}
                className="btn-flashy-gold px-5 py-2 rounded-xl text-xs font-bold text-[#0b1120] shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>تطبيق واعتماد الرابط</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-50 dark:bg-[#0b1120] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            ℹ️ يمكنك تجربة روابط صور تنتهي بـ <code>.png</code> أو <code>.svg</code> أو <code>.jpg</code> أو <code>.webp</code>.
          </div>
        </div>
      </div>

      {/* 4. Display Style & Container Settings */}
      <div className="bg-white dark:bg-[#131c31] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Layers className="w-5 h-5 text-[#c59a45]" />
          <h4 className="font-black text-sm text-[#0f172a] dark:text-white">
            خيارات طريقة عرض وتنسيق الشعار (Container & Style Settings)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Badge Style */}
          <div
            onClick={() => handleContainerStyleChange('badge')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
              currentContainerStyle === 'badge'
                ? 'border-[#c59a45] bg-[#c59a45]/5 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-5 h-5 rounded-full border-2 border-[#c59a45] flex items-center justify-center mt-0.5 flex-shrink-0">
              {currentContainerStyle === 'badge' && <div className="w-2.5 h-2.5 rounded-full bg-[#c59a45]" />}
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#0f172a] dark:text-white mb-1">
                نمط الشارة البيضاء الفاخرة (Badge Style) - الموصى به
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                يضع الشعار داخل بطاقة بيضاء ناصعة بحواف منحنية فخمة مع إطار ذهبي رقيق وظلال خفيفة، مما يضمن وضوح الشعار بنسبة 100% سواء كانت خلفية الموقع بيضاء أو كحلية داكنة.
              </p>
            </div>
          </div>

          {/* Option 2: Transparent Style */}
          <div
            onClick={() => handleContainerStyleChange('transparent')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
              currentContainerStyle === 'transparent'
                ? 'border-[#c59a45] bg-[#c59a45]/5 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-5 h-5 rounded-full border-2 border-[#c59a45] flex items-center justify-center mt-0.5 flex-shrink-0">
              {currentContainerStyle === 'transparent' && <div className="w-2.5 h-2.5 rounded-full bg-[#c59a45]" />}
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#0f172a] dark:text-white mb-1">
                نمط مفرغ شفاف (Transparent Minimalist)
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                يعرض الشعار مباشرة بدون بطاقة بيضاء أو إطار. هذا النمط مثالي إذا كان شعارك مفرغاً بصيغة PNG أو SVG باللون الأبيض أو الذهبي ليظهر متناغماً مع شريط الهيدر.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Alt Text Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              النص البديل للشعار (عربي) - لتحسين محركات البحث SEO:
            </label>
            <input
              type="text"
              value={localData?.[langTab]?.brand?.logoAlt || ''}
              onChange={(e) => updateNested([langTab, 'brand', 'logoAlt'], e.target.value)}
              placeholder="تسامي الأعمال لأنظمة السلامة | TASAMI BUSINESS FOR SAFETY SYSTEMS"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              النص البديل بالإنجليزية (Logo Alt Text EN):
            </label>
            <input
              type="text"
              dir="ltr"
              value={localData?.en?.brand?.logoAlt || ''}
              onChange={(e) => updateNested(['en', 'brand', 'logoAlt'], e.target.value)}
              placeholder="TASAMI BUSINESS FOR SAFETY SYSTEMS"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* 5. Recent Logos History */}
      {recentLogos.length > 0 && (
        <div className="bg-white dark:bg-[#131c31] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c59a45]" />
              <span>سجل الشعارات المستخدمة مؤخراً (Recent Logos Library)</span>
            </h4>
            <button
              type="button"
              onClick={() => {
                setRecentLogos([]);
                localStorage.removeItem('tasami_recent_logos');
              }}
              className="text-[11px] text-slate-400 hover:text-rose-500 transition"
            >
              مسح السجل
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
            {recentLogos.map((logo, idx) => (
              <div
                key={idx}
                className="group relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1120] flex flex-col items-center justify-between gap-2 hover:border-[#c59a45] transition"
              >
                <div className="w-full h-16 bg-white rounded-lg p-1 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <img src={logo} alt={`Recent logo ${idx + 1}`} className="w-full h-full object-contain" />
                </div>
                <button
                  type="button"
                  onClick={() => applyNewLogo(logo, 'تم التبديل إلى هذا الشعار من السجل بنجاح!')}
                  className="w-full py-1 rounded bg-[#162d6c] hover:bg-[#1e3a8a] text-white text-[10px] font-bold transition shadow-sm"
                >
                  استخدام
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Direct Quick Save Bar */}
      <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-[#0b1120] dark:to-[#131c31] rounded-2xl border border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Shield className="w-4 h-4 text-[#c59a45]" />
          <span>التغييرات التي تقوم بها هنا تطبق مباشرة، ولتثبيتها ومزامنتها سحابياً انقر زر الحفظ:</span>
        </div>

        {onSaveNow && (
          <button
            type="button"
            onClick={onSaveNow}
            disabled={saveStatus?.state === 'saving'}
            className="btn-flashy-gold px-6 py-2.5 rounded-xl text-xs font-black text-[#0b1120] shadow-md hover:shadow-lg transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Save className="w-4 h-4" />
            <span>{saveStatus?.state === 'saving' ? 'جارِ الحفظ السحابي...' : 'حفظ وتثبيت الشعار الآن (Save Live)'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
