import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactSection({ lang, content, onOpenConsultation }) {
  const t = content[lang];
  const cta = t.ctaBanner;

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
      
      {/* 1. Pre-Footer Call to Action Banner matching the design */}
      <div className="bg-gradient-to-r from-[#2a2113] via-[#3d3019] to-[#221a0f] text-white py-14 border-y border-[#c59a45]/30 relative overflow-hidden">
        {/* Subtle geometric pattern in background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c59a45_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-right rtl:lg:text-right ltr:lg:text-left">
            
            {/* Headline and Vision */}
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

            {/* Actions & Vision 2030 Badge */}
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

      {/* 2. Direct Contact Form & Info */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Information & Channels */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-black tracking-widest text-[#9a752a] uppercase bg-[#c59a45]/10 px-3.5 py-1 rounded-md inline-block">
                  {lang === 'ar' ? 'قنوات الاتصال المباشر' : 'Direct Channels'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                  {lang === 'ar' ? 'يسعدنا استقبال استفساراتكم' : 'We Welcome Your Inquiries'}
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  {lang === 'ar' ? 'فريق خدمة العملاء والمهندسين الاستشاريين متواجدون للرد على كافة متطلباتكم.' : 'Our customer support and engineering teams are ready to assist you.'}
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#c59a45] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-slate-500 font-semibold">{lang === 'ar' ? 'رقم الجوال والاتصال المباشر' : 'Direct Mobile & Call'}</span>
                    <a href="tel:+966591684133" className="block text-base font-bold text-slate-900 hover:text-[#c59a45] font-sans direction-ltr text-right" dir="ltr">
                      +966 59 168 4133
                    </a>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-[11px] text-emerald-600 font-medium">متاح للاتصال وخدمة العملاء</span>
                      <a
                        href="https://wa.me/966591684133?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%B7%D9%84%D8%A8%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D8%A3%D9%85%D9%86%20%D9%88%D8%B3%D9%84%D8%A7%D9%85%D8%A9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md"
                      >
                        <span>محادثة واتساب 💬</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#c59a45] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</span>
                    <a href="mailto:makkah-branch@tasaami.com" className="block text-base font-bold text-slate-900 hover:text-[#c59a45] font-sans">
                      makkah-branch@tasaami.com
                    </a>
                    <span className="text-[11px] text-slate-400">فرع مكة المكرمة • الرد الفوري</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#c59a45] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold">{lang === 'ar' ? 'العنوان والموقع' : 'Branch Address'}</span>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mt-0.5">
                      {lang === 'ar' ? (
                        <>المملكة العربية السعودية - مكة المكرمة - حي الشوقية - شارع ابراهيم الخليل 24351</>
                      ) : (
                        <>KSA - Makkah Al-Mukarramah - Ash Shawqiyah Dist. - Ibrahim Al-Khalil Str. 24351</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Message Form */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-200">
              <h4 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#c59a45]" />
                <span>{lang === 'ar' ? 'أرسل لنا رسالة فورية' : 'Send an Instant Message'}</span>
              </h4>
              <p className="text-xs text-slate-500 mb-6">
                {lang === 'ar' ? 'املأ الحقول التالية وسيتواصل معك الموظف المختص مباشرة:' : 'Fill in the details below and our team will get back to you promptly:'}
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h5 className="text-base font-bold text-emerald-900">تم إرسال رسالتك بنجاح!</h5>
                  <p className="text-xs text-emerald-700">شكراً لتواصلك مع تسامي للسلامة. سنرد على استفسارك قريباً.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'ar' ? 'الاسم' : 'Name'} *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c59a45]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'ar' ? 'رقم الجوال' : 'Phone'}</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c59a45]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c59a45]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'ar' ? 'الموضوع' : 'Subject'}</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="استفسار عن رخصة سلامة / كود البناء"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c59a45]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{lang === 'ar' ? 'نص الرسالة' : 'Message'} *</label>
                    <textarea
                      rows="3"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c59a45]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#c59a45] hover:bg-[#b58a38] transition shadow flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'جارِ الإرسال...' : (lang === 'ar' ? 'إرسال الرسالة الآن' : 'Send Message')}</span>
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
