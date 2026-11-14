import React, { useEffect, useMemo, useState } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  Edit3,
  Save,
  Megaphone,
  ShieldAlert,
  Eye
} from 'lucide-react';
import {
  subscribeCustomerReviews,
  submitCustomerReview,
  updateCustomerReview,
  deleteCustomerReview
} from '../services/firebase';

export default function ReviewsTickerAdminTab({
  localData,
  langTab,
  updateNested
}) {
  const [subView, setSubView] = useState('reviews'); // 'reviews' | 'ticker'
  const [reviews, setReviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  // Quick admin-add pre-approved review state
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const unsub = subscribeCustomerReviews({
      approvedOnly: false,
      onUpdate: (list) => setReviews(list)
    });
    return () => unsub();
  }, []);

  const reviewsCfg = localData?.[langTab]?.customerReviews || {
    enabled: true,
    tag: langTab === 'ar' ? 'قيّمنا وآراء العملاء' : 'Rate Us & Client Reviews',
    title:
      langTab === 'ar'
        ? 'ثقة عملائنا وشركاء النجاح'
        : 'Client Testimonials & Ratings',
    subtitle:
      langTab === 'ar'
        ? 'نعتز بتقييمات عملائنا بعد تنفيذ مشاريع وتوريدات السلامة — لا يُنشر أي تقييم إلا بعد مراجعة واعتماد الإدارة.'
        : 'Every submitted client review is carefully verified and published upon admin approval.',
    items: []
  };

  const tickerCfg = localData?.[langTab]?.announcementTicker || {
    enabled: true,
    speed: 'medium',
    includeApprovedReviews: true,
    items: []
  };

  const pendingCount = useMemo(
    () => reviews.filter((r) => r.status === 'pending').length,
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    if (statusFilter === 'all') return reviews;
    return reviews.filter((r) => (r.status || 'pending') === statusFilter);
  }, [reviews, statusFilter]);

  const startEdit = (rev) => {
    setEditingId(rev.id);
    setEditDraft({
      name: rev.name || '',
      company: rev.company || '',
      projectType: rev.projectType || '',
      rating: rev.rating || 5,
      comment: rev.comment || '',
      status: rev.status || 'pending'
    });
  };

  const saveEdit = async (revId) => {
    await updateCustomerReview(revId, editDraft);
    setEditingId(null);
  };

  const handleAddApprovedReview = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;
    await submitCustomerReview({
      name: newName,
      company: newCompany,
      projectType: newProject,
      rating: newRating,
      comment: newComment,
      lang: langTab,
      status: 'approved'
    });
    setNewName('');
    setNewCompany('');
    setNewProject('');
    setNewRating(5);
    setNewComment('');
  };

  const updateTickerField = (key, val) => {
    updateNested([langTab, 'announcementTicker', key], val);
  };

  const updateReviewsField = (key, val) => {
    updateNested([langTab, 'customerReviews', key], val);
  };

  const addAnnouncement = () => {
    const items = Array.isArray(tickerCfg.items) ? tickerCfg.items : [];
    updateTickerField('items', [
      {
        id: `ann_${Date.now()}`,
        badge: langTab === 'ar' ? 'تحديث جديد' : 'Update',
        text:
          langTab === 'ar'
            ? 'تسامي الأعمال — توريد فوري ومعتمد لأحدث مضخات وشبكات مكافحة الحريق.'
            : 'Tasaami Safety — Certified UL/FM fire protection supply across KSA.',
        linkPage: 'products'
      },
      ...items
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-black text-[#0f172a] dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-[#c59a45]" />
            <span>إدارة تقييمات العملاء (الموافقة المسبقة) وشريط الإعلانات المتحرك</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            أي تقييم يرسله الزوار يظل «بانتظار الموافقة» ولا يظهر للجمهور أو في شريط الإعلانات إلا بعد موافقتك وتحريره هنا.
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-[#0b1120] p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSubView('reviews')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition ${
              subView === 'reviews'
                ? 'bg-[#113163] text-white shadow'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>آراء وتقييمات العملاء ({reviews.length})</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-[#0b1120] text-[10px] font-black">
                {pendingCount} بانتظار الموافقة
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSubView('ticker')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition ${
              subView === 'ticker'
                ? 'bg-[#113163] text-white shadow'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>شريط الإعلانات المتحرك ({(tickerCfg.items || []).length})</span>
          </button>
        </div>
      </div>

      {subView === 'reviews' ? (
        <div className="space-y-5">
          {/* Notice about moderation */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              <strong>ضبط النشر التلقائي مُفعّل:</strong> أي رأي جديد يرسله العميل من الموقع يُحفظ بحالة «قيد المراجعة» ولا يظهر للزوار إلا بعد ضغط زر <strong>«موافقة ونشر»</strong>.
            </span>
          </div>

          {/* Section Headings Editor */}
          <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="md:col-span-3 flex items-center justify-between">
              <span className="font-bold text-sm text-[#0f172a] dark:text-white">
                نصوص قسم «قيّمنا وآراء العملاء» ({langTab === 'ar' ? 'العربية' : 'English'})
              </span>
              <label className="flex items-center gap-2 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={reviewsCfg.enabled !== false}
                  onChange={(e) => updateReviewsField('enabled', e.target.checked)}
                  className="w-4 h-4 accent-[#c59a45]"
                />
                <span>إظهار القسم في الموقع</span>
              </label>
            </div>
            <div>
              <label className="block font-semibold text-slate-500 mb-1">الشعار (Tag):</label>
              <input
                type="text"
                value={reviewsCfg.tag || ''}
                onChange={(e) => updateReviewsField('tag', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-500 mb-1">العنوان الرئيسي:</label>
              <input
                type="text"
                value={reviewsCfg.title || ''}
                onChange={(e) => updateReviewsField('title', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-500 mb-1">الوصف المختصر:</label>
              <input
                type="text"
                value={reviewsCfg.subtitle || ''}
                onChange={(e) => updateReviewsField('subtitle', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
              />
            </div>
          </div>

          {/* Add Pre-Approved Review by Admin */}
          <form
            onSubmit={handleAddApprovedReview}
            className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs"
          >
            <h5 className="font-bold text-sm text-[#0f172a] dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#c59a45]" />
              <span>إضافة رأي عميل معتمد مباشرة</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="اسم العميل *"
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
              />
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="الشركة / الجهة"
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
              />
              <input
                type="text"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                placeholder="نوع المشروع / التوريد"
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
              />
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-bold"
              >
                <option value={5}>★★★★★ (5/5)</option>
                <option value={4}>★★★★☆ (4/5)</option>
                <option value={3}>★★★☆☆ (3/5)</option>
                <option value={2}>★★☆☆☆ (2/5)</option>
                <option value={1}>★☆☆☆☆ (1/5)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="نص رأي العميل..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition"
              >
                إضافة واعتماد فوري
              </button>
            </div>
          </form>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `الكل (${reviews.length})` },
              { id: 'pending', label: `بانتظار الموافقة (${pendingCount})` },
              {
                id: 'approved',
                label: `معتمد ومنشور (${reviews.filter((r) => r.status === 'approved').length})`
              },
              {
                id: 'rejected',
                label: `مخفي (${reviews.filter((r) => r.status === 'rejected').length})`
              }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  statusFilter === f.id
                    ? 'bg-[#113163] text-white border-[#113163]'
                    : 'bg-white dark:bg-[#131c31] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Submitted & Dynamic Reviews Queue */}
          <div className="space-y-3">
            {filteredReviews.map((rev) => {
              const isEditing = editingId === rev.id;
              return (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs"
                >
                  {isEditing ? (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          value={editDraft.name}
                          onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                          placeholder="الاسم"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-bold"
                        />
                        <input
                          type="text"
                          value={editDraft.company}
                          onChange={(e) => setEditDraft({ ...editDraft, company: e.target.value })}
                          placeholder="الشركة"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                        />
                        <input
                          type="text"
                          value={editDraft.projectType}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, projectType: e.target.value })
                          }
                          placeholder="المشروع"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                        />
                        <select
                          value={editDraft.rating}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, rating: Number(e.target.value) })
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                        >
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                              {n} نجوم
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        rows={2}
                        value={editDraft.comment}
                        onChange={(e) =>
                          setEditDraft({ ...editDraft, comment: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-bold"
                        >
                          إلغاء
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEdit(rev.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#113163] text-white font-bold flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>حفظ التعديل</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-sm text-[#0f172a] dark:text-white">
                            {rev.name}
                          </span>
                          {rev.company && (
                            <span className="text-slate-500 dark:text-slate-400">
                              • {rev.company}
                            </span>
                          )}
                          {rev.projectType && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#9c7224] dark:text-[#dfb76c] font-bold">
                              {rev.projectType}
                            </span>
                          )}
                          <span className="text-[#c59a45] font-black">
                            {'★'.repeat(rev.rating || 5)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              rev.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : rev.status === 'rejected'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            }`}
                          >
                            {rev.status === 'approved'
                              ? 'معتمد ومنشور'
                              : rev.status === 'rejected'
                              ? 'مخفي'
                              : 'بانتظار الموافقة'}
                          </span>

                          {rev.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => updateCustomerReview(rev.id, { status: 'approved' })}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>موافقة ونشر</span>
                            </button>
                          )}
                          {rev.status === 'approved' && (
                            <button
                              type="button"
                              onClick={() => updateCustomerReview(rev.id, { status: 'rejected' })}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>إخفاء</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => startEdit(rev)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تحرير</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustomerReview(rev.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="حذف التقييم"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-[#0b1120] p-2.5 rounded-xl">
                        “{rev.comment}”
                      </p>
                    </>
                  )}
                </div>
              );
            })}

            {filteredReviews.length === 0 && (
              <p className="text-center text-xs text-slate-500 py-4">
                لا توجد تقييمات زوار إضافية ضمن هذا التصنيف. يمكنك أيضاً تعديل التقييمات الثابتة الافتراضية أدناه.
              </p>
            )}
          </div>

          {/* Static/Seeded Approved Reviews inside siteContent */}
          <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-sm text-[#0f172a] dark:text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#c59a45]" />
                <span>التقييمات الأساسية المضمنة في الموقع ({(reviewsCfg.items || []).length})</span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  const list = Array.isArray(reviewsCfg.items) ? reviewsCfg.items : [];
                  updateReviewsField('items', [
                    {
                      id: `seed_${Date.now()}`,
                      name: langTab === 'ar' ? 'عميل مميز' : 'Valued Client',
                      company: langTab === 'ar' ? 'قطاع المقاولات' : 'Contracting Sector',
                      projectType: langTab === 'ar' ? 'نظام إطفاء متكامل' : 'Integrated Fire System',
                      rating: 5,
                      status: 'approved',
                      comment:
                        langTab === 'ar'
                          ? 'التزام عالٍ بالمواصفات المعتمدة وسرعة في التنفيذ.'
                          : 'High commitment to certified standards and rapid execution.'
                    },
                    ...list
                  ]);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#113163] text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة للمضمنة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {(reviewsCfg.items || []).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => {
                        const updated = [...(reviewsCfg.items || [])];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        updateReviewsField('items', updated);
                      }}
                      className="font-bold px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[#0f172a] dark:text-white flex-1"
                    />
                    <select
                      value={item.status || 'approved'}
                      onChange={(e) => {
                        const updated = [...(reviewsCfg.items || [])];
                        updated[idx] = { ...updated[idx], status: e.target.value };
                        updateReviewsField('items', updated);
                      }}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] font-bold"
                    >
                      <option value="approved">معتمد ومنشور</option>
                      <option value="pending">مخفي / قيد المراجعة</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(reviewsCfg.items || [])];
                        updated.splice(idx, 1);
                        updateReviewsField('items', updated);
                      }}
                      className="text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.company || ''}
                      onChange={(e) => {
                        const updated = [...(reviewsCfg.items || [])];
                        updated[idx] = { ...updated[idx], company: e.target.value };
                        updateReviewsField('items', updated);
                      }}
                      placeholder="الشركة"
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31]"
                    />
                    <select
                      value={item.rating || 5}
                      onChange={(e) => {
                        const updated = [...(reviewsCfg.items || [])];
                        updated[idx] = { ...updated[idx], rating: Number(e.target.value) };
                        updateReviewsField('items', updated);
                      }}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31]"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} نجوم
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    value={item.comment || ''}
                    onChange={(e) => {
                      const updated = [...(reviewsCfg.items || [])];
                      updated[idx] = { ...updated[idx], comment: e.target.value };
                      updateReviewsField('items', updated);
                    }}
                    className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Announcement Ticker Settings */}
          <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h5 className="font-bold text-sm text-[#0f172a] dark:text-white">
                إعدادات شريط الإعلانات المتحرك ({langTab === 'ar' ? 'العربية' : 'English'})
              </h5>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tickerCfg.enabled !== false}
                    onChange={(e) => updateTickerField('enabled', e.target.checked)}
                    className="w-4 h-4 accent-[#c59a45]"
                  />
                  <span>تفعيل الشريط المتحرك</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tickerCfg.includeApprovedReviews !== false}
                    onChange={(e) =>
                      updateTickerField('includeApprovedReviews', e.target.checked)
                    }
                    className="w-4 h-4 accent-[#c59a45]"
                  />
                  <span>دمج آراء العملاء المعتمدة تلقائياً</span>
                </label>
                <select
                  value={tickerCfg.speed || 'medium'}
                  onChange={(e) => updateTickerField('speed', e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] font-bold"
                >
                  <option value="slow">حركة هادئة (بطيء)</option>
                  <option value="medium">حركة متوازنة (متوسط)</option>
                  <option value="fast">حركة سريعة</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h5 className="font-bold text-sm text-[#0f172a] dark:text-white">
              بنود شريط الإعلانات والتحديثات ({(tickerCfg.items || []).length})
            </h5>
            <button
              type="button"
              onClick={addAnnouncement}
              className="btn-flashy-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0b1120] shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة إعلان جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {(tickerCfg.items || []).map((ann, idx) => (
              <div
                key={ann.id || idx}
                className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={ann.badge || ''}
                      onChange={(e) => {
                        const updated = [...(tickerCfg.items || [])];
                        updated[idx] = { ...updated[idx], badge: e.target.value };
                        updateTickerField('items', updated);
                      }}
                      placeholder="الوسم (مثال: تحديث جديد)"
                      className="w-36 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#9c7224] dark:text-[#dfb76c] font-bold"
                    />
                    <select
                      value={ann.linkPage || ''}
                      onChange={(e) => {
                        const updated = [...(tickerCfg.items || [])];
                        updated[idx] = { ...updated[idx], linkPage: e.target.value };
                        updateTickerField('items', updated);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] font-semibold"
                    >
                      <option value="">بدون رابط صفحة</option>
                      <option value="products">صفحة المنتجات</option>
                      <option value="services">صفحة الخدمات</option>
                      <option value="about">من نحن والتراخيص</option>
                      <option value="contact">تواصل معنا</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(tickerCfg.items || [])];
                      updated.splice(idx, 1);
                      updateTickerField('items', updated);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={ann.text || ''}
                  onChange={(e) => {
                    const updated = [...(tickerCfg.items || [])];
                    updated[idx] = { ...updated[idx], text: e.target.value };
                    updateTickerField('items', updated);
                  }}
                  placeholder="نص الإعلان أو التحديث..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-semibold"
                />
              </div>
            ))}
          </div>

          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            ملاحظة: بعد تعديل الشريط أو النصوص الأساسية، اضغط «حفظ التغييرات ومزامنة مع السحابة» بالأسفل.
          </p>
        </div>
      )}
    </div>
  );
}
