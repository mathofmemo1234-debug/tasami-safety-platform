import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  Shield,
  Save,
  Plus,
  Trash2,
  Edit,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Layers,
  Package,
  Wrench,
  Award,
  Phone,
  FileText,
  Building,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import {
  checkAdminPassword,
  updateAdminPassword,
  saveLiveContent,
  uploadMediaFile,
  FIREBASE_CONFIG
} from '../services/firebase';

export default function AdminDashboard({
  isOpen,
  onClose,
  currentContent,
  onContentUpdate
}) {
  if (!isOpen) return null;

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Change password modal
  const [showChangePass, setShowChangePass] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  // Main CMS editing state
  const [activeTab, setActiveTab] = useState('products');
  const [langTab, setLangTab] = useState('ar');
  const [localData, setLocalData] = useState(() => JSON.parse(JSON.stringify(currentContent)));
  const [saveStatus, setSaveStatus] = useState({ state: 'idle', message: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Quick media upload state
  const [uploadedImages, setUploadedImages] = useState([]);

  // Sync when content changes externally
  useEffect(() => {
    if (currentContent) {
      setLocalData(JSON.parse(JSON.stringify(currentContent)));
    }
  }, [currentContent]);

  // Handle Login Check
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsCheckingAuth(true);
    try {
      const isValid = await checkAdminPassword(passwordInput);
      if (isValid) {
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError('الرمز السري غير صحيح. الرمز الافتراضي هو 1234');
      }
    } catch (err) {
      setAuthError('حدث خطأ أثناء التحقق: ' + err.message);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Handle Change Password
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMessage({ type: '', text: '' });

    if (newPin !== confirmPin) {
      setPassMessage({ type: 'error', text: 'الرمز الجديد وتأكيده غير متطابقين' });
      return;
    }
    if (newPin.length < 4) {
      setPassMessage({ type: 'error', text: 'يجب أن يتكون الرمز من 4 خانات على الأقل' });
      return;
    }

    const isOldValid = await checkAdminPassword(oldPin);
    if (!isOldValid) {
      setPassMessage({ type: 'error', text: 'الرمز السري الحالي غير صحيح' });
      return;
    }

    await updateAdminPassword(newPin);
    setPassMessage({ type: 'success', text: 'تم تحديث الرمز السري بنجاح!' });
    setTimeout(() => {
      setShowChangePass(false);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setPassMessage({ type: '', text: '' });
    }, 1200);
  };

  // Save changes to Firebase & Parent State
  const handleSaveAll = async () => {
    setSaveStatus({ state: 'saving', message: 'جارِ الحفظ والمزامنة مع Firebase...' });
    try {
      const result = await saveLiveContent(localData);
      if (result.success) {
        onContentUpdate(localData);
        setSaveStatus({
          state: 'success',
          message: result.message || 'تم حفظ جميع التعديلات ونشرها بنجاح!'
        });
        setTimeout(() => setSaveStatus({ state: 'idle', message: '' }), 3500);
      } else {
        setSaveStatus({ state: 'error', message: 'تعذر الحفظ: ' + result.error });
      }
    } catch (err) {
      setSaveStatus({ state: 'error', message: 'خطأ: ' + err.message });
    }
  };

  // Generic Image Upload Handler
  const handleFileUpload = async (file, onComplete) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadMediaFile(file);
      if (res.success) {
        onComplete(res.url);
        setUploadedImages(prev => [res.url, ...prev]);
      } else {
        alert('تعذر رفع الصورة: ' + res.error);
      }
    } catch (e) {
      alert('خطأ أثناء الرفع: ' + e.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Helper Mutators for LocalData
  const updateNested = (pathArray, value) => {
    setLocalData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let current = next;
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = value;
      return next;
    });
  };

  // Products Helpers
  const addProduct = () => {
    const newProd = {
      id: `prod_${Date.now()}`,
      category: 'networks',
      ar: 'منتج أمان جديد',
      en: 'New Safety Product',
      desc: 'وصف تفصيلي للمنتج ومواصفاته الفنية...',
      image: './images/product-1.jpg',
      specs: 'معتمد SBC / UL',
      videoId: '',
      videoTitle: '',
      videoTitleEn: ''
    };
    const currentList = localData.ar.productsCatalog.items || [];
    updateNested(['ar', 'productsCatalog', 'items'], [newProd, ...currentList]);
    updateNested(['en', 'productsCatalog', 'items'], [newProd, ...(localData.en.productsCatalog.items || [])]);
  };

  const deleteProduct = (prodId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    const arItems = (localData.ar.productsCatalog.items || []).filter(p => p.id !== prodId);
    const enItems = (localData.en.productsCatalog.items || []).filter(p => p.id !== prodId);
    updateNested(['ar', 'productsCatalog', 'items'], arItems);
    updateNested(['en', 'productsCatalog', 'items'], enItems);
  };

  // Services Helpers
  const addServiceCategory = () => {
    const newCat = {
      title: 'نظام سلامة جديد',
      desc: 'وصف النظام ومجالات حمايته الفنية...'
    };
    const list = localData.ar.coreServices.categories || [];
    updateNested(['ar', 'coreServices', 'categories'], [...list, newCat]);
  };

  const deleteServiceCategory = (idx) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    const list = (localData.ar.coreServices.categories || []).filter((_, i) => i !== idx);
    updateNested(['ar', 'coreServices', 'categories'], list);
  };

  // Licenses Helpers
  const addLicenseDoc = () => {
    const newDoc = {
      title: 'وثيقة رسمية جديدة',
      authority: 'الجهة المصدرة',
      note: 'ساري وموثق',
      image: './images/profile/doc-salamah.jpg'
    };
    const list = localData.ar.certificationsAndLicenses.legalDocuments || [];
    updateNested(['ar', 'certificationsAndLicenses', 'legalDocuments'], [...list, newDoc]);
    updateNested(['en', 'certificationsAndLicenses', 'legalDocuments'], [...(localData.en.certificationsAndLicenses.legalDocuments || []), newDoc]);
  };

  const deleteLicenseDoc = (idx) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الوثيقة؟')) return;
    const arList = (localData.ar.certificationsAndLicenses.legalDocuments || []).filter((_, i) => i !== idx);
    const enList = (localData.en.certificationsAndLicenses.legalDocuments || []).filter((_, i) => i !== idx);
    updateNested(['ar', 'certificationsAndLicenses', 'legalDocuments'], arList);
    updateNested(['en', 'certificationsAndLicenses', 'legalDocuments'], enList);
  };

  // Visibility Helpers
  const handleToggleSection = (sectionKey) => {
    setLocalData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next.ar) next.ar = {};
      if (!next.ar.visibility) next.ar.visibility = {};
      if (!next.en) next.en = {};
      if (!next.en.visibility) next.en.visibility = {};

      const currentVal = next[langTab]?.visibility?.[sectionKey] !== false;
      const newVal = !currentVal;

      next.ar.visibility[sectionKey] = newVal;
      next.en.visibility[sectionKey] = newVal;
      return next;
    });
  };

  const handleToggleDocument = (docId) => {
    setLocalData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next.ar) next.ar = {};
      if (!next.ar.visibility) next.ar.visibility = {};
      if (!next.ar.visibility.documents) next.ar.visibility.documents = {};
      if (!next.en) next.en = {};
      if (!next.en.visibility) next.en.visibility = {};
      if (!next.en.visibility.documents) next.en.visibility.documents = {};

      const currentVal = next[langTab]?.visibility?.documents?.[docId] !== false;
      const newVal = !currentVal;

      next.ar.visibility.documents[docId] = newVal;
      next.en.visibility.documents[docId] = newVal;
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0b1120]/85 backdrop-blur-md animate-fade-in font-cairo">
      
      {/* 1. AUTHENTICATION LOCK SCREEN (If not yet logged in) */}
      {!isAuthenticated ? (
        <div className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 rounded-3xl max-w-md w-full p-8 shadow-2xl relative text-center space-y-6">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 rtl:left-5 ltr:right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c59a45] to-[#9a752a] text-[#0b1120] mx-auto flex items-center justify-center shadow-gold-glow">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-black text-[#0f172a] dark:text-white">
              بوابة مدير النظام والتحكم بالموقع
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              الرجاء إدخال الرمز السري للوصول إلى لوحة التحكم وقاعدة بيانات Firebase
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="أدخل الرمز السري (الافتراضي 1234)"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white text-center font-mono tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-[#c59a45]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title={showPassword ? 'إخفاء الرمز' : 'إظهار الرمز'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isCheckingAuth}
              className="btn-flashy-gold w-full py-3.5 rounded-xl font-bold text-sm text-[#0b1120] flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{isCheckingAuth ? 'جارِ التحقق...' : 'دخول لوحة التحكم'}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            <span>الرمز السري الافتراضي مشفر ومحمي: </span>
            <span className="font-mono font-bold text-[#c59a45]">••••</span>
          </div>
        </div>
      ) : (

        /* 2. MAIN CMS CONTROL DASHBOARD */
        <div className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 rounded-3xl max-w-6xl w-full h-[92vh] flex flex-col overflow-hidden shadow-2xl">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/60 dark:bg-[#0b1120]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#162d6c] to-[#1d4ed8] text-white flex items-center justify-center font-bold">
                <Shield className="w-5 h-5 text-[#dfb76c]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-[#0f172a] dark:text-white">
                    لوحة مدير الموقع وقاعدة البيانات (Firebase CMS)
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>متصل بـ {FIREBASE_CONFIG.projectId}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  تحكم فوري بكافة محتويات الواجهة، المنتجات، التراخيص، والصور بكل سهولة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Change Password Trigger */}
              <button
                onClick={() => setShowChangePass(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 hover:border-[#c59a45] transition shadow-sm"
                title="تغيير الرمز السري لمدير الموقع"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#c59a45]" />
                <span className="hidden sm:inline">تغيير الرمز السري</span>
              </button>

              {/* Language Switch for Content */}
              <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setLangTab('ar')}
                  className={`px-3 py-1.5 rounded-lg transition ${langTab === 'ar' ? 'bg-[#c59a45] text-[#0b1120]' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  عربي
                </button>
                <button
                  onClick={() => setLangTab('en')}
                  className={`px-3 py-1.5 rounded-lg transition ${langTab === 'en' ? 'bg-[#c59a45] text-[#0b1120]' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  English
                </button>
              </div>

              {/* Save All to Firebase Button */}
              <button
                onClick={handleSaveAll}
                disabled={saveStatus.state === 'saving'}
                className="btn-flashy-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-[#0b1120] shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{saveStatus.state === 'saving' ? 'جارِ النشر...' : 'حفظ ونشر التعديلات'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Status Message Notification Bar */}
          {saveStatus.message && (
            <div className={`px-4 py-2 text-xs font-bold flex items-center justify-between ${
              saveStatus.state === 'success' ? 'bg-emerald-500 text-white' :
              saveStatus.state === 'error' ? 'bg-red-500 text-white' : 'bg-[#c59a45] text-[#0b1120]'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveStatus.message}</span>
              </div>
              <button onClick={() => setSaveStatus({ state: 'idle', message: '' })} className="underline text-[10px]">إغلاق</button>
            </div>
          )}

          {/* Navigation Category Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] px-4 gap-2 py-2">
            {[
              { id: 'visibility', name: '👁️ إظهار / إخفاء الأقسام والمستندات' },
              { id: 'products', name: '📦 كتالوج المنتجات', count: (localData[langTab]?.productsCatalog?.items || []).length },
              { id: 'services', name: '🛠️ الأنظمة والخدمات' },
              { id: 'licenses', name: '📜 التراخيص والاعتمادات', count: (localData[langTab]?.certificationsAndLicenses?.legalDocuments || []).length },
              { id: 'brand', name: '🏢 بيانات الشركة والتواصل' },
              { id: 'hero', name: '🌟 قسم الواجهة الرئيسية (Hero)' },
              { id: 'media', name: '🖼️ رفع وإدارة الصور السريعة' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#162d6c] dark:bg-[#1d4ed8] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Dashboard Body / Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50 dark:bg-[#0b1120] space-y-6">

            {/* TAB 1: PRODUCTS CATALOG MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-[#0f172a] dark:text-white">
                      إدارة كتالوج المنتجات والمعدات ({localData[langTab]?.productsCatalog?.items?.length || 0} منتج)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      إضافة، تعديل، حذف المنتجات وتغيير الصور والمواصفات الفنية وروابط فيديو التركيب
                    </p>
                  </div>
                  <button
                    onClick={addProduct}
                    className="btn-flashy-royal inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة منتج جديد</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(localData[langTab]?.productsCatalog?.items || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-[#c59a45] transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 relative group">
                            <img
                              src={item.image}
                              alt={item.ar || item.en}
                              className="w-full h-full object-cover"
                            />
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                              <Upload className="w-5 h-5 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleFileUpload(e.target.files[0], (url) => {
                                      const updated = [...localData[langTab].productsCatalog.items];
                                      updated[idx].image = url;
                                      updateNested([langTab, 'productsCatalog', 'items'], updated);
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold">
                              #{item.category}
                            </span>
                            <h5 className="font-bold text-sm text-[#0f172a] dark:text-white mt-1">
                              {item.ar || item.en}
                            </h5>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteProduct(item.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Fields */}
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                            اسم المنتج بالعربية:
                          </label>
                          <input
                            type="text"
                            value={item.ar || ''}
                            onChange={(e) => {
                              const updated = [...localData[langTab].productsCatalog.items];
                              updated[idx].ar = e.target.value;
                              updateNested([langTab, 'productsCatalog', 'items'], updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                            Product Name (English):
                          </label>
                          <input
                            type="text"
                            value={item.en || ''}
                            onChange={(e) => {
                              const updated = [...localData[langTab].productsCatalog.items];
                              updated[idx].en = e.target.value;
                              updateNested([langTab, 'productsCatalog', 'items'], updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                            الوصف والمواصفات:
                          </label>
                          <textarea
                            rows={2}
                            value={item.desc || ''}
                            onChange={(e) => {
                              const updated = [...localData[langTab].productsCatalog.items];
                              updated[idx].desc = e.target.value;
                              updateNested([langTab, 'productsCatalog', 'items'], updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                              المعايير والشهادات:
                            </label>
                            <input
                              type="text"
                              value={item.specs || ''}
                              onChange={(e) => {
                                const updated = [...localData[langTab].productsCatalog.items];
                                updated[idx].specs = e.target.value;
                                updateNested([langTab, 'productsCatalog', 'items'], updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                              معرف يوتيوب (Video ID):
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: UHo9BAs3kI0"
                              value={item.videoId || ''}
                              onChange={(e) => {
                                const updated = [...localData[langTab].productsCatalog.items];
                                updated[idx].videoId = e.target.value;
                                updateNested([langTab, 'productsCatalog', 'items'], updated);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                            رابط الصورة (URL أو رفع ملف):
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={item.image || ''}
                              onChange={(e) => {
                                const updated = [...localData[langTab].productsCatalog.items];
                                updated[idx].image = e.target.value;
                                updateNested([langTab, 'productsCatalog', 'items'], updated);
                              }}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-mono text-[11px]"
                            />
                            <label className="px-3 py-1.5 bg-[#c59a45] hover:bg-[#dfb76c] text-[#0b1120] rounded-lg font-bold flex items-center gap-1 cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              <span>رفع</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleFileUpload(e.target.files[0], (url) => {
                                      const updated = [...localData[langTab].productsCatalog.items];
                                      updated[idx].image = url;
                                      updateNested([langTab, 'productsCatalog', 'items'], updated);
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: SERVICES & LIFE CYCLE */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-[#0f172a] dark:text-white">
                      إدارة الخدمات الهندسية ومراحل التنفيذ
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      تعديل نصوص وتفاصيل شبكات الإطفاء، الغازات، الصيانة، ومراحل العمل
                    </p>
                  </div>
                  <button
                    onClick={addServiceCategory}
                    className="btn-flashy-royal inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة خدمة جديدة</span>
                  </button>
                </div>

                {/* Service Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(localData[langTab]?.coreServices?.categories || []).map((srv, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-lg bg-[#c59a45]/15 text-[#9a752a] dark:text-[#dfb76c] font-bold text-xs flex items-center justify-center">
                          0{idx + 1}
                        </span>
                        <button
                          onClick={() => deleteServiceCategory(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={srv.title || ''}
                        onChange={(e) => {
                          const updated = [...localData[langTab].coreServices.categories];
                          updated[idx].title = e.target.value;
                          updateNested([langTab, 'coreServices', 'categories'], updated);
                        }}
                        className="w-full font-bold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-sm text-[#0f172a] dark:text-white"
                      />

                      <textarea
                        rows={2}
                        value={srv.desc || ''}
                        onChange={(e) => {
                          const updated = [...localData[langTab].coreServices.categories];
                          updated[idx].desc = e.target.value;
                          updateNested([langTab, 'coreServices', 'categories'], updated);
                        }}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                      />
                    </div>
                  ))}
                </div>

                {/* Service Stages Table (المعاينة، التوريد، التركيب...) */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="font-black text-sm text-[#0f172a] dark:text-white mb-3">
                    مراحل الخدمة والمزايا التنافسية (جدول مراحل العمل):
                  </h4>
                  <div className="space-y-3">
                    {(localData[langTab]?.coreServices?.serviceTable || []).map((row, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-[#131c31] rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3"
                      >
                        <input
                          type="text"
                          value={row.name || ''}
                          onChange={(e) => {
                            const updated = [...localData[langTab].coreServices.serviceTable];
                            updated[idx].name = e.target.value;
                            updateNested([langTab, 'coreServices', 'serviceTable'], updated);
                          }}
                          className="font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                        />
                        <input
                          type="text"
                          value={row.detail || ''}
                          onChange={(e) => {
                            const updated = [...localData[langTab].coreServices.serviceTable];
                            updated[idx].detail = e.target.value;
                            updateNested([langTab, 'coreServices', 'serviceTable'], updated);
                          }}
                          className="sm:col-span-2 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LICENSES & CERTIFICATIONS */}
            {activeTab === 'licenses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-[#0f172a] dark:text-white">
                      إدارة التراخيص والوثائق الحكومية الرسمية
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      تعديل شهادات الاستثمار، السجلات، تراخيص الدفاع المدني ورفع صور المستندات
                    </p>
                  </div>
                  <button
                    onClick={addLicenseDoc}
                    className="btn-flashy-royal inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة وثيقة رسمية</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(localData[langTab]?.certificationsAndLicenses?.legalDocuments || []).map((doc, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm hover:border-[#c59a45] transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-16 rounded-xl bg-slate-100 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 overflow-hidden relative group">
                          {doc.image ? (
                            <img src={doc.image} alt={doc.title} className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-6 h-6 m-auto text-slate-400" />
                          )}
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                            <Upload className="w-4 h-4 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(e.target.files[0], (url) => {
                                    const updated = [...localData[langTab].certificationsAndLicenses.legalDocuments];
                                    updated[idx].image = url;
                                    updateNested([langTab, 'certificationsAndLicenses', 'legalDocuments'], updated);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                        <button
                          onClick={() => deleteLicenseDoc(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        <input
                          type="text"
                          placeholder="عنوان الوثيقة"
                          value={doc.title || ''}
                          onChange={(e) => {
                            const updated = [...localData[langTab].certificationsAndLicenses.legalDocuments];
                            updated[idx].title = e.target.value;
                            updateNested([langTab, 'certificationsAndLicenses', 'legalDocuments'], updated);
                          }}
                          className="w-full font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="الجهة المصدرة"
                          value={doc.authority || ''}
                          onChange={(e) => {
                            const updated = [...localData[langTab].certificationsAndLicenses.legalDocuments];
                            updated[idx].authority = e.target.value;
                            updateNested([langTab, 'certificationsAndLicenses', 'legalDocuments'], updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="ملاحظة الحالة"
                          value={doc.note || ''}
                          onChange={(e) => {
                            const updated = [...localData[langTab].certificationsAndLicenses.legalDocuments];
                            updated[idx].note = e.target.value;
                            updateNested([langTab, 'certificationsAndLicenses', 'legalDocuments'], updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="مسار الصورة / URL"
                          value={doc.image || ''}
                          onChange={(e) => {
                            const updated = [...localData[langTab].certificationsAndLicenses.legalDocuments];
                            updated[idx].image = e.target.value;
                            updateNested([langTab, 'certificationsAndLicenses', 'legalDocuments'], updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: BRAND & CONTACT INFO */}
            {activeTab === 'brand' && (
              <div className="bg-white dark:bg-[#131c31] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                <h4 className="font-black text-base text-[#0f172a] dark:text-white">
                  معلومات وهوية الشركة والتواصل الرسمي
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">اسم الشركة:</label>
                    <input
                      type="text"
                      value={localData[langTab]?.brand?.name || ''}
                      onChange={(e) => updateNested([langTab, 'brand', 'name'], e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">الشعار اللفظي (Motto):</label>
                    <input
                      type="text"
                      value={localData[langTab]?.brand?.motto || ''}
                      onChange={(e) => updateNested([langTab, 'brand', 'motto'], e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">الرسالة الترويجية (Slogan):</label>
                    <input
                      type="text"
                      value={localData[langTab]?.brand?.slogan || ''}
                      onChange={(e) => updateNested([langTab, 'brand', 'slogan'], e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">أرقام الهواتف:</label>
                    <input
                      type="text"
                      value={localData[langTab]?.contact?.phone || ''}
                      onChange={(e) => updateNested([langTab, 'contact', 'phone'], e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">العنوان ومقر الشركة:</label>
                    <input
                      type="text"
                      value={localData[langTab]?.contact?.address || ''}
                      onChange={(e) => updateNested([langTab, 'contact', 'address'], e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HERO SECTION */}
            {activeTab === 'hero' && (
              <div className="bg-white dark:bg-[#131c31] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="font-black text-base text-[#0f172a] dark:text-white">
                  نصوص ومحتوى القسم الرئيسي (Hero Section)
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">العنوان الرئيسي (Title):</label>
                    <input
                      type="text"
                      value={localData[langTab]?.hero?.title || ''}
                      onChange={(e) => updateNested([langTab, 'hero', 'title'], e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">العنوان الفرعي (Subtitle):</label>
                    <input
                      type="text"
                      value={localData[langTab]?.hero?.subtitle || ''}
                      onChange={(e) => updateNested([langTab, 'hero', 'subtitle'], e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1 font-bold">الفقرة التوضيحية (Description):</label>
                    <textarea
                      rows={3}
                      value={localData[langTab]?.hero?.description || ''}
                      onChange={(e) => updateNested([langTab, 'hero', 'description'], e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: QUICK MEDIA UPLOAD STUDIO */}
            {activeTab === 'media' && (
              <div className="bg-white dark:bg-[#131c31] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div>
                  <h4 className="font-black text-base text-[#0f172a] dark:text-white">
                    استوديو رفع وتخزين الصور على Firebase
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ارفع أي صورة مباشرة من جهازك للحصول على رابط فوري لاستخدامه في المنتجات أو التراخيص
                  </p>
                </div>

                <div className="border-2 border-dashed border-[#c59a45]/60 hover:border-[#c59a45] rounded-2xl p-8 text-center bg-slate-50/70 dark:bg-[#0b1120] transition">
                  <ImageIcon className="w-12 h-12 text-[#c59a45] mx-auto mb-3" />
                  <p className="text-xs font-bold text-[#0f172a] dark:text-white mb-2">
                    اضغط هنا لاختيار صورة من جهازك ورفعها إلى Firebase Storage
                  </p>
                  <label className="btn-flashy-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-[#0b1120] cursor-pointer shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'جارِ الرفع...' : 'اختيار صورة ورفعها'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], (url) => {
                            alert('تم رفع الصورة بنجاح! تم نسخ الرابط إلى الاستوديو أدناه.');
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-[#0f172a] dark:text-white">
                      الصور المرفوعة حديثاً في هذه الجلسة:
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {uploadedImages.map((imgUrl, i) => (
                        <div key={i} className="p-2 bg-slate-100 dark:bg-[#0b1120] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                          <img src={imgUrl} alt="Uploaded" className="w-full h-24 object-contain rounded bg-white p-1" />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(imgUrl);
                              alert('تم نسخ رابط الصورة إلى الحافظة!');
                            }}
                            className="w-full py-1 rounded bg-[#162d6c] text-white text-[10px] font-bold"
                          >
                            نسخ الرابط
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: VISIBILITY CONTROL (إظهار / إخفاء الأقسام والمستندات) */}
            {activeTab === 'visibility' && (
              <div className="space-y-8 animate-fade-in font-cairo">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#162d6c]/10 via-[#c59a45]/15 to-transparent p-5 rounded-2xl border border-[#c59a45]/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#162d6c] text-[#dfb76c] flex items-center justify-center font-bold shadow">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#0f172a] dark:text-white">
                        لوحة التحكم بظهور أجزاء الموقع والمستندات الثبوتية
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        تحكم فوري ودقيق في إظهار أو إخفاء أي قسم في الموقع أو أي وثيقة ومستند ثبوتي بضغطة زر واحدة
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section A: Main Website Sections Visibility */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <h5 className="text-sm font-black text-[#0f172a] dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#c59a45]" />
                      <span>أقسام الموقع الرئيسية (Website Sections)</span>
                    </h5>
                    <span className="text-xs text-slate-400 font-medium">
                      يمكنك تعطيل ظهور أي قسم مؤقتاً دون حذفه
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {[
                      { key: 'hero', title: 'الواجهة الرئيسية (Hero Section)', desc: 'صورة المهندس والشعار الرئيسي وأزرار المعاينة السريعة' },
                      { key: 'about', title: 'نبذة عن الشركة (About Section)', desc: 'التعريف بشركة تسامي ورؤية 2030 والاعتمادات الرسمية' },
                      { key: 'ceo', title: 'كلمة الرئيس التنفيذي (أ. طه هندي)', desc: 'الرسالة القيادية والصورة والرؤية التنفيذية للمدير التنفيذي' },
                      { key: 'missionVision', title: 'الرؤية والرسالة (Vision & Mission)', desc: 'بطاقات الرؤية والرسالة والصور التعبيرية المتناسقة' },
                      { key: 'goalsValues', title: 'الأهداف والقيم (Goals & Values)', desc: 'أهداف تسامي الاستراتيجية وقيم العمل المؤسسية' },
                      { key: 'orgChart', title: 'الهيكل التنظيمي (Organizational Chart)', desc: 'المخطط الهيكلي لأقسام الشركة الفنية والإدارية' },
                      { key: 'brandIdentity', title: 'الهوية البصرية الرسمية (Brand Identity)', desc: 'عرض ألوان الهوية ولوحة الخطوط والمطبوعات المعتمدة' },
                      { key: 'services', title: 'الأنظمة والخدمات (Services)', desc: 'أنظمة الإطفاء والإنذار والتوريد والتركيب والصيانة' },
                      { key: 'products', title: 'كتالوج المنتجات والمعدات (Products)', desc: 'قائمة منتجات ومهمات السلامة ومقاطع الفيديو التوضيحية' },
                      { key: 'licenses', title: 'التراخيص والاعتمادات (Certificates)', desc: 'شهادات الدفاع المدني، كود البناء، سابر، والمستندات الرسمية' },
                      { key: 'calculator', title: 'حاسبة متطلبات السلامة (Calculator)', desc: 'حاسبة التقدير الأولي للتكاليف والأنظمة الإلزامية' },
                      { key: 'projects', title: 'سابقة الأعمال والمشاريع (Projects)', desc: 'المشاريع المنفذة وتطبيقات أنظمة السلامة' },
                      { key: 'map', title: 'خريطة المقر الرئيسي (Google Maps)', desc: 'خريطة الموقع التفاعلية في مكة المكرمة – الشوقية' },
                      { key: 'contact', title: 'قسم التواصل ونموذج المعاينة (Contact)', desc: 'أرقام الهواتف ونموذج طلب المعاينة وروابط التواصل' }
                    ].map(sec => {
                      const isVisible = localData[langTab]?.visibility?.[sec.key] !== false;
                      return (
                        <div
                          key={sec.key}
                          onClick={() => handleToggleSection(sec.key)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                            isVisible
                              ? 'bg-white dark:bg-[#131c31] border-emerald-500/40 shadow-sm hover:border-emerald-500'
                              : 'bg-slate-100/60 dark:bg-[#0b1120]/60 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-90'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${isVisible ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                              <h6 className="text-xs font-black text-[#0f172a] dark:text-white">
                                {sec.title}
                              </h6>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {sec.desc}
                            </p>
                          </div>

                          <div className="flex-shrink-0 flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isVisible
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {isVisible ? 'معروض' : 'مخفي'}
                            </span>
                            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                              isVisible ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                            }`}>
                              <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section B: Statutory Documents Visibility */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <h5 className="text-sm font-black text-[#0f172a] dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#c59a45]" />
                      <span>المستندات والوثائق الثبوتية الرسمية (Statutory Documents)</span>
                    </h5>
                    <span className="text-xs text-slate-400 font-medium">
                      التحكم في ظهور كل وثيقة رسمية في الموقع بشكل منفرد
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {[
                      { id: 'doc-misa', title: '1. شهادة تسجيل الاستثمار – وزارة الاستثمار', auth: 'وزارة الاستثمار (MISA)', img: './images/profile/doc-misa.jpg' },
                      { id: 'doc-cr-ar', title: '2. شهادة السجل التجاري (عربي)', auth: 'وزارة التجارة - المملكة العربية السعودية', img: './images/profile/doc-cr-ar.jpg' },
                      { id: 'doc-cr-en', title: '3. Commercial Registration Certificate (English)', auth: 'Ministry of Commerce - KSA', img: './images/profile/doc-cr-en.jpg' },
                      { id: 'doc-chamber', title: '4. شهادة انتساب الغرفة التجارية بمكة المكرمة', auth: 'غرفة مكة المكرمة', img: './images/profile/doc-chamber.jpg' },
                      { id: 'doc-gosi', title: '5. شهادة التأمينات الاجتماعية (GOSI)', auth: 'المؤسسة العامة للتأمينات الاجتماعية', img: './images/profile/doc-gosi.jpg' },
                      { id: 'doc-salamah', title: '6. ترخيص الدفاع المدني – سلامة', auth: 'المديرية العامة للدفاع المدني', img: './images/profile/doc-salamah.jpg' },
                      { id: 'doc-balady', title: '7. رخصة نشاط تجاري – بلدي', auth: 'وزارة الشؤون البلدية والقروية والإسكان', img: './images/profile/doc-balady.jpg' },
                      { id: 'doc-vat', title: '8. شهادة ضريبة القيمة المضافة (ZATCA)', auth: 'هيئة الزكاة والضريبة والجمارك', img: './images/profile/doc-vat.jpg' }
                    ].map(doc => {
                      const isVisible = localData[langTab]?.visibility?.documents?.[doc.id] !== false;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => handleToggleDocument(doc.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                            isVisible
                              ? 'bg-white dark:bg-[#131c31] border-emerald-500/40 shadow-sm hover:border-emerald-500'
                              : 'bg-slate-100/60 dark:bg-[#0b1120]/60 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-90'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={doc.img}
                              alt={doc.title}
                              className="w-12 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 bg-white shadow-sm flex-shrink-0"
                            />
                            <div className="space-y-0.5">
                              <h6 className="text-xs font-black text-[#0f172a] dark:text-white line-clamp-1">
                                {doc.title}
                              </h6>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                {doc.auth}
                              </p>
                              <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                isVisible
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                              }`}>
                                {isVisible ? 'مستند معروض للزوار' : 'مستند مخفي'}
                              </span>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <div className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                              isVisible ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                            }`}>
                              <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Footer Save Strip */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              جميع التعديلات يتم ربطها تلقائياً مع قاعدة بيانات Firebase وتظهر للمتصفحين فوراً عند الحفظ.
            </span>
            <button
              onClick={handleSaveAll}
              disabled={saveStatus.state === 'saving'}
              className="btn-flashy-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black text-[#0b1120]"
            >
              <Save className="w-4 h-4" />
              <span>{saveStatus.state === 'saving' ? 'جارِ النشر...' : 'حفظ ونشر التعديلات'}</span>
            </button>
          </div>

        </div>
      )}

      {/* 3. CHANGE PASSWORD MODAL */}
      {showChangePass && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-right rtl:text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-black text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#c59a45]" />
                <span>تغيير الرمز السري لمدير الموقع</span>
              </h4>
              <button onClick={() => setShowChangePass(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                  الرمز السري الحالي:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-center font-mono tracking-widest text-base"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                  الرمز السري الجديد:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-center font-mono tracking-widest text-base"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                  تأكيد الرمز الجديد:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-center font-mono tracking-widest text-base"
                />
              </div>

              {passMessage.text && (
                <div className={`p-2 rounded-lg text-center font-bold text-[11px] ${
                  passMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {passMessage.text}
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="btn-flashy-gold flex-1 py-2.5 rounded-xl font-bold text-[#0b1120]"
                >
                  حفظ الرمز الجديد
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePass(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
