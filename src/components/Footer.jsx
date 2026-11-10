import React from 'react';
import TasamiLogo from './TasamiLogo';
import { ShieldCheck, Award, Phone, Mail, MapPin, ExternalLink, Share2 } from 'lucide-react';

export default function Footer({ lang, content, onOpenAdmin }) {
  const t = content[lang].footer;
  const c = content[lang].contact;

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand & Vision Col */}
          <div className="lg:col-span-4 space-y-4">
            <TasamiLogo isWhite={true} lang={lang} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-3">
              {t.aboutText}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#c59a45]" />
                <span>ترخيص الدفاع المدني (سلامة)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <Award className="w-4 h-4 text-[#c59a45]" />
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
              <li><a href="#home" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="#about" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'عن الشركة' : 'About Us'}</a></li>
              <li><a href="#ceo" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'كلمة المدير التنفيذي' : 'CEO Message'}</a></li>
              <li><a href="#vision-values" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'الرؤية والقيم' : 'Vision & Values'}</a></li>
              <li><a href="#suppression" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'أنظمة الإطفاء التلقائي' : 'Suppression'}</a></li>
              <li><a href="#services" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'خدماتنا' : 'Services'}</a></li>
              <li><a href="#products" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'كتالوج المنتجات' : 'Products'}</a></li>
              <li><a href="#licenses" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'الاعتمادات والتراخيص' : 'Licenses'}</a></li>
              <li><a href="#org-chart" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'الهيكل التنظيمي' : 'Org Chart'}</a></li>
              <li><a href="#projects" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'أبرز مشاريعنا' : 'Projects'}</a></li>
              <li><a href="#calculator" className="hover:text-[#dfb76c] transition">{lang === 'ar' ? 'حاسبة السلامة' : 'Safety Estimator'}</a></li>
            </ul>
          </div>

          {/* Core Systems */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.ourServices}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#suppression" className="hover:text-[#dfb76c] transition">نظام الإطفاء النظيف FM-200</a></li>
              <li><a href="#suppression" className="hover:text-[#dfb76c] transition">نظام الإطفاء بغاز NOVEC 1230</a></li>
              <li><a href="#suppression" className="hover:text-[#dfb76c] transition">نظام الإطفاء بالأيروسول Aerosol</a></li>
              <li><a href="#suppression" className="hover:text-[#dfb76c] transition">إطفاء المطابخ التجارية التلقائي</a></li>
              <li><a href="#suppression" className="hover:text-[#dfb76c] transition">نظام ثاني أكسيد الكربون CO₂</a></li>
              <li><a href="#services" className="hover:text-[#dfb76c] transition">شبكات الرشاشات ومضخات الحريق</a></li>
              <li><a href="#services" className="hover:text-[#dfb76c] transition">أنظمة التحكم وسحب الدخان</a></li>
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
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c59a45] flex-shrink-0" />
                <span dir="ltr" className="font-mono text-slate-300">+966 59 168 4133 / +966 53 348 0098</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c59a45] flex-shrink-0" />
                <a href={`mailto:${t.email}`} className="hover:text-white transition">{t.email}</a>
              </div>
            </div>

            {/* Social channels preview */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">
                {lang === 'ar' ? 'تابعنا على المنصات:' : 'Follow Us:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {c.socialLinks.slice(0, 3).map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#dfb76c] hover:border-[#dfb76c]/40 transition"
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
                <span>لوحة تحكم الطلبات (Admin View)</span>
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
