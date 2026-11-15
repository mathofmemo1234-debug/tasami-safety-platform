import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Building,
  Calendar,
  LogOut,
  Save,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  Sparkles,
  Edit3,
  Heart,
  Star,
  Trash2,
  Send,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { updateVisitorProfile, logoutVisitor } from '../services/auth';
import { getFavorites, toggleProductFavorite, subscribeToFavorites } from '../services/favorites';
import { submitCustomerReview, subscribeCustomerReviews, db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  lang = 'ar',
  onLogout,
  onNavigateToProducts,
  onOpenConsultation
}) {
  const isAr = lang === 'ar';

  // Tabs: 'profile' | 'favorites' | 'reviews' | 'requests'
  const [activeTab, setActiveTab] = useState('favorites');
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Favorites state
  const [favorites, setFavorites] = useState([]);

  // Consultations state
  const [consultations, setConsultations] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Review & Rating State
  const [rating, setRating] = useState(5);
  const [reviewRole, setReviewRole] = useState(user?.company ? `ممثل ${user.company}` : 'عميل معتمد');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCompany(user.company || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      if (user.company) {
        setReviewRole(`ممثل ${user.company}`);
      }
    }
  }, [user]);

  // Subscribe to Favorites
  useEffect(() => {
    if (!user?.uid) {
      setFavorites([]);
      return;
    }
    setFavorites(getFavorites(user.uid));
    const unsub = subscribeToFavorites(user.uid, (list) => {
      setFavorites(Array.isArray(list) ? list : []);
    });
    return () => unsub();
  }, [user?.uid]);

  // Subscribe to Reviews submitted by this user
  useEffect(() => {
    if (!isOpen || !user?.uid) return;
    const unsub = subscribeCustomerReviews({
      approvedOnly: false,
      onUpdate: (allReviews) => {
        const mine = (allReviews || []).filter(
          (r) =>
            r.userId === user.uid ||
            (r.phone && r.phone === user.phone) ||
            (r.author && r.author === user.name)
        );
        setUserReviews(mine);
      }
    });
    return () => unsub();
  }, [isOpen, user?.uid, user?.phone, user?.name]);

  // Fetch Consultations
  useEffect(() => {
    if (!isOpen || !user?.uid) return;

    async function loadRequests() {
      setLoadingRequests(true);
      const results = [];

      try {
        const localRaw = localStorage.getItem('tasami_consultations');
        if (localRaw) {
          const parsed = JSON.parse(localRaw);
          if (Array.isArray(parsed)) {
            parsed.forEach((c) => {
              if (
                c.phone === user.phone ||
                c.email === user.email ||
                c.userId === user.uid
              ) {
                results.push({ ...c, source: 'local' });
              }
            });
          }
        }
      } catch {}

      if (db) {
        try {
          const qList = [];
          if (user.phone) {
            const qPhone = query(collection(db, 'consultations'), where('phone', '==', user.phone));
            qList.push(getDocs(qPhone));
          }
          if (user.email) {
            const qEmail = query(collection(db, 'consultations'), where('email', '==', user.email));
            qList.push(getDocs(qEmail));
          }

          const snaps = await Promise.allSettled(qList);
          snaps.forEach((res) => {
            if (res.status === 'fulfilled' && res.value) {
              res.value.forEach((docSnap) => {
                const data = docSnap.data();
                if (!results.some((r) => r.id === docSnap.id)) {
                  results.push({ id: docSnap.id, ...data, source: 'firestore' });
                }
              });
            }
          });
        } catch (err) {
          console.warn('Could not query user consultations from Firestore:', err);
        }
      }

      setConsultations(results);
      setLoadingRequests(false);
    }

    loadRequests();
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    try {
      await updateVisitorProfile(user.uid, {
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase()
      });
      setStatusMsg(isAr ? 'تم حفظ التعديلات بنجاح!' : 'Profile updated successfully!');
      setTimeout(() => setStatusMsg(''), 2500);
    } catch (err) {
      setStatusMsg(err.message || (isAr ? 'حدث خطأ أثناء الحفظ.' : 'Save failed.'));
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFavorite = (product) => {
    toggleProductFavorite(user.uid, product);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    setReviewSuccess('');

    try {
      await submitCustomerReview({
        author: name.trim() || user.name || 'عميل معتمد',
        authorEn: name.trim() || user.name || 'Verified Client',
        role: reviewRole.trim() || (isAr ? 'عميل معتمد' : 'Verified Client'),
        roleEn: reviewRole.trim() || 'Verified Client',
        comment: reviewComment.trim(),
        commentEn: reviewComment.trim(),
        rating: Number(rating) || 5,
        userId: user.uid,
        phone: user.phone || '',
        email: user.email || ''
      });

      setReviewSuccess(
        isAr
          ? 'شكراً لتقييمك الكريم! تم استلام رأيك وسيظهر في شريط آراء العملاء فور المراجعة.'
          : 'Thank you for your rating! Your review has been submitted for moderation.'
      );
      setReviewComment('');
    } catch (err) {
      setStatusMsg(err.message || 'حدث خطأ أثناء إرسال التقييم.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSignOut = async () => {
    await logoutVisitor();
    if (onLogout) onLogout();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in font-cairo"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#131c31] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with User Info & Gold Accents */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#162d6c] via-[#0f2152] to-[#162d6c] text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black text-xl flex items-center justify-center shadow-lg border-2 border-white/20 flex-shrink-0">
                {user.name ? user.name.trim()[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-white">{user.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c59a45]/25 text-[#dfb76c] border border-[#c59a45]/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#c59a45]" />
                    <span>{isAr ? 'زائر / عميل مسجل' : 'Registered Client'}</span>
                  </span>
                </div>
                <p className="text-xs text-blue-200/90 font-mono mt-0.5" dir="ltr">
                  {user.phone || user.email || 'Tasami Member'}
                </p>
                {user.company && (
                  <p className="text-[11px] text-[#dfb76c] flex items-center gap-1 mt-0.5 font-bold">
                    <Building className="w-3 h-3" />
                    <span>{user.company}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4 Feature Tabs: Favorites, Ratings, Requests, Profile */}
          <div className="grid grid-cols-4 gap-1 p-1 mt-4 rounded-xl bg-black/30 border border-white/10 text-[11px] sm:text-xs font-bold text-center">
            {/* 1. Favorites Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-current' : 'text-rose-400'}`} />
              <span>{isAr ? 'المفضلة' : 'Wishlist'}</span>
              {favorites.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center font-mono">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* 2. Rating & Review Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${activeTab === 'reviews' ? 'fill-current' : 'text-amber-400'}`} />
              <span>{isAr ? 'التقييم' : 'Rate Us'}</span>
            </button>

            {/* 3. Requests / Consultations */}
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isAr ? 'طلباتي' : 'Requests'}</span>
              {consultations.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#162d6c] text-white text-[9px] flex items-center justify-center font-mono">
                  {consultations.length}
                </span>
              )}
            </button>

            {/* 4. Profile Info */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isAr ? 'حسابي' : 'Profile'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(94vh-180px)] space-y-4">
          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* TAB 1: FAVORITES (التفضيل) */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white">
                    {isAr ? 'قائمة المنتجات المفضلة لديك' : 'My Saved Favorites'}
                  </h4>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {favorites.length} {isAr ? 'منتج محفوظ' : 'items'}
                </span>
              </div>

              {favorites.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                    <Heart className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {isAr ? 'لم تقم بإضافة منتجات للمفضلة بعد' : 'No saved favorites yet'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {isAr
                      ? 'يمكنك الضغط على رمز القلب (❤️) الموجود على أي منتج في كتالوج المنتجات لحفظه والرجوع إليه هنا في أي وقت.'
                      : 'Click the heart icon on any product in our catalog to save it here for quick access.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onNavigateToProducts) onNavigateToProducts();
                    }}
                    className="btn-flashy-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0b1120]"
                  >
                    <span>{isAr ? 'تصفح كتالوج المنتجات الآن ←' : 'Browse Products Catalog →'}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favorites.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 hover:border-[#c59a45]/50 flex items-center justify-between gap-3 group transition shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <img
                          src={prod.image || './images/product-1.jpg'}
                          alt={prod.ar}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src = './images/product-1.jpg';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0 text-right rtl:text-right ltr:text-left">
                        <h5 className="text-xs font-bold text-[#0f172a] dark:text-white line-clamp-1">
                          {prod.ar || prod.en}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-mono line-clamp-1 mt-0.5">
                          {prod.specs || prod.category || prod.en}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onOpenConsultation) onOpenConsultation(prod.ar || prod.en);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#162d6c] text-white hover:bg-[#1d4ed8] transition"
                          >
                            {isAr ? 'طلب عرض سعر' : 'Get Quote'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFavorite(prod)}
                            title={isAr ? 'إزالة من المفضلة' : 'Remove'}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REVIEWS & RATINGS (التقييم) */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                    {isAr ? 'شاركنا تقييمك ورأيك في خدمات وأنظمة تسامي الأعمال' : 'Rate Tasami Business Safety Services'}
                  </h4>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                    {isAr
                      ? 'رأيك يمثل قيمة كبرى لرفع جودة التنفيذ وخدمة مشاريع السلامة بالمملكة. تظهر تقييمات العملاء المعتمدة في شريط التقييمات بالموقع.'
                      : 'Your feedback helps us continuously improve our engineering and fire protection solutions across KSA.'}
                  </p>
                </div>
              </div>

              {reviewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{reviewSuccess}</span>
                </div>
              )}

              {/* Submit Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1120]">
                {/* Star Rating Picker */}
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200 mb-1.5">
                    {isAr ? 'تقييمك الإجمالي *' : 'Your Rating *'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 transition transform hover:scale-115 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            s <= rating
                              ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono mr-2 rtl:mr-2 ltr:ml-2">
                      ({rating} / 5 نجوم)
                    </span>
                  </div>
                </div>

                {/* Role / Title */}
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200 mb-1">
                    {isAr ? 'الصفة أو المنشأة' : 'Your Role or Organization'}
                  </label>
                  <input
                    type="text"
                    value={reviewRole}
                    onChange={(e) => setReviewRole(e.target.value)}
                    placeholder={isAr ? 'مثال: مدير مشروع / مهندس استشاري / صاحب منشأة' : 'e.g. Project Manager / Consultant'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-xs text-[#0f172a] dark:text-white"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200 mb-1">
                    {isAr ? 'ملاحظاتك ورأيك في الجودة والالتزام *' : 'Your Review & Comments *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={isAr ? 'اكتب رأيك الصادق في سرعة التوريد، دقة المخططات، والالتزام بمعايير الدفاع المدني...' : 'Share your honest feedback regarding execution, delivery, and safety compliance...'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-xs text-[#0f172a] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-flashy-gold w-full py-2.5 rounded-xl font-bold text-xs text-[#0b1120] flex items-center justify-center gap-2 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? (isAr ? 'جارِ إرسال التقييم...' : 'Submitting...') : (isAr ? 'إرسال التقييم للاعتماد' : 'Submit Review')}</span>
                </button>
              </form>

              {/* Previous reviews by this user */}
              {userReviews.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#c59a45]" />
                    <span>{isAr ? 'تقييماتك السابقة:' : 'Your previous reviews:'}</span>
                  </h5>
                  {userReviews.map((rev, i) => (
                    <div key={rev.id || i} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= (Number(rev.rating) || 5)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rev.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {rev.status === 'approved' ? (isAr ? 'معتمد ومنشور ✓' : 'Published') : (isAr ? 'قيد المراجعة' : 'Pending')}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">{rev.comment || rev.commentEn}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REQUESTS / CONSULTATIONS (طلباتي واستشاراتي) */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              {loadingRequests ? (
                <div className="py-12 text-center">
                  <div className="w-8 h-8 border-3 border-[#c59a45] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span className="text-xs text-slate-500">{isAr ? 'جاري استرجاع طلباتك...' : 'Loading requests...'}</span>
                </div>
              ) : consultations.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'لا توجد طلبات أو استشارات سابقة' : 'No previous requests found'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {isAr ? 'عند تقديمك لأي استشارة أو طلب عرض سعر، ستظهر تفاصيلها وحالتها هنا مباشرة.' : 'Your submitted consultation requests and quotes will be tracked here.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenConsultation) onOpenConsultation();
                    }}
                    className="btn-flashy-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0b1120] mt-2"
                  >
                    <span>{isAr ? 'طلب استشارة جديدة الآن ←' : 'Request Consultation →'}</span>
                  </button>
                </div>
              ) : (
                consultations.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 space-y-2 text-right rtl:text-right ltr:text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#162d6c] dark:text-[#60a5fa]">
                        {item.service_type || item.service || (isAr ? 'طلب استشارة عامة' : 'General Consultation')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{isAr ? 'قيد المتابعة' : 'In Review'}</span>
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-[#131c31] p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        {item.notes}
                      </p>
                    )}

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>{item.sector || (isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia')}</span>
                      <span>{item.date ? new Date(item.date).toLocaleDateString('ar-SA') : (isAr ? 'طلب حديث' : 'Recent')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: PROFILE INFO (بيانات الحساب) */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200">
                  {isAr ? 'الاسم الكريم' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs sm:text-sm text-[#0f172a] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c59a45]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200">
                  {isAr ? 'اسم المنشأة أو الشركة' : 'Company Name'}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={isAr ? 'اختياري' : 'Optional'}
                    className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs sm:text-sm text-[#0f172a] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c59a45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200">
                    {isAr ? 'رقم الجوال' : 'Mobile Phone'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                      placeholder="05XXXXXXXX"
                      className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs sm:text-sm text-[#0f172a] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c59a45]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      dir="ltr"
                      placeholder="name@company.com"
                      className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs sm:text-sm text-[#0f172a] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#c59a45]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-flashy-gold flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#0b1120] flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? (isAr ? 'جارِ الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isAr ? 'خروج' : 'Log Out'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
