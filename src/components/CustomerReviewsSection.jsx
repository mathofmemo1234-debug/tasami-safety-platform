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
import { getLocalUser } from '../services/auth';

export default function CustomerReviewsSection({ lang = 'ar', content }) {
  const isAr = lang === 'ar';
  const cfg = content?.[lang]?.customerReviews || {};
  const [liveApproved, setLiveApproved] = useState([]);

  const currentUser = getLocalUser();

  // Submission form state (always submitted with status: 'pending')
  const [name, setName] = useState(currentUser?.name || '');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [projectType, setProjectType] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState('');

  useEffect(() => {
    const user = getLocalUser();
    if (user) {
      if (!name) setName(user.name || '');
      if (!company) setCompany(user.company || '');
    }
  }, []);

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
        userId: currentUser?.uid || null,
        phone: currentUser?.phone || '',
        email: currentUser?.email || '',
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
      className="py-6 px-5 sm:px-8 lg:px-10 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="space-y-2 text-start">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#C5A059] dark:text-[#D4AF37]">
            <Award className="w-3.5 h-3.5" />
            {cfg.tag || (isAr ? 'قيّمنا وآراء العملاء' : 'Rate Us & Client Reviews')}
          </span>
          <h2 className="text-lg sm:text-xl lg:text-[1.375rem] font-bold text-[#002366] dark:text-white leading-[1.4] tracking-[-0.01em]">
            {cfg.title || (isAr ? 'ثقة عملائنا وشركاء النجاح' : 'What Our Clients Say')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-2xl">
            {cfg.subtitle ||
              (isAr
                ? 'تقييمات معتمدة من عملائنا بعد تنفيذ مشاريع وتوريدات السلامة.'
                : 'Verified ratings from our fire-safety project and supply clients.')}
          </p>
        </div>

        {/* Summary Rating Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="text-xl font-bold text-[#002366] dark:text-[#D4AF37]">
            {avgRating}
          </div>
          <div>
            <div className="flex text-[#C5A059]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
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
              className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-[#C5A059] p-5 transition-colors flex flex-col justify-between gap-4 text-start"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-[#C5A059]">
                    {Array.from({ length: Math.min(5, Math.max(1, Number(rev.rating) || 5)) }).map(
                      (_, sIdx) => (
                        <Star key={sIdx} className="w-3.5 h-3.5 fill-current" />
                      )
                    )}
                  </div>
                  <Quote className="w-4 h-4 text-[#C5A059]/50" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  “{rev.comment}”
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#002366] dark:text-white">
                    {rev.name}
                  </h4>
                  {(rev.company || rev.projectType) && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-[#C5A059]" />
                      <span>
                        {[rev.company, rev.projectType].filter(Boolean).join(' • ')}
                      </span>
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-transparent border border-[#C5A059]/50 text-[#002366] dark:text-[#D4AF37] text-[10px] font-semibold shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-[#C5A059]" />
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
          className="lg:col-span-5 bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 text-start"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#002366] dark:text-white">
                {isAr ? 'قيّمنا وشارك رأيك' : 'Rate Us & Share Feedback'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'رأيك يهمنا للارتقاء بخدماتنا في مجال السلامة'
                  : 'Your review helps us serve you better'}
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
          </div>

          {/* Interactive Star Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
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
                      className={`w-6 h-6 transition ${
                        active
                          ? 'text-[#C5A059] fill-[#C5A059]'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-bold text-[#002366] dark:text-[#D4AF37] mx-2">
                {rating} / 5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {isAr ? 'الاسم الكريم *' : 'Your Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? 'م. أحمد الحربي' : 'Eng. Ahmed'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-[#0f172a] dark:text-white outline-none focus:border-[#002366]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {isAr ? 'اسم الشركة / المنشأة' : 'Company / Facility'}
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={isAr ? 'مؤسسة / شركة...' : 'Company name'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-[#0f172a] dark:text-white outline-none focus:border-[#002366]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
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
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-[#0f172a] dark:text-white outline-none focus:border-[#002366]"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
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
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-[#0f172a] dark:text-white outline-none focus:border-[#002366]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-5 rounded-full bg-[#002366] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>
              {submitting
                ? isAr
                  ? 'جاري الإرسال...'
                  : 'Submitting...'
                : isAr
                ? 'إرسال التقييم للمراجعة'
                : 'Submit Review'}
            </span>
          </button>

          <p className="text-[11px] text-slate-400 dark:text-slate-400 text-center">
            {isAr
              ? 'ملاحظة: تخضع جميع الآراء لمراجعة الإدارة قبل نشرها.'
              : 'Note: All reviews are moderated by admin before appearing publicly.'}
          </p>

          {submittedNotice && (
            <div className="p-3 rounded-xl bg-white dark:bg-[#0b1120] border border-[#C5A059] text-xs font-semibold text-[#002366] dark:text-[#D4AF37]">
              {submittedNotice}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
