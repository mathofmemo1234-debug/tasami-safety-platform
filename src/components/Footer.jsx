import React from 'react';
import TasamiLogo from './TasamiLogo';
import { ShieldCheck, Award, Phone, Mail, MapPin, ExternalLink, Share2 } from 'lucide-react';

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
    <footer className="bg-[#0b1120] text-slate-300 pt-16 pb-12 border-t-2 border-[#162d6c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Vision Col */}
          <div className="lg:col-span-4 space-y-4">
            <button onClick={() => navigate('home')} className="focus:outline-none">
              <TasamiLogo isWhite={true} lang={lang} className="h-16 sm:h-20 md:h-24" />
            </button>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-3">
              {t.aboutText}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131c31] border border-[#1d4ed8]/30 text-[11px] text-slate-200">
                <ShieldCheck className="w-4 h-4 text-[#60a5fa]" />
                <span>ترخيص الدفاع المدني (سلامة)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131c31] border border-[#c59a45]/30 text-[11px] text-slate-200">
                <Award className="w-4 h-4 text-[#dfb76c]" />
                <span>كود البناء السعودي SBC</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left">
                  {lang === 'ar' ? 'الرئيسية' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left">
                  {lang === 'ar' ? 'عن الشركة' : 'About Us'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('services')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left font-bold text-slate-300">
                  {lang === 'ar' ? 'صفحة الخدمات وتفريعاتها' : 'Services & Branches'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left font-bold text-slate-300">
                  {lang === 'ar' ? 'كتالوج المنتجات' : 'Products Catalog'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left">
                  {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </button>
              </li>
            </ul>
          </div>

          {/* Core Systems */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.ourServices}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigate('services')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left">نظام الإطفاء النظيف FM-200</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left">نظام الإطفاء بغاز NOVEC 1230</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left">نظام الإطفاء بالأيروسول Aerosol</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left">إطفاء المطابخ التجارية التلقائي</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left">شبكات الرشاشات ومضخات الحريق</button></li>
              <li><button onClick={() => navigate('services')} className="hover:text-[#dfb76c] transition text-right rtl:text-right ltr:text-left">أنظمة التحكم وسحب الدخان</button></li>
            </ul>
          </div>

          {/* Contact & Branch */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.contactInfo}
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c59a45] flex-shrink-0 mt-0.5" />
                <a
                  href={c.googleMapsUrl || "https://maps.app.goo.gl/RP4JDp9WK9B3aFxXA"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#dfb76c] transition underline-offset-2 hover:underline"
                  title={lang === 'ar' ? 'عرض المقر على خرائط Google' : 'View Headquarters on Google Maps'}
                >
                  {t.address}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#c59a45] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 font-mono text-slate-300">
                  <a
                    href="tel:+966591684133"
                    dir="ltr"
                    className="whitespace-nowrap hover:text-[#dfb76c] transition inline-block w-fit"
                  >
                    +966 59 168 4133
                  </a>
                  <a
                    href="tel:+966533480098"
                    dir="ltr"
                    className="whitespace-nowrap hover:text-[#dfb76c] transition inline-block w-fit"
                  >
                    +966 53 348 0098
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c59a45] flex-shrink-0" />
                <a href={`mailto:${t.email}`} className="hover:text-white transition">{t.email}</a>
              </div>
            </div>

            {/* Social channels preview */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">
                {lang === 'ar' ? 'تابعنا على المنصات الرسمية:' : 'Official Social Channels:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(c.socialLinks || []).map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#dfb76c] hover:border-[#dfb76c]/40 transition"
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
                className="text-[11px] text-slate-500 hover:text-[#dfb76c] flex items-center gap-1 transition"
              >
                <span>{lang === 'ar' ? 'لوحة تحكم مدير الموقع (Admin Dashboard)' : 'Admin Dashboard (CMS)'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Vision */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right text-[11px] text-slate-500">
          <div>{t.allRightsReserved}</div>
          <div className="text-slate-400 font-medium">
            {t.visionQuote}
          </div>
        </div>

      </div>
    </footer>
  );
}
