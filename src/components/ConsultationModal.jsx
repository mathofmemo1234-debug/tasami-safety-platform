import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Send, Phone, Mail, Building, User } from 'lucide-react';

export default function ConsultationModal({ isOpen, onClose, lang, initialService = '' }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    sector: 'مجمع تجاري',
    service_type: initialService || 'معاينة هندسية وفنية لموقع المنشأة',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ في الإرسال');
      }

      setSuccessMsg(data.message || 'تم إرسال طلبكم بنجاح!');
      setTimeout(() => {
        // Auto close after 2.5s on success
        // onClose();
      }, 2500);
    } catch (err) {
      setErrorMsg(err.message || 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1120]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#131c31] rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1d4ed8]/10 dark:bg-[#1d4ed8]/25 border border-[#1d4ed8]/25 flex items-center justify-center text-[#1d4ed8] dark:text-[#60a5fa]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#0f172a] dark:text-white">
              {lang === 'ar' ? 'طلب معاينة هندسية وفنية للموقع' : 'Request Site Safety Inspection & Survey'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'ar' ? 'سيتواصل معكم مهندس معتمد لجدولة موعد المعاينة الميدانية وفحص الموقع' : 'A certified safety engineer will contact you for site survey'}
            </p>
          </div>
        </div>

        {/* Success Message Alert */}
        {successMsg ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-emerald-900">
              {lang === 'ar' ? 'تم استلام طلب المعاينة بنجاح' : 'Inspection Request Received!'}
            </h4>
            <p className="text-xs text-emerald-700 leading-relaxed max-w-md mx-auto">
              {successMsg}
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              {lang === 'ar' ? 'تم، إغلاق النافذة' : 'Done, Close Window'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            {/* Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  {lang === 'ar' ? 'الاسم الكريم *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={lang === 'ar' ? 'م. محمد الأحمد' : 'John Doe'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#1d4ed8] dark:focus:border-[#c59a45] focus:ring-2 focus:ring-[#1d4ed8]/20 text-xs text-[#0f172a] dark:text-white bg-white dark:bg-[#0b1120]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  {lang === 'ar' ? 'اسم المنشأة / الشركة' : 'Company Name'}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder={lang === 'ar' ? 'شركة الاستثمار العقاري' : 'Company Inc'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#1d4ed8] dark:focus:border-[#c59a45] focus:ring-2 focus:ring-[#1d4ed8]/20 text-xs text-[#0f172a] dark:text-white bg-white dark:bg-[#0b1120]"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#1d4ed8] dark:focus:border-[#c59a45] focus:ring-2 focus:ring-[#1d4ed8]/20 text-xs text-[#0f172a] dark:text-white bg-white dark:bg-[#0b1120]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  {lang === 'ar' ? 'رقم الجوال *' : 'Mobile Phone *'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#1d4ed8] dark:focus:border-[#c59a45] focus:ring-2 focus:ring-[#1d4ed8]/20 text-xs text-[#0f172a] dark:text-white bg-white dark:bg-[#0b1120]"
                />
              </div>
            </div>

            {/* Sector & Service Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  {lang === 'ar' ? 'القطاع / نوع المشروع' : 'Project Sector'}
                </label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#1d4ed8] dark:focus:border-[#c59a45] text-xs text-[#0f172a] dark:text-white bg-white dark:bg-[#0b1120]"
                >
                  <option value="مجمع تجاري">{lang === 'ar' ? 'مجمع تجاري / تسوق' : 'Commercial Mall'}</option>
                  <option value="برج إداري أو سكني">{lang === 'ar' ? 'برج إداري أو سكني' : 'Office/Residential Tower'}</option>
                  <option value="منشأة صناعية ومستودع">{lang === 'ar' ? 'منشأة صناعية أو مستودع' : 'Industrial / Warehouse'}</option>
                  <option value="مستشفى أو منشأة صحية">{lang === 'ar' ? 'مستشفى أو منشأة صحية' : 'Healthcare Facility'}</option>
                  <option value="مبنى حكومي">{lang === 'ar' ? 'مبنى حكومي أو تعليمي' : 'Governmental / Educational'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  {lang === 'ar' ? 'الخدمة المطلوبة' : 'Requested Service'}
                </label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#1d4ed8] dark:focus:border-[#c59a45] text-xs text-[#0f172a] dark:text-white bg-white dark:bg-[#0b1120]"
                >
                  <option value="أنظمة السلامة ومكافحة الحريق">أنظمة السلامة ومكافحة الحريق</option>
                  <option value="دراسات وتحليل المخاطر">دراسات وتحليل المخاطر</option>
                  <option value="تدقيق الامتثال وتراخيص سلامة">تدقيق الامتثال وتراخيص سلامة</option>
                  <option value="تدريب وتأهيل الكوادر">تدريب وتأهيل الكوادر</option>
                  <option value="استشارات هندسية ومخططات SBC">استشارات هندسية ومخططات SBC</option>
                  <option value="عقود صيانة دورية معتمدة">عقود صيانة دورية معتمدة</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                {lang === 'ar' ? 'ملاحظات أو متطلبات خاصة بالمشروع' : 'Project Details / Notes'}
              </label>
              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder={lang === 'ar' ? 'اذكر مساحة المشروع، المدينة، أو أي مواصفات خاصة...' : 'Provide project size, location, or specific requirements...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#1d4ed8] dark:focus:border-[#c59a45] text-xs text-[#0f172a] dark:text-white bg-white dark:bg-[#0b1120]"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-[#0b1120] bg-[#c59a45] hover:bg-[#dfb76c] shadow-md hover:shadow-gold-glow transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>{lang === 'ar' ? 'جارِ الإرسال...' : 'Submitting...'}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إرسال طلب المعاينة الهندسية' : 'Submit Site Survey Request'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
