import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare, Share2 } from 'lucide-react';

export default function ContactSection({ lang, content, onOpenConsultation }) {
  const t = content[lang];
  const cta = t.ctaBanner;
  const c = t.contact;

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
      <div className="bg-gradient-to-r from-[#2a2113] via-[#3d3019] to-[#221a0f] text-white py-14 border-y border-[#c59a45]/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c59a45_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-right rtl:lg:text-right ltr:lg:text-left">
            
            <div className="space-y-2">
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {cta.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono tracking-widest text-[#dfb76c] uppercase">
                {cta.subtitle}
              </p>
              <p className="text-xs text-slate-300 max-w-xl">
                {cta.desc}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <button
                onClick={onOpenConsultation}
                className="px-8 py-4 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
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
                <div className="text-[9px] text-slate-300 leading-tight text-right border-r border-white/20 pr-2">
                  المملكة العربية السعودية<br />
                  <span className="font-mono text-[8px] text-slate-400">KINGDOM OF SAUDI ARABIA</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Direct Contact Form & Channels */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-black tracking-widest text-[#9a752a] uppercase bg-[#c59a45]/10 px-3.5 py-1 rounded-md inline-block">
                  {c.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                  {c.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  {c.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone Numbers */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Phone className="w-4 h-4 text-[#c59a45]" />
                    <span>{lang === 'ar' ? 'أرقام الاتصال والواتساب المباشر' : 'Direct Phone & WhatsApp'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href="tel:+966591684133"
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 hover:text-[#c59a45] hover:border-[#c59a45] text-center block font-mono"
                      dir="ltr"
                    >
                      +966 59 168 4133
                    </a>
                    <a
                      href="tel:+966533480098"
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 hover:text-[#c59a45] hover:border-[#c59a45] text-center block font-mono"
                      dir="ltr"
                    >
                      +966 53 348 0098
                    </a>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 font-semibold">متاح طوال أيام الأسبوع</span>
                    <a
                      href="https://wa.me/966591684133"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      محادثة فورية عبر واتساب 💬
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#c59a45] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">{lang === 'ar' ? 'البريد الإلكتروني الرسمي' : 'Official Email'}</span>
                    <a href={`mailto:${c.email}`} className="text-sm font-bold text-slate-900 hover:text-[#c59a45] font-sans">
                      {c.email}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">فرع مكة المكرمة • الرد والاستجابة السريعة</span>
                  </div>
                </div>

                {/* Address */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#c59a45] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">{lang === 'ar' ? 'المقر والعنوان' : 'Office Address'}</span>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mt-0.5">
                      {lang === 'ar' ? c.address : c.addressEn}
                    </div>
                  </div>
                </div>

                {/* Official Social Media Channels */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold block mb-3">
                    {lang === 'ar' ? 'حسابات التواصل الاجتماعي الرسمية' : 'Official Social Channels'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {c.socialLinks.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#c59a45] text-slate-700 hover:text-[#c59a45] text-xs font-semibold flex items-center gap-1.5 transition"
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
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-200">
              <h4 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#c59a45]" />
                <span>{lang === 'ar' ? 'طلب عرض سعر / استشارة فورية' : 'Request Instant Quotation / Survey'}</span>
              </h4>
              <p className="text-xs text-slate-500 mb-6">
                {lang === 'ar' ? 'أدخل بيانات موقعك ومشروعك وسيقوم المهندس المختص بالتواصل معك مباشرة:' : 'Provide your project specs and our engineering advisor will contact you directly:'}
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h5 className="text-base font-bold text-emerald-900">تم إرسال طلبك بنجاح!</h5>
                  <p className="text-xs text-emerald-700">شكراً لثقتكم بتسامي الأعمال لأنظمة السلامة. سيتواصل معكم فريقنا الفني قريباً.</p>
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'ar' ? 'الاسم أو المنشأة' : 'Name / Entity'} *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c59a45]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'ar' ? 'رقم الجوال' : 'Phone'} *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c59a45]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c59a45]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'ar' ? 'نوع النظام أو الخدمة' : 'System / Service'}</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="نظام إطفاء تلقائي FM200 / شبكة رشاشات / توريد"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c59a45]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'ar' ? 'تفاصيل الطلب أو الموقع' : 'Details'} *</label>
                    <textarea
                      rows="3"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="وصف المنشأة، المساحة، والأنظمة المطلوبة..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c59a45]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#c59a45] hover:bg-[#b58a38] transition shadow flex items-center justify-center gap-2"
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
