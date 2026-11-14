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
  Edit3
} from 'lucide-react';
import { updateVisitorProfile, logoutVisitor } from '../services/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  lang = 'ar',
  onLogout
}) {
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'requests'
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [consultations, setConsultations] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCompany(user.company || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Fetch submitted consultations/requests for this user
  useEffect(() => {
    if (!isOpen || !user) return;

    async function loadRequests() {
      setLoadingRequests(true);
      const results = [];

      // 1. Read from localStorage consultations
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

      // 2. Read from Firestore consultations if available
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
        className="relative w-full max-w-lg bg-white dark:bg-[#131c31] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with User Summary */}
        <div className="relative px-6 py-6 bg-gradient-to-r from-[#162d6c] via-[#0f2152] to-[#162d6c] text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black text-xl flex items-center justify-center shadow-lg border-2 border-white/20">
                {user.name ? user.name.trim()[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">{user.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c59a45]/25 text-[#dfb76c] border border-[#c59a45]/40">
                    {isAr ? 'زائر معتمد' : 'Verified Client'}
                  </span>
                </div>
                <p className="text-xs text-blue-200/90 font-mono mt-0.5" dir="ltr">
                  {user.phone || user.email || 'Tasami Member'}
                </p>
                {user.company && (
                  <p className="text-[11px] text-[#dfb76c] flex items-center gap-1 mt-0.5">
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

          {/* Sub Navigation Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 mt-5 rounded-xl bg-black/25 border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isAr ? 'بيانات الحساب' : 'Profile Info'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isAr ? 'استشاراتي وطلباتي' : 'My Requests'}</span>
              {consultations.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#162d6c] text-white">
                  {consultations.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(92vh-170px)]">
          {statusMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{statusMsg}</span>
            </div>
          )}

          {activeTab === 'profile' ? (
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
          ) : (
            <div className="space-y-3">
              {loadingRequests ? (
                <div className="py-12 text-center">
                  <div className="w-8 h-8 border-3 border-[#c59a45] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span className="text-xs text-slate-500">{isAr ? 'جاري استرجاع طلباتك...' : 'Loading requests...'}</span>
                </div>
              ) : consultations.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? 'لا توجد طلبات أو استشارات سابقة' : 'No previous requests found'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr ? 'عند تقديمك لأي استشارة أو طلب عرض سعر، ستظهر تفاصيلها وحالتها هنا مباشرة.' : 'Your submitted consultation requests and quotes will be tracked here.'}
                  </p>
                </div>
              ) : (
                consultations.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 space-y-2 text-right rtl:text-right ltr:text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#162d6c] dark:text-[#60a5fa]">
                        {item.service || (isAr ? 'طلب استشارة عامة' : 'General Consultation')}
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
                      <span>{item.city || (isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia')}</span>
                      <span>{item.date ? new Date(item.date).toLocaleDateString('ar-SA') : (isAr ? 'طلب حديث' : 'Recent')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
