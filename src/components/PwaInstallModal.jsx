import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  QrCode,
  Check,
  Copy,
  Share2,
  Monitor,
  Apple,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function PwaInstallModal({ isOpen, onClose, lang = 'ar' }) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState('android'); // 'android' | 'ios' | 'desktop'
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: switch to instructions
      if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        setActiveTab('ios');
      } else {
        setActiveTab('android');
      }
    }
  };

  const handleCopyLink = () => {
    const url = 'https://tasaami.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-cairo"
      onClick={onClose}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 bg-gradient-to-r from-[#113163] to-[#1a4485] text-white flex items-center justify-between border-b border-[#c59a45]/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-[#c59a45]/40 flex items-center justify-center text-[#dfb76c] shadow-inner">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {isAr ? 'تثبيت تطبيق تسامي للسلامة (PWA)' : 'Install Tasami Safety App'}
              </h3>
              <p className="text-xs text-slate-300">
                {isAr ? 'يعمل على كافة الأجهزة والجوالات بدون متجر' : 'Works seamlessly on all mobile & desktop devices'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* QR Code Highlight Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-[#0b1120] dark:to-[#131c31] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
            <div className="relative p-2 rounded-2xl bg-white shadow-md border border-[#c59a45]/40 flex-shrink-0">
              <img
                src="./tasami-qr.png"
                alt="Tasami Safety Website QR Code"
                className="w-32 h-32 object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = './website_qr.svg';
                }}
              />
              <span className="absolute -bottom-2 right-1/2 translate-x-1/2 px-2 py-0.5 rounded-full bg-[#113163] text-white text-[9px] font-black tracking-wider whitespace-nowrap shadow">
                SCAN QR
              </span>
            </div>

            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#c59a45]/15 text-[#9a752a] dark:text-[#dfb76c] text-[11px] font-bold border border-[#c59a45]/30">
                <Sparkles className="w-3 h-3" />
                <span>{isAr ? 'مسح فوري بالكاميرا' : 'Instant Camera Scan'}</span>
              </div>
              <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">
                {isAr ? 'امسح الباركود بكاميرا جوالك' : 'Scan barcode with your phone camera'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isAr
                  ? 'وجّه كاميرا الهاتف نحو الباركود لفتح المنصة وتثبيتها مباشرة كأيقونة على شاشتك الرئيسية.'
                  : 'Point your camera at the barcode to instantly open and install the app on your home screen.'}
              </p>
            </div>
          </div>

          {/* Native Install Button if available on Chrome/Edge */}
          {deferredPrompt && !isInstalled && (
            <button
              onClick={handleNativeInstall}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#c59a45] via-[#dfb76c] to-[#c59a45] hover:brightness-105 text-[#0b1120] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#c59a45]/25 transition-all transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تثبيت فوري الآن على هذا الجهاز (نقرة واحدة)' : 'Install Now (One-Click)'}</span>
            </button>
          )}

          {isInstalled && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'التطبيق مثبت وجاهز على جهازك بنجاح!' : 'App is installed and ready on your device!'}</span>
            </div>
          )}

          {/* System Instruction Tabs */}
          <div>
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-1 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 rounded-t-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'android'
                    ? 'border-b-2 border-[#c59a45] text-[#113163] dark:text-[#dfb76c] bg-slate-100/80 dark:bg-slate-800/60 font-black'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isAr ? 'أندرويد (Android)' : 'Android'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-t-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'ios'
                    ? 'border-b-2 border-[#c59a45] text-[#113163] dark:text-[#dfb76c] bg-slate-100/80 dark:bg-slate-800/60 font-black'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>{isAr ? 'آيفون وآيباد (iOS)' : 'iOS Safari'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-2 rounded-t-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'desktop'
                    ? 'border-b-2 border-[#c59a45] text-[#113163] dark:text-[#dfb76c] bg-slate-100/80 dark:bg-slate-800/60 font-black'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{isAr ? 'كمبيوتر (PC/Mac)' : 'Desktop'}</span>
              </button>
            </div>

            {/* Android Steps */}
            {activeTab === 'android' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#113163] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">1</span>
                  <p>{isAr ? 'افتح المنصة عبر متصفح Google Chrome على جوالك.' : 'Open the site in Google Chrome.'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#113163] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">2</span>
                  <p>{isAr ? 'اضغط على زر القائمة (الثلاث نقاط ⠇) في أعلى زاوية المتصفح.' : 'Tap the three-dots menu (⠇) at the top right.'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#113163] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">3</span>
                  <p>{isAr ? 'اختر "تثبيت التطبيق" أو "الإضافة إلى الشاشة الرئيسية".' : 'Select "Install app" or "Add to Home screen".'}</p>
                </div>
              </div>
            )}

            {/* iOS Safari Steps */}
            {activeTab === 'ios' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#113163] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">1</span>
                  <p>{isAr ? 'افتح الموقع عبر متصفح سفاري (Safari) على هاتف الآيفون.' : 'Open in Safari on your iPhone/iPad.'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#113163] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">2</span>
                  <p>{isAr ? 'اضغط على زر المشاركة (مربع بسهم لأعلى ⎋) في شريط المتصفح السفلي.' : 'Tap the Share icon (box with arrow ⎋) in the bottom bar.'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#113163] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">3</span>
                  <p>{isAr ? 'مرر للأسفل واضغط على "إضافة إلى الصفحة الرئيسية" (Add to Home Screen ⊞).' : 'Scroll down and tap "Add to Home Screen" (⊞).'}</p>
                </div>
              </div>
            )}

            {/* Desktop Steps */}
            {activeTab === 'desktop' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#113163] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">1</span>
                  <p>{isAr ? 'افتح الموقع في Google Chrome أو Microsoft Edge.' : 'Open in Chrome or Edge on Windows/Mac.'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#113163] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">2</span>
                  <p>{isAr ? 'ستجد أيقونة تثبيت ⊕ في نهاية شريط العنوان (URL bar) بالأعلى.' : 'Look for the install icon ⊕ on the right side of the URL bar.'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#113163] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">3</span>
                  <p>{isAr ? 'اضغط "تثبيت" لتشغيل التطبيق كنافذة مستقلة فائقة السرعة على سطح المكتب.' : 'Click "Install" to run as a standalone desktop app.'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Copy Link Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <input
              type="text"
              readOnly
              value="https://tasaami.com"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0b1120] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              dir="ltr"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-[#113163] hover:bg-[#1a4485] text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرابط' : 'Copy')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
