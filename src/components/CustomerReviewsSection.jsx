import React, { useEffect, useMemo, useState } from 'react';
import {
  Star,
  Quote,
  Send,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Award
} from 'lucide-react';
import {
  subscribeCustomerReviews,
  submitCustomerReview
} from '../services/firebase';

export default function CustomerReviewsSection({ lang = 'ar', content }) {
  const isAr = lang === 'ar';
  const cfg = content?.[lang]?.customerReviews || {};
  const [liveApproved, setLiveApproved] = useState([]);

  // Submission form state (always submitted with status: 'pending')
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState('');

  useEffect(() => {
    const unsub = subscribeCustomerReviews({
      approvedOnly: true,
      onUpdate: (list) => setLiveApproved(list)
    });
    return () => unsub();
  }, []);

  const approvedReviews = useMemo(() => {
    const seeded = Array.isArray(cfg.items)
      ? cfg.items.filter((r) => (r.status || 'approved') === 'approved')
      : [];
    const seen = new Set();
    const combined = [];
    for (const r of [...liveApproved, ...seeded]) {
      if (r && r.status === 'approved' && !seen.has(r.id || r.comment)) {
        seen.add(r.id || r.comment);
        combined.push(r);
      }
    }
    return combined;
  }, [liveApproved, cfg.items]);

  const avgRating = useMemo(() => {
    if (approvedReviews.length === 0) return '5.0';
    const sum = approvedReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return (sum / approvedReviews.length).toFixed(1);
  }, [approvedReviews]);

  if (cfg.enabled === false) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);
    setSubmittedNotice('');
    try {
      await submitCustomerReview({
        name,
        company,
        projectType,
        rating,
        comment,
        lang,
        status: 'pending' // Never published publicly until Admin approves
      });
      setName('');
      setCompany('');
      setProjectType('');
      setRating(5);
      setComment('');
      setSubmittedNotice(
        isAr
          ? 'شكراً لمشاركتك! تم استلام تقييمك وهو الآن قيد المراجعة، ولن يظهر في الموقع إلا بعد موافقة الإدارة.'
          : 'Thank you! Your review has been received and is pending admin approval before public display.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="customer-reviews"
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-[#c59a45] bg-[#c59a45]/10 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5" />
            {cfg.tag || (isAr ? 'قيّمنا وآراء العملاء' : 'Rate Us & Client Reviews')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white mt-3">
            {cfg.title || (isAr ? 'ثقة عملائنا وشركاء النجاح' : 'What Our Clients Say')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-2xl">
            {cfg.subtitle ||
              (isAr
                ? 'آراء وتقييمات معتمدة لعملائنا في المشاريع التجارية والصناعية والسكنية، تخضع جميعها لمراجعة واعتماد الإدارة.'
                : 'Verified testimonials from our commercial, industrial, and residential fire-safety clients.')}
          </p>
        </div>

        {/* Summary Rating Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <div className="text-2xl font-black text-[#113163] dark:text-[#dfb76c]">
            {avgRating}
          </div>
          <div>
            <div className="flex text-[#c59a45]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? `${approvedReviews.length} تقييم معتمد`
                : `${approvedReviews.length} Approved Reviews`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Approved Reviews Cards + Rate Us Submission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Approved Reviews List */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {approvedReviews.map((rev, idx) => (
            <div
              key={rev.id || idx}
              className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-[#c59a45]/60 transition flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-[#c59a45]">
                    {Array.from({ length: Math.min(5, Math.max(1, Number(rev.rating) || 5)) }).map(
                      (_, sIdx) => (
                        <Star key={sIdx} className="w-4 h-4 fill-current" />
                      )
                    )}
                  </div>
                  <Quote className="w-5 h-5 text-[#c59a45]/40" />
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  “{rev.comment}”
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#0f172a] dark:text-white">
                    {rev.name}
                  </h4>
                  {(rev.company || rev.projectType) && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-[#c59a45]" />
                      <span>
                        {[rev.company, rev.projectType].filter(Boolean).join(' • ')}
                      </span>
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  {isAr ? 'معتمد' : 'Verified'}
                </span>
              </div>
            </div>
          ))}

          {approvedReviews.length === 0 && (
            <div className="sm:col-span-2 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
              {isAr
                ? 'لا توجد تقييمات منشورة حالياً. كن أول من يشاركنا رأيه!'
                : 'No published reviews yet. Be the first to rate our services!'}
            </div>
          )}
        </div>

        {/* Rate Us / Submit New Review Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white dark:bg-[#131c31] rounded-2xl border border-[#c59a45]/40 p-6 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-black text-lg text-[#0f172a] dark:text-white">
                {isAr ? 'قيّمنا وشارك رأيك' : 'Rate Us & Share Feedback'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'رأيك يهمنا للارتقاء بخدماتنا في مجال السلامة'
                  : 'Your review helps us serve you better'}
              </p>
            </div>
            <ShieldCheck className="w-6 h-6 text-[#c59a45]" />
          </div>

          {/* Interactive Star Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              {isAr ? 'التقييم العام:' : 'Your Rating:'}
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const active = (hoverRating || rating) >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starVal)}
                    className="p-1 transition-transform hover:scale-110"
                    aria-label={`${starVal} stars`}
                  >
                    <Star
                      className={`w-7 h-7 transition ${
                        active
                          ? 'text-[#c59a45] fill-[#c59a45]'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-black text-[#113163] dark:text-[#dfb76c] mx-2">
                {rating} / 5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                {isAr ? 'الاسم الكريم *' : 'Your Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? 'م. أحمد الحربي' : 'Eng. Ahmed'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white outline-none focus:border-[#c59a45]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                {isAr ? 'اسم الشركة / المنشأة' : 'Company / Facility'}
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={isAr ? 'مؤسسة / شركة...' : 'Company name'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white outline-none focus:border-[#c59a45]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              {isAr ? 'المنتج أو الخدمة المقدمة' : 'Product / Service'}
            </label>
            <input
              type="text"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              placeholder={
                isAr
                  ? 'توريد مضخات، تركيب شبكة إطفاء، صيانة...'
                  : 'Fire pumps, sprinkler installation...'
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white outline-none focus:border-[#c59a45]"
            />
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              {isAr ? 'رأيك وتجربتك معنا *' : 'Your Experience *'}
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب تقييمك لجودة المنتجات، الالتزام بالمواعيد، أو الدعم الفني...'
                  : 'Share your feedback on quality, timeliness, and support...'
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white outline-none focus:border-[#c59a45]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#113163] to-[#1a4380] hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>
              {submitting
                ? isAr
                  ? 'جاري الإرسال...'
                  : 'Submitting...'
                : isAr
                ? 'إرسال التقييم للمراجعة والنشر'
                : 'Submit Review for Approval'}
            </span>
          </button>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
            {isAr
              ? 'ملاحظة: تخضع جميع الآراء لمراجعة الإدارة قبل نشرها للجمهور.'
              : 'Note: All reviews are moderated by admin before appearing publicly.'}
          </p>

          {submittedNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-200">
              {submittedNotice}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
