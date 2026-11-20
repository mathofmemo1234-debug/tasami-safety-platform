import React from 'react';
import CustomParagraphSlot, { FormattedParagraph } from './CustomParagraphSlot';
import TasamiLogo from './TasamiLogo';
import { ShieldCheck, Award, Phone, Mail, MapPin, ExternalLink, Download, Globe } from 'lucide-react';

export default function Footer({ lang, content, onOpenAdmin, onNavigate }) {
  const t = content[lang].footer;
  const c = content[lang].contact;

  const navigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.hash = page === 'home' ? '' : page;
    }
  };

  return (
    <footer className="bg-white dark:bg-[#0b1120] text-slate-600 dark:text-slate-300 pt-16 pb-12 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <CustomParagraphSlot placement="footer:top" lang={lang} content={content} className="mb-10" />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200/80 dark:border-slate-800">
          
          {/* Brand & Vision Col */}
          <div className="lg:col-span-4 space-y-4 flex flex-col items-center lg:items-start text-center lg:text-start">
            <button onClick={() => navigate('home')} className="focus:outline-none">
              <TasamiLogo content={content} isWhite={false} lang={lang} className="h-14 sm:h-16" />
            </button>
            <FormattedParagraph
              content={content}
              lang={lang}
              paraKey="footerAbout"
              className="w-full text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mt-2"
              defaultText={t.aboutText}
            />
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 text-[11px] font-medium text-[#002366] dark:text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#002366] dark:text-[#D4AF37]" />
                <span>ترخيص الدفاع المدني (سلامة)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 text-[11px] font-medium text-[#002366] dark:text-slate-200">
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>كود البناء السعودي SBC</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3 text-start">
            <h4 className="text-xs font-bold text-[#002366] dark:text-white uppercase tracking-wider">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start">
                  {lang === 'ar' ? 'الرئيسية' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start">
                  {lang === 'ar' ? 'عن الشركة' : 'About Us'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('services')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'ar' ? 'صفحة الخدمات وتفريعاتها' : 'Services & Branches'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'ar' ? 'كتالوج المنتجات' : 'Products Catalog'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start">
                  {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </button>
              </li>
            </ul>
          </div>

          {/* Core Systems */}
          <div className="lg:col-span-3 space-y-3 text-start">
            <h4 className="text-xs font-bold text-[#002366] dark:text-white uppercase tracking-wider">
              {t.ourServices}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigate('services')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start">نظام الإطفاء النظيف FM-200</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start">نظام الإطفاء بغاز NOVEC 1230</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start">نظام الإطفاء بالأيروسول Aerosol</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start">إطفاء المطابخ التجارية التلقائي</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start">شبكات الرشاشات ومضخات الحريق</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors text-start">أنظمة التحكم وسحب الدخان</button></li>
            </ul>
          </div>

          {/* Contact & Branch */}
          <div className="lg:col-span-3 space-y-3 text-start">
            <h4 className="text-xs font-bold text-[#002366] dark:text-white uppercase tracking-wider">
              {t.contactInfo}
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                <a
                  href={c.googleMapsUrl || "https://www.google.com/maps/place/%D8%B4%D8%B1%D9%83%D8%A9+%D8%AA%D8%B3%D8%A7%D9%85%D9%8A+%D8%A7%D9%84%D8%A3%D8%B9%D9%85%D8%A7%D9%84%E2%80%AD/@21.3872248,39.8077324,17z/data=!3m1!4b1!4m6!3m5!1s0x15c21b124251096f:0x5f3bed74fbe7b8f3!8m2!3d21.3872248!4d39.8077324!16s%2Fg%2F11zyn3z20n"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors underline-offset-2 hover:underline"
                  title={lang === 'ar' ? 'عرض المقر على خرائط Google' : 'View Headquarters on Google Maps'}
                >
                  {t.address}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 font-mono text-slate-700 dark:text-slate-300">
                  <a
                    href="tel:+966591684133"
                    dir="ltr"
                    className="whitespace-nowrap hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors inline-block w-fit"
                  >
                    +966 59 168 4133
                  </a>
                  <a
                    href="tel:+966533480098"
                    dir="ltr"
                    className="whitespace-nowrap hover:text-[#002366] dark:hover:text-[#D4AF37] transition-colors inline-block w-fit"
                  >
                    +966 53 348 0098
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href={`mailto:${t.email || 'info@tasaami.com'}`} className="hover:text-[#002366] dark:hover:text-[#D4AF37] font-semibold text-slate-700 dark:text-slate-200 transition-colors font-sans">{t.email || 'info@tasaami.com'}</a>
                  {t.branchEmail && t.branchEmail !== (t.email || 'info@tasaami.com') && (
                    <a href={`mailto:${t.branchEmail}`} className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-[#002366] dark:hover:text-white transition-colors font-sans">
                      {t.branchEmail}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <a href="https://tasaami.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#002366] dark:hover:text-[#D4AF37] font-semibold text-[#002366] dark:text-white transition-colors font-sans">
                  Tasaami.com
                </a>
              </div>
            </div>

            {/* Social channels preview */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5 font-semibold">
                {lang === 'ar' ? 'تابعنا على المنصات الرسمية:' : 'Official Social Channels:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(c.socialLinks || []).map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#002366] dark:hover:text-[#D4AF37] hover:border-[#C5A059] transition-colors"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Admin Portal Toggle */}
            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-slate-500 hover:text-[#002366] dark:hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
              >
                <span>{lang === 'ar' ? 'لوحة تحكم مدير الموقع (Admin Dashboard)' : 'Admin Dashboard (CMS)'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* PWA App Installation & Barcode Scanner Card */}
        <div className="my-8 p-5 rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-start">
            <div className="p-2 bg-white rounded-xl border border-slate-200/80 flex-shrink-0">
              <img
                src="./tasami-qr.png"
                alt="Tasami QR Barcode"
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = './website_qr.svg';
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#002366] dark:text-white">
                  {lang === 'ar' ? 'تطبيق تسامي للأجهزة الذكية (PWA App)' : 'Tasami Smart PWA App'}
                </span>
                <span className="text-[10px] bg-[#002366] text-white font-semibold px-2 py-0.5 rounded-full">
                  iOS &amp; Android &amp; Desktop
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                {lang === 'ar'
                  ? 'امسح الباركود بكاميرا جوالك لتثبيت التطبيق مباشرة على شاشتك الرئيسية.'
                  : 'Scan the QR code with your mobile camera to install the app on your home screen.'}
              </p>
            </div>
          </div>
          <a
            href="./tasami-qr.png"
            download="tasami-safety-qr.png"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#0b1120] border border-[#002366]/25 dark:border-slate-700 hover:border-[#C5A059] text-[#002366] dark:text-[#D4AF37] text-xs font-semibold transition-colors flex-shrink-0"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>{lang === 'ar' ? 'تنزيل باركود المنصة (PNG)' : 'Download QR Code'}</span>
          </a>
        </div>

        {/* Bottom Bar: Copyright & Vision */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-start text-[11px] text-slate-500 dark:text-slate-400">
          <div>{t.allRightsReserved}</div>
          <div className="text-slate-500 dark:text-slate-400 font-medium">
            {t.visionQuote}
          </div>
        </div>

      </div>
    </footer>
  );
}
