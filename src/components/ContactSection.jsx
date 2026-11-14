import React, { useState } from 'react';
import CustomParagraphSlot, { FormattedParagraph } from './CustomParagraphSlot';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare, Share2 } from 'lucide-react';

export default function ContactSection({ lang, content, onOpenConsultation }) {
  const t = content[lang];
  const cta = t.ctaBanner;
  const c = t.contact;
  const vis = content[lang]?.visibility || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error('Error submitting message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative">
      
      {/* 1. Pre-Footer Call to Action Banner */}
      <div className="bg-gradient-to-r from-[#0f2152] via-[#162d6c] to-[#0b1120] text-white py-14 border-y border-[#c59a45]/35 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c59a45_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center gap-6 text-center max-w-3xl mx-auto">
            
            <div className="space-y-3 flex flex-col items-center text-center w-full">
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {cta.title}
              </h3>
              <p className="w-full text-xs sm:text-sm font-mono tracking-widest text-[#dfb76c] uppercase">
                {cta.subtitle}
              </p>
              <FormattedParagraph
                content={content}
                lang={lang}
                paraKey="contactBanner"
                className="w-full text-xs text-slate-200 max-w-xl mx-auto"
                defaultText={cta.desc}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <button
                onClick={onOpenConsultation}
                className="px-8 py-4 rounded-xl text-sm font-bold text-[#0b1120] bg-[#c59a45] hover:bg-[#dfb76c] transition shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>{cta.btnText}</span>
                <span className={lang === 'ar' ? 'rotate-180' : ''}>→</span>
              </button>

              {/* Saudi Vision 2030 Logo */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <div className="text-center font-black leading-none">
                  <span className="text-[10px] block text-emerald-400">رؤيـــة</span>
                  <span className="text-base tracking-tighter text-white">2030</span>
                </div>
                <div className="text-[9px] text-slate-200 leading-tight text-right border-r border-white/20 pr-2">
                  المملكة العربية السعودية<br />
                  <span className="font-mono text-[8px] text-slate-300">KINGDOM OF SAUDI ARABIA</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <CustomParagraphSlot placement="contact:afterBanner" lang={lang} content={content} className="pt-8" />

      {/* 2. Direct Contact Form & Channels */}
      <div className="py-16 bg-white dark:bg-[#0b1120] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-center flex flex-col items-center">
                <span className="text-xs font-black tracking-widest text-[#9a752a] dark:text-[#dfb76c] uppercase bg-[#c59a45]/10 dark:bg-[#c59a45]/20 px-3.5 py-1 rounded-md inline-block">
                  {c.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white mt-3">
                  {c.title}
                </h3>
                <FormattedParagraph
                  content={content}
                  lang={lang}
                  paraKey="contactBanner"
                  className="w-full text-sm text-slate-600 dark:text-slate-300 mt-2"
                  defaultText={c.subtitle}
                />
              </div>

              <div className="space-y-4">
                {/* Phone Numbers */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-[#1d4ed8] dark:text-[#60a5fa]" />
                    <span>{lang === 'ar' ? 'أرقام الاتصال والواتساب المباشر' : 'Direct Phone & WhatsApp'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href="tel:+966591684133"
                      className="px-3 py-2 rounded-xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] hover:border-[#c59a45] text-center block font-mono"
                      dir="ltr"
                    >
                      +966 59 168 4133
                    </a>
                    <a
                      href="tel:+966533480098"
                      className="px-3 py-2 rounded-xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] hover:border-[#c59a45] text-center block font-mono"
                      dir="ltr"
                    >
                      +966 53 348 0098
                    </a>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">متاح طوال أيام الأسبوع</span>
                    <a
                      href="https://wa.me/966591684133"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
                    >
                      محادثة فورية عبر واتساب 💬
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 flex items-start gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#1d4ed8]/20 text-[#1d4ed8] dark:text-[#60a5fa] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">{lang === 'ar' ? 'البريد الإلكتروني الرسمي' : 'Official Email'}</span>
                    <a href={`mailto:${c.email}`} className="text-sm font-bold text-[#0f172a] dark:text-white hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] font-sans">
                      {c.email}
                    </a>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">فرع مكة المكرمة • الرد والاستجابة السريعة</span>
                  </div>
                </div>

                {/* Address & Google Maps Navigation */}
                <a
                  href={c.googleMapsUrl || "https://www.google.com/maps/place/%D8%B4%D8%B1%D9%83%D8%A9+%D8%AA%D8%B3%D8%A7%D9%85%D9%8A+%D8%A7%D9%84%D8%A3%D8%B9%D9%85%D8%A7%D9%84%E2%80%AD/@21.3872248,39.8077324,17z/data=!3m1!4b1!4m6!3m5!1s0x15c21b124251096f:0x5f3bed74fbe7b8f3!8m2!3d21.3872248!4d39.8077324!16s%2Fg%2F11zyn3z20n"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 hover:border-[#c59a45] dark:hover:border-[#dfb76c] flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer block"
                  title={lang === 'ar' ? 'انقر لفتح الموقع مباشرة على خرائط Google' : 'Click to open in Google Maps'}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#1d4ed8]/20 text-[#1d4ed8] dark:text-[#60a5fa] group-hover:bg-[#c59a45]/20 group-hover:text-[#9a752a] dark:group-hover:text-[#dfb76c] flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                    <MapPin className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                        {lang === 'ar' ? 'المقر والعنوان' : 'Office Address'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c59a45]/15 text-[#9a752a] dark:text-[#dfb76c] font-bold">
                        {lang === 'ar' ? 'خرائط Google 🗺️' : 'Google Maps 🗺️'}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#0f172a] dark:text-white group-hover:text-[#1d4ed8] dark:group-hover:text-[#dfb76c] leading-snug mt-1 transition-colors">
                      {lang === 'ar' ? c.address : c.addressEn}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
                      <span>{c.coordinates || '21.3872248, 39.8077324'}</span>
                      {c.plusCode && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700">
                          {c.plusCode}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-[#9a752a] dark:text-[#dfb76c] flex items-center gap-1.5">
                      <span>{lang === 'ar' ? 'عرض الاتجاهات والملاحة المباشرة' : 'Open live directions'}</span>
                      <span className="transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">←</span>
                    </div>
                  </div>
                </a>

                <CustomParagraphSlot placement="contact:beforeMap" lang={lang} content={content} />

                {/* Google Maps Interactive Embed Frame */}
                {vis.map !== false && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative h-56 bg-slate-100 dark:bg-[#0b1120]">
                    <iframe
                      title="موقع شركة تسامي الأعمال لأنظمة السلامة"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(`${(c.coordinates || '21.3872248,39.8077324').replace(/\s+/g, '')} (${lang === 'ar' ? 'شركة تسامي الأعمال' : 'Tasami Business Company'})`)}&ll=${encodeURIComponent((c.coordinates || '21.3872248,39.8077324').replace(/\s+/g, ''))}&z=17&hl=${lang === 'ar' ? 'ar' : 'en'}&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      allowFullScreen
                    ></iframe>
                    <a
                      href={c.googleBusinessUrl || "https://share.google/9AmZxrxPQL8I9od2U"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 left-2 rtl:left-2 ltr:right-2 text-[10px] bg-slate-900/90 text-white px-2.5 py-1 rounded-lg border border-[#c59a45]/40 hover:bg-[#c59a45] hover:text-slate-950 transition font-bold"
                    >
                      {lang === 'ar' ? 'الملف التعريفي في Google' : 'Google Business'}
                    </a>
                  </div>
                )}

                {/* Official Social Media Channels */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-3">
                    {lang === 'ar' ? 'حسابات التواصل الاجتماعي الرسمية' : 'Official Social Channels'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {c.socialLinks.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 hover:border-[#c59a45] text-slate-700 dark:text-slate-200 hover:text-[#1d4ed8] dark:hover:text-[#dfb76c] text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#c59a45]" />
                        <span>{s.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="lg:col-span-7 bg-white dark:bg-[#131c31] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="text-lg font-bold text-[#0f172a] dark:text-white mb-1 flex items-center justify-center gap-2 text-center">
                <MessageSquare className="w-5 h-5 text-[#1d4ed8] dark:text-[#60a5fa]" />
                <span>{lang === 'ar' ? 'طلب عرض سعر / معاينة فورية للموقع' : 'Request Instant Quotation / Site Survey'}</span>
              </h4>
              <FormattedParagraph
                content={content}
                lang={lang}
                paraKey="contactBanner"
                className="w-full text-xs text-slate-500 dark:text-slate-400 mb-6 text-center"
                defaultText={lang === 'ar' ? 'أدخل بيانات موقعك ومشروعك وسيقوم المهندس المختص بالتواصل معك مباشرة:' : 'Provide your project specs and our engineering advisor will contact you directly:'}
              />

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-700/60 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h5 className="text-base font-bold text-emerald-900 dark:text-emerald-200">تم إرسال طلبك بنجاح!</h5>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">شكراً لثقتكم بتسامي الأعمال لأنظمة السلامة. سيتواصل معكم فريقنا الفني قريباً.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                  >
                    إرسال طلب آخر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">{lang === 'ar' ? 'الاسم أو المنشأة' : 'Name / Entity'} *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white focus:outline-none focus:border-[#1d4ed8] dark:focus:border-[#c59a45]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">{lang === 'ar' ? 'رقم الجوال' : 'Phone'} *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white focus:outline-none focus:border-[#1d4ed8] dark:focus:border-[#c59a45]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white focus:outline-none focus:border-[#1d4ed8] dark:focus:border-[#c59a45]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">{lang === 'ar' ? 'نوع النظام أو الخدمة' : 'System / Service'}</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="نظام إطفاء تلقائي FM200 / شبكة رشاشات / توريد"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white focus:outline-none focus:border-[#1d4ed8] dark:focus:border-[#c59a45]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">{lang === 'ar' ? 'تفاصيل الطلب أو الموقع' : 'Details'} *</label>
                    <textarea
                      rows="3"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="وصف المنشأة، المساحة، والأنظمة المطلوبة..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white focus:outline-none focus:border-[#1d4ed8] dark:focus:border-[#c59a45]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold text-[#0b1120] bg-[#c59a45] hover:bg-[#dfb76c] transition shadow flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'جارِ الإرسال...' : (lang === 'ar' ? 'إرسال طلب التسعير الآن' : 'Submit Request Now')}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
